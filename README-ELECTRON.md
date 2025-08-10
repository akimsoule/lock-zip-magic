# Lock Zip Magic - Version Desktop

Une application desktop pour macOS permettant de créer et gérer des archives ZIP protégées par mot de passe.

## Développement

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
npm install
```

### Lancement en mode développement
```bash
# Démarrer l'application Electron en mode développement
npm run electron:dev
```

Cette commande démarre simultanément :
- Le serveur de développement Vite (interface web)
- L'application Electron

### Build et distribution

#### Construire l'application pour production
```bash
npm run build
```

#### Créer un DMG pour macOS
```bash
npm run dist:dmg
```

Le fichier DMG sera généré dans le dossier `dist-electron/`.

#### Construire pour macOS (DMG et ZIP)
```bash
npm run dist:mac
```

### Structure du projet

```
electron/
  main.js          # Processus principal Electron
dist-electron/     # Builds générés par electron-builder
public/
  logo.png         # Icône de l'application
src/               # Code source React
```

### Configuration

La configuration d'electron-builder se trouve dans le `package.json` sous la clé `build`.

#### Personnalisation du DMG
- Titre : "Lock Zip Magic"
- Fond blanc
- Fenêtre 540x420
- Glisser-déposer vers Applications

### Scripts disponibles

- `npm run electron:dev` - Développement avec hot reload
- `npm run electron` - Lancer Electron uniquement
- `npm run dist:dmg` - Créer un DMG
- `npm run dist:mac` - Créer DMG + ZIP
- `npm run electron:pack` - Packager sans créer d'installateur

### Notes importantes

- L'application utilise une base relative (`./`) pour fonctionner avec Electron
- Les liens externes s'ouvrent dans le navigateur par défaut
- La sécurité web est activée avec isolation du contexte
