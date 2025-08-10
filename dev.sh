#!/bin/bash

# Script de développement pour Lock Zip Magic

echo "🚀 Démarrage de Lock Zip Magic en mode développement..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/"
    exit 1
fi

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Démarrer l'application en mode développement
echo "🔧 Lancement de l'application Electron..."
npm run electron:dev
