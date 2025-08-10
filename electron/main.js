import { app, BrowserWindow, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = process.env.NODE_ENV === 'development';

let localServer = null;

async function setupElectronReload() {
  // Activer le live reload pour Electron en développement seulement
  if (isDev) {
    try {
      const { default: electronReload } = await import('electron-reload');
      electronReload(__dirname, {
        electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
        hardResetMethod: 'exit'
      });
    } catch (error) {
      console.log('electron-reload not available:', error.message);
    }
  }
}

async function setupLocalServer() {
  if (!isDev) {
    try {
      const express = (await import('express')).default;
      const serveStatic = (await import('serve-static')).default;
      
      const app = express();
      const distPath = path.join(__dirname, '../dist');
      
      app.use(serveStatic(distPath));
      
      return new Promise((resolve) => {
        localServer = app.listen(0, 'localhost', () => {
          const port = localServer.address().port;
          console.log(`Local server running on http://localhost:${port}`);
          resolve(`http://localhost:${port}`);
        });
      });
    } catch (error) {
      console.error('Failed to start local server:', error);
      return null;
    }
  }
  return null;
}

async function createWindow() {
  // Créer la fenêtre du navigateur
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    icon: path.join(__dirname, '../public/logo.png'), // Icône de l'application
    titleBarStyle: 'default',
    show: false // Ne pas afficher immédiatement
  });

  // Charger l'application
  let startUrl;
  if (isDev) {
    startUrl = 'http://localhost:5173';
  } else {
    // En production, démarrer un serveur local pour servir les fichiers
    const serverUrl = await setupLocalServer();
    startUrl = serverUrl || `file://${path.join(__dirname, '../dist/index.html')}`;
  }
  
  console.log('Loading URL:', startUrl);
  console.log('Current directory:', __dirname);
  console.log('Is development:', isDev);
  mainWindow.loadURL(startUrl);

  // Afficher la fenêtre quand elle est prête
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Ouvrir les DevTools en développement
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Ouvrir les liens externes dans le navigateur par défaut
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Cette méthode sera appelée quand Electron aura terminé son initialisation
app.whenReady().then(async () => {
  await setupElectronReload();
  createWindow();
});

// Quitter quand toutes les fenêtres sont fermées, sauf sur macOS
app.on('window-all-closed', () => {
  // Fermer le serveur local si il existe
  if (localServer) {
    localServer.close();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Fermer le serveur local avant de quitter
  if (localServer) {
    localServer.close();
  }
});

app.on('activate', () => {
  // Sur macOS, il est courant de recréer une fenêtre dans l'application quand
  // l'icône du dock est cliquée et qu'il n'y a pas d'autres fenêtres ouvertes
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Empêcher la navigation vers des URLs externes
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    if (parsedUrl.origin !== 'http://localhost:5173' && parsedUrl.origin !== 'file://') {
      event.preventDefault();
    }
  });
});
