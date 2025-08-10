# 🔐 Lock Zip Magic

Application moderne de chiffrement et compression de fichiers avec support desktop pour macOS.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Installation et Développement](#-installation-et-développement)
- [Version Desktop (DMG)](#-version-desktop-dmg)
- [Utilisation](#-utilisation)
- [Configuration et Build](#-configuration-et-build)
- [Sécurité](#-sécurité)
- [Technologies](#-technologies)
- [Scripts disponibles](#-scripts-disponibles)
- [Changelog](#-changelog)

## 🔐 Fonctionnalités

### Core Features
- **Chiffrement AES-256** : Protection de niveau militaire pour vos fichiers
- **Compression efficace** : Réduction de la taille sans perte de qualité  
- **Traitement local** : Aucune donnée n'est envoyée sur internet
- **Interface intuitive** : Drag & drop, validation en temps réel
- **Déchiffrement intégré** : Récupération complète des fichiers originaux

### Version Desktop
✅ **Application desktop native** pour macOS  
✅ **Installateur DMG** professionnel  
✅ **Support des architectures** Intel (x64) et Apple Silicon (arm64)  
✅ **Mode développement** avec hot reload  
✅ **Sécurité renforcée** (isolation du contexte)  
✅ **Interface optimisée** pour desktop  

## 🚀 Installation et Développement

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation initiale
```bash
# Cloner le repository
git clone <repository-url>
cd lock-zip-magic

# Installer les dépendances
npm install
```

### Développement Web
```bash
# Lancer en mode développement web
npm run dev

# Build pour la production web
npm run build
```

### Développement Desktop (Electron)
```bash
# Démarrer l'application Electron en mode développement
npm run electron:dev
# ou utiliser le script
./dev.sh
```

Cette commande démarre simultanément :
- Le serveur de développement Vite (interface web)
- L'application Electron

## 💿 Version Desktop (DMG)

### Structure des fichiers
```
lock-zip-magic/
├── electron/               # Configuration Electron
│   └── main.js            # Processus principal Electron
├── dist-electron/         # Builds générés par electron-builder
│   └── Lock Zip Magic-1.0.0.dmg  # 🎯 Votre DMG !
├── dev.sh                # Script de développement
├── build-dmg.sh          # Script de build DMG
├── test.sh               # Script de validation
└── public/
    └── logo.png          # Icône de l'application
```

### Créer un DMG
```bash
# Méthode 1: Script automatisé
./build-dmg.sh

# Méthode 2: Commandes npm
npm run dist:dmg

# Pour macOS (DMG et ZIP)
npm run dist:mac
```

Le fichier DMG sera généré dans le dossier `dist-electron/`.

### Installation pour les utilisateurs finaux
1. Télécharger le fichier `Lock Zip Magic-1.0.0.dmg`
2. Double-cliquer pour l'ouvrir
3. Glisser l'application vers le dossier Applications
4. Lancer depuis Launchpad ou Applications

## 📱 Utilisation

### Chiffrer des fichiers
1. Glissez-déposez vos fichiers dans la zone prévue
2. Créez un mot de passe fort (minimum 8 caractères avec majuscules, minuscules, chiffres)
3. Cliquez sur "Créer l'archive chiffrée"
4. Téléchargez votre fichier ZIP protégé

### Déchiffrer des fichiers
1. Sélectionnez votre archive ZIP chiffrée
2. Entrez le mot de passe
3. Récupérez vos fichiers originaux

## ⚙️ Configuration et Build

### Configuration Electron-Builder
La configuration se trouve dans le `package.json` sous la clé `build` :

```json
{
  "build": {
    "appId": "com.lockzipmagic.app",
    "productName": "Lock Zip Magic",
    "mac": {
      "category": "public.app-category.productivity",
      "target": [
        { "target": "dmg", "arch": ["x64", "arm64"] },
        { "target": "zip", "arch": ["x64", "arm64"] }
      ]
    },
    "dmg": {
      "title": "Lock Zip Magic",
      "backgroundColor": "#ffffff",
      "window": { "width": 540, "height": 420 }
    }
  }
}
```

### Configuration du DMG
- **Titre** : "Lock Zip Magic"
- **Fond** : Blanc
- **Taille de fenêtre** : 540x420
- **Position des éléments** :
  - Application : x144, y150
  - Dossier Applications : x396, y150

### Versions d'Electron supportées
- Electron 37.x
- Node.js 18+

### Architectures supportées
- Intel (x64)
- Apple Silicon (arm64)

### Formats de distribution
- DMG (recommandé pour macOS)
- ZIP (sauvegarde)

## 🔒 Sécurité

- **Chiffrement AES-256-CBC** : Standard militaire
- **Traitement entièrement côté client** : Aucune donnée transmise
- **Validation de force des mots de passe** : Sécurité renforcée
- **Gestion sécurisée de la mémoire** : Prévention des fuites
- **Isolation du contexte** (Electron) : Sécurité desktop renforcée

## 🛠️ Technologies

### Frontend
- **React 18** avec TypeScript
- **Vite** pour le build et le développement
- **Tailwind CSS** pour le styling
- **shadcn/ui** pour les composants UI

### Chiffrement et compression
- **crypto-js** pour le chiffrement AES-256
- **fflate** pour la compression ZIP

### Desktop
- **Electron 37.x** pour l'application desktop
- **electron-builder** pour la création de DMG

## 📜 Scripts disponibles

### Développement
```bash
npm run dev              # Serveur de développement web
npm run electron:dev     # Application Electron avec hot reload
./dev.sh                # Script de développement automatisé
```

### Build et Distribution
```bash
npm run build           # Build web pour production
npm run electron:pack   # Packager sans créer d'installateur
npm run dist:dmg        # Créer un DMG
npm run dist:mac        # Créer DMG + ZIP
./build-dmg.sh          # Script de build DMG automatisé
```

### Outils
```bash
npm run lint            # Linter ESLint
npm run preview         # Prévisualiser le build web
./test.sh              # Tests de validation
```

## 🚀 Prochaines étapes pour la production

### Signature de code Apple
1. Obtenir un compte développeur Apple
2. Créer un certificat "Developer ID Application"
3. Configurer la signature de code dans electron-builder

### Notarisation Apple
1. Soumettre l'application à Apple pour validation
2. Configurer la notarisation automatique

### Améliorations futures
- Auto-updater intégré
- Menu natif macOS
- Raccourcis clavier globaux
- Intégration Dock
- Notifications système

## 📊 Informations techniques

- **Taille du DMG** : ~127 MB
- **Version Electron** : 37.2.6
- **Compression DMG** : zlib
- **Bundle optimisé** pour la taille et les performances

---

## 🎯 Résultat

Votre application React/Vite est maintenant une **vraie application macOS** !

**Fichier principal** : `dist-electron/Lock Zip Magic-1.0.0.dmg`

---

## 📝 Changelog

### [1.0.0] - 2025-08-09

#### 🎉 Ajouté
- **Support Electron** : Application desktop native pour macOS
- **Génération DMG** : Installateur professionnel pour macOS
- **Architecture universelle** : Support Intel (x64) et Apple Silicon (arm64)
- **Scripts automatisés** :
  - `dev.sh` : Développement avec hot reload
  - `build-dmg.sh` : Création automatique de DMG
  - `test.sh` : Validation de l'environnement
- **Configuration electron-builder** complète
- **Documentation unifiée** : README complet avec toutes les informations

#### 🔧 Modifié
- **Configuration Vite** : Adaptée pour Electron avec `base: "./"`
- **Package.json** : 
  - Ajout des scripts Electron
  - Configuration build pour DMG
  - Métadonnées de l'application
- **Fichier principal Electron** : Conversion en ES modules
- **Structure de projet** : Organisation optimisée pour desktop

#### 🔐 Sécurité renforcée
- **Isolation du contexte** : Protection renforcée dans Electron
- **Navigation externe** : Liens s'ouvrent dans le navigateur par défaut
- **Validation des URLs** : Prévention de la navigation malveillante

#### 📁 Structure des fichiers ajoutés
```
lock-zip-magic/
├── electron/
│   └── main.js              # ✨ Nouveau : Processus principal Electron
├── dist-electron/           # ✨ Nouveau : Dossier de build
├── dev.sh                   # ✨ Nouveau : Script de développement
├── build-dmg.sh            # ✨ Nouveau : Script de build DMG
├── test.sh                 # ✨ Nouveau : Script de validation
└── README.md               # 🔄 Modifié : Documentation complète
```

#### 📊 Métriques
- **Taille du DMG** : ~127 MB
- **Temps de build** : ~30-60 secondes
- **Formats supportés** : DMG, ZIP
- **Compression** : zlib optimisée

#### 🐛 Corrections
- **Erreur ES modules** : Conversion de main.js en modules ES
- **Configuration base** : Chemin relatif pour Electron
- **Gestion des volumes** : Prévention des conflits hdiutil

### [0.0.0] - Version initiale
- Interface web React/TypeScript
- Chiffrement AES-256
- Compression ZIP
- Interface utilisateur avec shadcn/ui
- Validation des mots de passe

---

*Créé avec ❤️ dans la branche `feature/dmg`*
