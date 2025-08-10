// Alternative: Utilisation de la Web Streams API pour une meilleure gestion mémoire
// Cette approche sera implémentée si les problèmes de mémoire persistent

import { zipSync, strToU8 } from 'fflate';

// Fonction pour traiter les fichiers par chunks
export const processFileInChunks = async (file: File, chunkSize: number = 1024 * 1024): Promise<Uint8Array[]> => {
  const chunks: Uint8Array[] = [];
  const fileSize = file.size;
  
  for (let start = 0; start < fileSize; start += chunkSize) {
    const end = Math.min(start + chunkSize, fileSize);
    const chunk = file.slice(start, end);
    const arrayBuffer = await chunk.arrayBuffer();
    chunks.push(new Uint8Array(arrayBuffer));
  }
  
  return chunks;
};

// Fonction pour encoder en base64 par chunks (alternative plus robuste)
export const encodeToBase64Chunks = (data: Uint8Array): string => {
  const chunkSize = 1024;
  let result = '';
  
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    let chunkStr = '';
    
    // Conversion byte par byte pour éviter les erreurs de pile
    for (let j = 0; j < chunk.length; j++) {
      chunkStr += String.fromCharCode(chunk[j]);
    }
    
    result += chunkStr;
  }
  
  try {
    return btoa(result);
  } catch (error) {
    console.error('Erreur lors de l\'encodage base64:', error);
    throw new Error('Fichier trop volumineux pour l\'encodage base64');
  }
};

// Fonction pour créer un ZIP avec gestion mémoire optimisée
export const createOptimizedZip = async (files: File[]): Promise<Blob> => {
  const zipData: Record<string, Uint8Array> = {};
  
  for (const file of files) {
    // Traitement par chunks pour les gros fichiers
    if (file.size > 10 * 1024 * 1024) { // Plus de 10MB
      console.log(`Traitement en chunks du fichier: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
      
      const chunks = await processFileInChunks(file);
      const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
      const combined = new Uint8Array(totalLength);
      
      let offset = 0;
      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }
      
      zipData[file.name] = combined;
    } else {
      // Traitement normal pour les petits fichiers
      const arrayBuffer = await file.arrayBuffer();
      zipData[file.name] = new Uint8Array(arrayBuffer);
    }
  }
  
  const compressed = zipSync(zipData, { level: 6 });
  return new Blob([compressed], { type: 'application/zip' });
};
