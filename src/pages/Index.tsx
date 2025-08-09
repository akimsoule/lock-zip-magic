import { Archive, Shield, Lock } from 'lucide-react';
import { FileZipper } from '@/components/FileZipper';
import { Card } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-security-gradient">
              <Archive size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">SecureZip</h1>
              <p className="text-sm text-muted-foreground">Compression sécurisée de fichiers</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-security-gradient shadow-glow-primary">
                <Shield size={48} className="text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Compressez vos fichiers en toute sécurité
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Créez facilement des archives ZIP protégées par mot de passe. 
              Vos fichiers restent privés et sécurisés.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-3">
                <Lock size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Protection par mot de passe</h3>
              <p className="text-sm text-muted-foreground">
                Sécurisez vos archives avec un mot de passe robuste
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="p-3 rounded-full bg-accent/10 w-fit mx-auto mb-3">
                <Archive size={24} className="text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Compression efficace</h3>
              <p className="text-sm text-muted-foreground">
                Réduisez la taille de vos fichiers sans perte de qualité
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="p-3 rounded-full bg-primary-glow/10 w-fit mx-auto mb-3">
                <Shield size={24} className="text-primary-glow" />
              </div>
              <h3 className="font-semibold mb-2">100% sécurisé</h3>
              <p className="text-sm text-muted-foreground">
                Traitement local, vos fichiers ne quittent jamais votre appareil
              </p>
            </Card>
          </div>

          {/* File Zipper Component */}
          <FileZipper />
        </div>
      </main>
    </div>
  );
};

export default Index;
