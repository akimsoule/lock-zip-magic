import React, { useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropZoneProps {
  onFilesAdded: (files: File[]) => void;
  className?: string;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({ onFilesAdded, className }) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    onFilesAdded(files);
  }, [onFilesAdded]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFilesAdded(files);
  }, [onFilesAdded]);

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
        "hover:border-primary hover:bg-dropzone-hover",
        isDragOver 
          ? "border-primary bg-dropzone-hover shadow-glow-primary" 
          : "border-dropzone-border bg-dropzone-bg",
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        multiple
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Sélectionner des fichiers"
      />
      
      <div className="flex flex-col items-center space-y-4">
        <div className={cn(
          "p-4 rounded-full transition-all duration-300",
          isDragOver ? "bg-primary text-primary-foreground shadow-glow-primary" : "bg-secondary text-secondary-foreground"
        )}>
          {isDragOver ? <FileText size={32} /> : <Upload size={32} />}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            {isDragOver ? "Déposez vos fichiers ici" : "Glissez-déposez vos fichiers"}
          </h3>
          <p className="text-muted-foreground">
            ou <span className="text-primary font-medium">cliquez pour parcourir</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Tous types de fichiers acceptés
          </p>
        </div>
      </div>
    </div>
  );
};