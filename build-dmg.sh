#!/bin/bash

# Script de build pour créer le DMG de Lock Zip Magic

echo "🏗️  Construction de Lock Zip Magic pour macOS..."

# Nettoyer les builds précédents
if [ -d "dist-electron" ]; then
    echo "🧹 Nettoyage des builds précédents..."
    rm -rf dist-electron
fi

if [ -d "dist" ]; then
    echo "🧹 Nettoyage du build web..."
    rm -rf dist
fi

# Construction de l'application
echo "⚡ Construction de l'interface web..."
npm run build

echo "📦 Création du DMG..."
npm run dist:dmg

echo "✅ Build terminé !"
echo "📂 Le fichier DMG se trouve dans : dist-electron/"

# Afficher les fichiers créés
ls -la dist-electron/*.dmg
