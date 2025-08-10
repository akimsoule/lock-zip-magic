import { Archive, Shield, Lock, Key } from 'lucide-react';
import { FileZipper } from '@/components/FileZipper';
import { ZipDecryptor } from '@/components/ZipDecryptor';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg">
              <img src="/logo.png" alt="SecureZip Logo" className="w-10 h-10" />
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
              Compression et chiffrement de fichiers
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Créez des archives ZIP classiques ou sécurisées avec chiffrement AES-256. 
              Choisissez le mode qui convient à vos besoins.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-3">
                <Lock size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Chiffrement AES-256</h3>
              <p className="text-sm text-muted-foreground">
                Chiffrement de niveau militaire pour une sécurité maximale
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="p-3 rounded-full bg-accent/10 w-fit mx-auto mb-3">
                <Archive size={24} className="text-accent" />
              </div>
              <h3 className="font-semibold mb-2">ZIP standard</h3>
              <p className="text-sm text-muted-foreground">
                Compatible avec tous les logiciels (WinRAR, 7-Zip, etc.)
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="p-3 rounded-full bg-primary-glow/10 w-fit mx-auto mb-3">
                <Shield size={24} className="text-primary-glow" />
              </div>
              <h3 className="font-semibold mb-2">Chiffrement AES-256</h3>
              <p className="text-sm text-muted-foreground">
                Protection maximale, nécessite cette application pour déchiffrer
              </p>
            </Card>
          </div>

          {/* Main Application */}
          <Tabs defaultValue="compress" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="compress" className="flex items-center space-x-2">
                <Archive size={16} />
                <span>Créer une archive</span>
              </TabsTrigger>
              <TabsTrigger value="decrypt" className="flex items-center space-x-2">
                <Key size={16} />
                <span>Déchiffrer (mode sécurisé)</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="compress">
              <FileZipper />
            </TabsContent>

            <TabsContent value="decrypt">
              <ZipDecryptor />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
