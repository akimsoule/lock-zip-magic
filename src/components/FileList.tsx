import React from 'react';
import { X, File, Image, FileText, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FileListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return Image;
  if (type.includes('text') || type.includes('pdf')) return FileText;
  if (type.includes('zip') || type.includes('archive')) return Archive;
  return File;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const FileList: React.FC<FileListProps> = ({ files, onRemoveFile }) => {
  if (files.length === 0) return null;

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 text-foreground">
        Fichiers sélectionnés ({files.length})
      </h3>
      
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {files.map((file, index) => {
          const IconComponent = getFileIcon(file.type);
          
          return (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <IconComponent size={20} className="text-primary flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFile(index)}
                className="text-muted-foreground hover:text-destructive ml-2 flex-shrink-0"
                aria-label={`Supprimer ${file.name}`}
              >
                <X size={16} />
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};