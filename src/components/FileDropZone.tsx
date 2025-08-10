import React, { useCallback } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InlineLoading } from '@/components/ui/loading';

interface FileDropZoneProps {
  onFilesAdded: (files: File[]) => void;
  className?: string;
  disabled?: boolean;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({ onFilesAdded, className, disabled = false }) => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    
    if (files.length > 50) {
      setIsProcessing(true);
      // Petit délai pour permettre à l'UI de se mettre à jour
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    onFilesAdded(files);
    
    if (files.length > 50) {
      setIsProcessing(false);
    }
  }, [onFilesAdded, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(false);
    }
  }, [disabled]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length > 50) {
      setIsProcessing(true);
      // Petit délai pour permettre à l'UI de se mettre à jour
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    onFilesAdded(files);
    
    if (files.length > 50) {
      setIsProcessing(false);
    }
    
    // Reset input
    e.target.value = '';
  }, [onFilesAdded]);

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
        "hover:border-primary hover:bg-dropzone-hover",
        isDragOver 
          ? "border-primary bg-dropzone-hover shadow-glow-primary" 
          : "border-dropzone-border bg-dropzone-bg",
        disabled && "opacity-50 cursor-not-allowed",
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
        disabled={disabled || isProcessing}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        aria-label="Sélectionner des fichiers"
      />
      
      <div className="flex flex-col items-center space-y-4">
        <div className={cn(
          "p-4 rounded-full transition-all duration-300",
          isDragOver ? "bg-primary text-primary-foreground shadow-glow-primary" : "bg-secondary text-secondary-foreground"
        )}>
          {isProcessing ? (
            <Loader2 size={32} className="animate-spin" />
          ) : isDragOver ? (
            <FileText size={32} />
          ) : (
            <Upload size={32} />
          )}
        </div>
        
        <div className="space-y-2">
          {isProcessing ? (
            <InlineLoading 
              isLoading={true} 
              text="Traitement des fichiers..." 
              size="md"
            />
          ) : (
            <>
              <h3 className="text-lg font-semibold">
                {isDragOver ? "Déposez vos fichiers ici" : "Glissez-déposez vos fichiers"}
              </h3>
              <p className="text-muted-foreground">
                ou <span className="text-primary font-medium">cliquez pour parcourir</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Tous types de fichiers acceptés
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};