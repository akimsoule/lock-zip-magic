import { zipSync, strToU8 } from 'fflate';
import CryptoJS from 'crypto-js';

export interface ZipFile {
  name: string;
  data: Uint8Array;
}

const encryptFile = (data: Uint8Array, password: string): Uint8Array => {
  // Convert Uint8Array to base64 string for encryption
  const dataString = btoa(String.fromCharCode(...data));
  
  // Encrypt with AES-256
  const encrypted = CryptoJS.AES.encrypt(dataString, password, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
  
  // Convert back to Uint8Array
  return strToU8(encrypted);
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