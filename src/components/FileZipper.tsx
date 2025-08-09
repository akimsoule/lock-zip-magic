import React from 'react';
import { Archive, Download, Shield, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { FileDropZone } from './FileDropZone';
import { FileList } from './FileList';
import { PasswordInput } from './PasswordInput';
import { createPasswordProtectedZip, downloadBlob, generateZipFilename } from '@/utils/zipUtils';

export const FileZipper: React.FC = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isCreating, setIsCreating] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const { toast } = useToast();

  const handleFilesAdded = React.useCallback((newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    toast({
      title: "Fichiers ajoutés",
      description: `${newFiles.length} fichier(s) ajouté(s) à la liste`,
    });
  }, [toast]);

  const handleRemoveFile = React.useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleCreateZip = React.useCallback(async () => {
    if (files.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un fichier",
        variant: "destructive",
      });
      return;
    }

    if (!password) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un mot de passe",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    setProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 20, 90));
      }, 200);

      const zipBlob = await createPasswordProtectedZip(files, password);
      
      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        const filename = generateZipFilename();
        downloadBlob(zipBlob, filename);
        
        toast({
          title: "Archive chiffrée créée avec succès",
          description: `${filename} a été téléchargé avec encryption AES-256`,
        });

        // Reset form
        setFiles([]);
        setPassword('');
        setConfirmPassword('');
        setProgress(0);
        setIsCreating(false);
      }, 500);

    } catch (error) {
      console.error('Erreur lors de la création du ZIP:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'archive",
        variant: "destructive",
      });
      setIsCreating(false);
      setProgress(0);
    }
  }, [files, password, confirmPassword, toast]);

  const canCreateZip = files.length > 0 && password && password === confirmPassword && !isCreating;

  return (
    <div className="space-y-6">
      <FileDropZone onFilesAdded={handleFilesAdded} />
      
      <FileList files={files} onRemoveFile={handleRemoveFile} />
      
      <PasswordInput
        password={password}
        confirmPassword={confirmPassword}
        onPasswordChange={setPassword}
        onConfirmPasswordChange={setConfirmPassword}
      />

      {isCreating && (
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Loader2 size={20} className="animate-spin text-primary" />
              <span className="font-medium">Création de l'archive en cours...</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </Card>
      )}

      <div className="flex justify-center">
        <Button
          onClick={handleCreateZip}
          disabled={!canCreateZip}
          size="lg"
          className={cn(
            "bg-security-gradient text-primary-foreground font-semibold px-8 py-3",
            "hover:shadow-glow-primary transition-all duration-300",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isCreating ? (
            <>
              <Loader2 size={20} className="mr-2 animate-spin" />
              Création en cours...
            </>
          ) : (
            <>
              <Archive size={20} className="mr-2" />
              Créer l'archive ZIP
              <Shield size={16} className="ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};