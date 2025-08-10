import React from 'react';
import { Archive, Download, Shield, Loader2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useOperation } from '@/hooks/use-loading-hooks';
import { InlineLoading } from '@/components/ui/loading';
import { LoadingButton } from '@/components/ui/loading-button';
import { PerformanceMetrics } from '@/components/ui/performance-metrics';
import { OptimizationTip } from '@/components/ui/optimization-tip';
import { FileDropZone } from './FileDropZone';
import { FileList } from './FileList';
import { PasswordInput } from './PasswordInput';
import { createPasswordProtectedZip, createStandardZip, downloadBlob, generateZipFilename } from '@/utils/zipUtils';

export const FileZipper: React.FC = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isCreating, setIsCreating] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [useEncryption, setUseEncryption] = React.useState(true);
  const [isProcessingFiles, setIsProcessingFiles] = React.useState(false);
  const { toast } = useToast();
  
  // Hook pour gérer le loading global
  const zipOperation = useOperation(
    useEncryption ? "Création de l'archive sécurisée" : "Création de l'archive ZIP"
  );
  const fileProcessingOperation = useOperation("Traitement des fichiers");

  const handleFilesAdded = React.useCallback(async (newFiles: File[]) => {
    if (newFiles.length === 0) return;

    // Si beaucoup de fichiers, afficher un loading
    if (newFiles.length > 10) {
      setIsProcessingFiles(true);
      fileProcessingOperation.startOperation();
      
      // Traitement des fichiers par chunks pour éviter de bloquer l'UI
      const chunkSize = 50;
      const processedFiles: File[] = [];
      
      for (let i = 0; i < newFiles.length; i += chunkSize) {
        const chunk = newFiles.slice(i, i + chunkSize);
        processedFiles.push(...chunk);
        
        // Mise à jour du progrès
        const progressPercent = Math.round(((i + chunk.length) / newFiles.length) * 100);
        fileProcessingOperation.setProgress(progressPercent);
        
        // Permettre à l'UI de se mettre à jour
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      setFiles(prev => [...prev, ...processedFiles]);
      
      fileProcessingOperation.finishOperation();
      setIsProcessingFiles(false);
      
      toast({
        title: "Fichiers ajoutés",
        description: `${newFiles.length} fichier(s) ajouté(s) avec succès`,
      });
    } else {
      // Traitement normal pour peu de fichiers
      setFiles(prev => [...prev, ...newFiles]);
      toast({
        title: "Fichiers ajoutés",
        description: `${newFiles.length} fichier(s) ajouté(s) à la liste`,
      });
    }
  }, [toast, fileProcessingOperation]);

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

    // Vérifications pour le mode chiffré seulement
    if (useEncryption) {
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

      // Vérification force du mot de passe
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const isLongEnough = password.length >= 8;

      if (!isLongEnough || !hasUpperCase || !hasLowerCase || !hasNumbers) {
        toast({
          title: "Mot de passe trop faible",
          description: "Utilisez au moins 8 caractères avec majuscules, minuscules et chiffres",
          variant: "destructive",
        });
        return;
      }
    }

    // Vérification de la taille totale des fichiers avec limite adaptée pour le chiffrement
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const maxSize = useEncryption ? 200 * 1024 * 1024 : 500 * 1024 * 1024; // 200MB pour chiffré, 500MB pour standard
    
    if (totalSize > maxSize) {
      const limitText = useEncryption ? "200MB" : "500MB";
      toast({
        title: "Fichiers trop volumineux",
        description: `La taille totale des fichiers ne peut pas dépasser ${limitText} ${useEncryption ? "(limitation du chiffrement)" : ""}`,
        variant: "destructive",
      });
      return;
    }

    // Vérification de fichiers individuels pour le chiffrement (limite web)
    if (useEncryption) {
      const maxFileSize = 100 * 1024 * 1024; // 100MB par fichier pour le chiffrement web
      const largeFile = files.find(file => file.size > maxFileSize);
      if (largeFile) {
        toast({
          title: "Fichier trop volumineux",
          description: `Le fichier "${largeFile.name}" (${(largeFile.size / 1024 / 1024).toFixed(1)}MB) dépasse la limite de 100MB pour le chiffrement`,
          variant: "destructive",
        });
        return;
      }
    }

    setIsCreating(true);
    setProgress(0);
    zipOperation.startOperation();

    try {
      // Simulation du progrès pour une meilleure UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + 20, 90);
          zipOperation.setProgress(newProgress);
          return newProgress;
        });
      }, 200);

      let zipBlob: Blob;
      
      if (useEncryption) {
        // Mode chiffré - nécessite cette application pour déchiffrer
        zipBlob = await createPasswordProtectedZip(files, password);
      } else {
        // Mode standard - compatible avec tous les logiciels
        zipBlob = await createStandardZip(files);
      }
      
      clearInterval(progressInterval);
      setProgress(100);
      zipOperation.setProgress(100);

      setTimeout(() => {
        const filename = generateZipFilename();
        downloadBlob(zipBlob, filename);
        
        const description = useEncryption 
          ? `${filename} a été téléchargé avec chiffrement AES-256 (nécessite cette application pour déchiffrer)`
          : `${filename} a été téléchargé (compatible avec tous les logiciels de décompression)`;
        
        toast({
          title: "Archive créée avec succès",
          description,
        });

        // Reset form
        setFiles([]);
        if (useEncryption) {
          setPassword('');
          setConfirmPassword('');
        }
        setProgress(0);
        setIsCreating(false);
        zipOperation.finishOperation();
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
      zipOperation.failOperation();
    }
  }, [files, password, confirmPassword, useEncryption, toast, zipOperation]);

  const canCreateZip = files.length > 0 && (!useEncryption || (password && password === confirmPassword)) && !isCreating && !isProcessingFiles;

  return (
    <div className="space-y-6">
      <FileDropZone 
        onFilesAdded={handleFilesAdded} 
        disabled={isCreating || isProcessingFiles}
      />
      
      <FileList files={files} onRemoveFile={handleRemoveFile} />
      
      {/* Métriques de performance */}
      <PerformanceMetrics 
        fileCount={files.length}
        totalSize={files.reduce((sum, file) => sum + file.size, 0)}
        isProcessing={isProcessingFiles || isCreating}
      />

      {/* Conseils d'optimisation */}
      <OptimizationTip 
        fileCount={files.length}
        totalSize={files.reduce((sum, file) => sum + file.size, 0)}
        className="space-y-2"
      />
      
      {/* Sélecteur de mode */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 text-foreground">Mode de compression</h3>
        <div className="space-y-3">
          <div 
            className={cn(
              "p-3 rounded-lg border-2 cursor-pointer transition-all",
              useEncryption ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            )}
            onClick={() => setUseEncryption(true)}
          >
            <div className="flex items-center space-x-2">
              <input 
                type="radio" 
                checked={useEncryption} 
                onChange={() => setUseEncryption(true)}
                className="text-primary"
              />
              <Shield size={16} className="text-primary" />
              <span className="font-medium">Mode sécurisé (chiffrement AES-256)</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 ml-6">
              ⚠️ Nécessite cette application pour déchiffrer (limite: 100MB par fichier)
            </p>
          </div>

          <div 
            className={cn(
              "p-3 rounded-lg border-2 cursor-pointer transition-all",
              !useEncryption ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            )}
            onClick={() => setUseEncryption(false)}
          >
            <div className="flex items-center space-x-2">
              <input 
                type="radio" 
                checked={!useEncryption} 
                onChange={() => setUseEncryption(false)}
                className="text-primary"
              />
              <Archive size={16} className="text-green-600" />
              <span className="font-medium">Mode standard (ZIP classique)</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 ml-6">
              ✅ Compatible avec WinRAR, 7-Zip, etc. (pas de chiffrement)
            </p>
          </div>
        </div>
      </Card>

      {useEncryption && (
        <PasswordInput
          password={password}
          confirmPassword={confirmPassword}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
        />
      )}

      {!useEncryption && (
        <Card className="p-4">
          <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <Info size={16} className="text-green-600" />
            <p className="text-sm text-green-800 dark:text-green-200">
              Mode standard : L'archive créée pourra être ouverte avec n'importe quel logiciel de décompression
            </p>
          </div>
        </Card>
      )}

      {isCreating && (
        <Card className="p-4">
          <InlineLoading 
            isLoading={isCreating} 
            text="Création de l'archive en cours..." 
            progress={progress}
            size="md"
          />
          <Progress value={progress} className="w-full mt-3" />
        </Card>
      )}

      <div className="flex justify-center">
        <LoadingButton
          onClick={handleCreateZip}
          disabled={!canCreateZip}
          isLoading={isCreating}
          loadingText="Création en cours..."
          size="lg"
          icon={<Archive size={20} />}
          className={cn(
            useEncryption 
              ? "bg-security-gradient text-primary-foreground font-semibold px-8 py-3 hover:shadow-glow-primary" 
              : "bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3",
            "transition-all duration-300"
          )}
        >
          {useEncryption ? "Créer l'archive sécurisée" : "Créer l'archive ZIP"}
          {useEncryption && <Shield size={16} className="ml-2" />}
        </LoadingButton>
      </div>
    </div>
  );
};