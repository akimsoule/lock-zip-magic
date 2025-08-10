import { zipSync, strToU8, unzipSync } from 'fflate';
import CryptoJS from 'crypto-js';

export interface ZipFile {
  name: string;
  data: Uint8Array;
}

export interface EncryptedZipMetadata {
  encrypted: boolean;
  algorithm: string;
  files: Array<{
    originalName: string;
    encryptedName: string;
    size: number;
    type: string;
  }>;
  createdAt: string;
}

// Fonction pour créer un ZIP standard (sans chiffrement, juste compression)
export const createStandardZip = async (files: File[]): Promise<Blob> => {
  const zipData: Record<string, Uint8Array> = {};

  // Ajouter chaque fichier sans chiffrement
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    zipData[file.name] = uint8Array;
  }

  // Créer le ZIP avec compression seulement
  const compressed = zipSync(zipData, {
    level: 6 // Niveau de compression
  });

  return new Blob([compressed], { type: 'application/zip' });
};

const encryptFile = (data: Uint8Array, password: string): Uint8Array => {
  // Convert Uint8Array to base64 string for encryption in chunks to avoid memory issues
  let dataString = '';
  const chunkSize = 1024; // Process 1KB at a time to avoid stack overflow
  
  // Conversion plus sûre pour les gros fichiers
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    // Utilisation d'une boucle au lieu du spread operator pour éviter les erreurs de pile
    let chunkString = '';
    for (let j = 0; j < chunk.length; j++) {
      chunkString += String.fromCharCode(chunk[j]);
    }
    dataString += chunkString;
  }
  
  const base64String = btoa(dataString);
  
  // Encrypt with AES-256
  const encrypted = CryptoJS.AES.encrypt(base64String, password, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
  
  // Convert back to Uint8Array
  return strToU8(encrypted);
};

const decryptFile = (encryptedData: Uint8Array, password: string): Uint8Array => {
  try {
    // Vérification de la taille des données
    if (encryptedData.length === 0) {
      throw new Error('Données chiffrées vides');
    }

    // Convert Uint8Array back to encrypted string in chunks to avoid memory issues
    let encryptedString = '';
    const chunkSize = 1024; // Process 1KB at a time
    
    // Conversion plus sûre pour les gros fichiers
    for (let i = 0; i < encryptedData.length; i += chunkSize) {
      const chunk = encryptedData.slice(i, i + chunkSize);
      // Utilisation d'une boucle au lieu du spread operator
      let chunkString = '';
      for (let j = 0; j < chunk.length; j++) {
        chunkString += String.fromCharCode(chunk[j]);
      }
      encryptedString += chunkString;
    }
    
    // Decrypt with AES-256
    const decrypted = CryptoJS.AES.decrypt(encryptedString, password, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    // Convert back to base64 string
    const base64String = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!base64String) {
      throw new Error('Échec du déchiffrement - mot de passe incorrect ou données corrompues');
    }

    // Validation base64
    try {
      // Convert base64 back to binary string in chunks
      const binaryString = atob(base64String);
      const uint8Array = new Uint8Array(binaryString.length);
      
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }
      
      return uint8Array;
    } catch (base64Error) {
      throw new Error('Données déchiffrées invalides - format corrompu');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erreur lors du déchiffrement: ' + String(error));
  }
};

export const createPasswordProtectedZip = async (files: File[], password: string): Promise<Blob> => {
  const zipData: Record<string, Uint8Array> = {};

  // Encrypt each file with the password
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Encrypt the file data
    const encryptedData = encryptFile(uint8Array, password);
    zipData[`${file.name}.encrypted`] = encryptedData;
  }

  // Add a metadata file to indicate this is an encrypted archive
  const metadata = {
    encrypted: true,
    algorithm: 'AES-256-CBC',
    files: files.map(f => ({ 
      originalName: f.name, 
      encryptedName: `${f.name}.encrypted`,
      size: f.size,
      type: f.type
    })),
    createdAt: new Date().toISOString()
  };
  
  zipData['__SECURE_METADATA__.json'] = strToU8(JSON.stringify(metadata, null, 2));

  // Create the zip with encrypted files
  const compressed = zipSync(zipData, {
    level: 6 // Compression level
  });

  return new Blob([compressed], { type: 'application/zip' });
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const generateZipFilename = (): string => {
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 19).replace(/[:-]/g, '');
  return `archive_${timestamp}.zip`;
};

export const decryptPasswordProtectedZip = async (zipFile: File, password: string): Promise<{ files: File[], metadata: EncryptedZipMetadata }> => {
  try {
    console.log('decryptPasswordProtectedZip: Début');
    
    // Read the zip file
    const arrayBuffer = await zipFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    console.log('decryptPasswordProtectedZip: Fichier lu', {
      size: uint8Array.length,
      first10Bytes: Array.from(uint8Array.slice(0, 10))
    });
    
    // Unzip the archive
    const unzipped = unzipSync(uint8Array);
    
    console.log('decryptPasswordProtectedZip: Archive décompressée', {
      files: Object.keys(unzipped)
    });
    
    // Check for metadata file
    const metadataKey = '__SECURE_METADATA__.json';
    if (!unzipped[metadataKey]) {
      console.error('decryptPasswordProtectedZip: Métadonnées manquantes');
      throw new Error('Ce fichier ZIP ne semble pas être un archive chiffrée valide');
    }
    
    // Parse metadata
    const metadataString = String.fromCharCode(...unzipped[metadataKey]);
    console.log('decryptPasswordProtectedZip: Métadonnées brutes:', metadataString);
    
    const metadata = JSON.parse(metadataString);
    console.log('decryptPasswordProtectedZip: Métadonnées parsées:', metadata);
    
    if (!metadata.encrypted) {
      throw new Error('Ce fichier ZIP n\'est pas chiffré');
    }
    
    // Decrypt each file
    const decryptedFiles: File[] = [];
    
    for (const fileInfo of metadata.files) {
      console.log('decryptPasswordProtectedZip: Déchiffrement de:', fileInfo);
      
      const encryptedData = unzipped[fileInfo.encryptedName];
      if (!encryptedData) {
        console.warn(`Fichier chiffré manquant: ${fileInfo.encryptedName}`);
        continue;
      }
      
      try {
        // Decrypt the file data
        const decryptedData = decryptFile(encryptedData, password);
        
        console.log('decryptPasswordProtectedZip: Fichier déchiffré:', {
          originalName: fileInfo.originalName,
          decryptedSize: decryptedData.length
        });
        
        // Create a new File object with the original name
        const file = new File([decryptedData], fileInfo.originalName, {
          type: fileInfo.type || 'application/octet-stream'
        });
        
        decryptedFiles.push(file);
      } catch (error) {
        console.error('decryptPasswordProtectedZip: Erreur déchiffrement fichier:', error);
        throw new Error(`Erreur lors du déchiffrement de ${fileInfo.originalName}: ${(error as Error).message}`);
      }
    }
    
    console.log('decryptPasswordProtectedZip: Terminé avec succès', {
      totalFiles: decryptedFiles.length
    });
    
    return { files: decryptedFiles, metadata };
    
  } catch (error) {
    console.error('decryptPasswordProtectedZip: Erreur globale:', error);
    throw new Error('Erreur lors du déchiffrement de l\'archive: ' + (error as Error).message);
  }
};