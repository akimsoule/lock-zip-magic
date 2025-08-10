# Configuration de build pour Lock Zip Magic

## Versions d'Electron supportées
- Electron 37.x
- Node.js 18+

## Architecture supportée
- Intel (x64)
- Apple Silicon (arm64)

## Format de distribution
- DMG (recommandé pour macOS)
- ZIP (sauvegarde)

## Certificat de signature
Pour la distribution en production, vous devrez :
1. Avoir un compte développeur Apple
2. Créer un certificat "Developer ID Application"
3. Configurer la signature de code

## Personnalisation du DMG
- Fond : Blanc
- Taille de fenêtre : 540x420
- Position des éléments :
  - Application : x144, y150
  - Dossier Applications : x396, y150

## Optimisations
- Compression zlib pour le DMG
- Bundle optimisé pour la taille
- Assets web minifiés
