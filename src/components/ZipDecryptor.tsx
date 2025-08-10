import React from 'react';
import { Key, Unlock, Download, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useOperation } from '@/hooks/use-loading-hooks';
import { InlineLoading } from '@/components/ui/loading';
import { LoadingButton } from '@/components/ui/loading-button';
import { decryptPasswordProtectedZip, downloadBlob } from '@/utils/zipUtils';

export const ZipDecryptor: React.FC = () => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [password, setPassword] = React.useState('');
  const [isDecrypting, setIsDecrypting] = React.useState(false);
  const [decryptedFiles, setDecryptedFiles] = React.useState<File[]>([]);
  const { toast } = useToast();
  
  // Hook pour gérer le loading global
  const decryptOperation = useOperation("Déchiffrement de l'archive");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/zip') {
      setSelectedFile(file);
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier ZIP valide",
        variant: "destructive",
      });
    }
  };

  const handleDecrypt = async () => {
    if (!selectedFile || !password) return;

    setIsDecrypting(true);
    decryptOperation.startOperation();
    
    try {
      
      // Vérification de la taille du fichier
      if (selectedFile.size > 100 * 1024 * 1024) { // 100MB
        toast({
          title: "Fichier trop volumineux",
          description: "Les fichiers ZIP de plus de 100MB peuvent prendre du temps à déchiffrer",
        });
      }

      console.log('Début du déchiffrement...', {
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        passwordLength: password.length
      });

      // Progression simulée
      decryptOperation.setProgress(25);

      // Déchiffrer l'archive ZIP
      const result = await decryptPasswordProtectedZip(selectedFile, password);
      
      decryptOperation.setProgress(90);
      
      console.log('Déchiffrement réussi:', {
        filesCount: result.files.length,
        files: result.files.map(f => ({ name: f.name, size: f.size }))
      });
      
      setDecryptedFiles(result.files);
      
      toast({
        title: "Déchiffrement réussi",
        description: `${result.files.length} fichier(s) déchiffré(s) avec succès`,
      });
      
      decryptOperation.finishOperation();
    } catch (error) {
      console.error('Erreur complète de déchiffrement:', error);
      console.error('Stack trace:', (error as Error).stack);
      
      // Messages d'erreur plus spécifiques
      let errorMessage = "Une erreur inattendue s'est produite";
      const errorString = (error as Error).message;
      
      console.log('Message d\'erreur:', errorString);
      
      if (errorString.includes('mot de passe') || errorString.includes('incorrect')) {
        errorMessage = "Mot de passe incorrect. Veuillez vérifier et réessayer.";
      } else if (errorString.includes('archive chiffrée valide') || errorString.includes('SECURE_METADATA')) {
        errorMessage = "Ce fichier ne semble pas être une archive créée avec cette application.";
      } else if (errorString.includes('Maximum call stack')) {
        errorMessage = "Fichier trop volumineux pour être traité. Essayez avec des fichiers plus petits.";
      } else if (errorString.includes('déchiffrement')) {
        errorMessage = "Erreur durant le déchiffrement. Fichier possiblement corrompu.";
      } else {
        errorMessage = `Erreur: ${errorString}`;
      }
      
      toast({
        title: "Erreur de déchiffrement",
        description: errorMessage,
        variant: "destructive",
      });
      
      decryptOperation.failOperation();
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleDownloadFile = (file: File) => {
    downloadBlob(file, file.name);
  };

  const handleDownloadAll = () => {
    decryptedFiles.forEach(file => {
      downloadBlob(file, file.name);
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Unlock size={20} className="text-accent" />
          <h3 className="font-semibold text-foreground">Déchiffrer une archive sécurisée</h3>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="zipFile">Archive ZIP chiffrée (mode sécurisé)</Label>
            <Input
              id="zipFile"
              type="file"
              accept=".zip"
              onChange={handleFileSelect}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="decryptPassword">Mot de passe</Label>
            <Input
              id="decryptPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez le mot de passe de l'archive"
            />
          </div>

          <Card className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start space-x-2">
              <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Important : Cet outil ne sert que pour les archives créées en "mode sécurisé"
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  • Archives ZIP standards : Utilisez WinRAR, 7-Zip ou tout autre logiciel<br/>
                  • Archives sécurisées (AES-256) : Nécessitent cette application
                </p>
              </div>
            </div>
          </Card>

                    <LoadingButton
            onClick={handleDecrypt}
            disabled={!selectedFile || !password}
            isLoading={isDecrypting}
            loadingText="Déchiffrement..."
            icon={<Key size={16} />}
            className="w-full"
          >
            Déchiffrer l'archive
          </LoadingButton>

          {decryptedFiles.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">Fichiers déchiffrés</h4>
                <Button
                  onClick={handleDownloadAll}
                  variant="outline"
                  size="sm"
                >
                  <Download size={16} className="mr-2" />
                  Tout télécharger
                </Button>
              </div>
              
              <div className="space-y-2">
                {decryptedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-green-800 dark:text-green-200">
                        {file.name}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-300">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button
                      onClick={() => handleDownloadFile(file)}
                      variant="outline"
                      size="sm"
                      className="ml-4"
                    >
                      <Download size={16} className="mr-1" />
                      Télécharger
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};