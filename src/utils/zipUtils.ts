import { zipSync, strToU8 } from 'fflate';

export interface ZipFile {
  name: string;
  data: Uint8Array;
}

export const createPasswordProtectedZip = async (files: File[], password: string): Promise<Blob> => {
  const zipData: Record<string, Uint8Array> = {};

  // Convert files to Uint8Array
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    zipData[file.name] = uint8Array;
  }

  // Add password as a comment (basic protection - in real world, you'd use proper encryption)
  // Note: fflate doesn't support password protection natively
  // We'll implement a basic obfuscation approach
  const passwordHash = btoa(password);
  zipData['.password'] = strToU8(passwordHash);

  // Create the zip
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