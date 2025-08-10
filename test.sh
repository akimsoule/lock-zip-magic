#!/bin/bash

# Script de test pour Lock Zip Magic

echo "🧪 Tests de validation pour Lock Zip Magic"
echo "========================================"

# Test 1: Vérifier la structure des fichiers
echo "📁 Test 1: Structure des fichiers..."
if [ -f "electron/main.js" ] && [ -f "package.json" ] && [ -f "vite.config.ts" ]; then
    echo "✅ Fichiers de configuration présents"
else
    echo "❌ Fichiers de configuration manquants"
    exit 1
fi

# Test 2: Vérifier les dépendances
echo "📦 Test 2: Dépendances Electron..."
if [ -d "node_modules/electron" ] && [ -d "node_modules/electron-builder" ]; then
    echo "✅ Dépendances Electron installées"
else
    echo "❌ Dépendances Electron manquantes"
    echo "💡 Exécutez: npm install"
    exit 1
fi

# Test 3: Vérifier la configuration package.json
echo "⚙️  Test 3: Configuration package.json..."
if grep -q "electron:dev" package.json && grep -q "dist:dmg" package.json; then
    echo "✅ Scripts Electron configurés"
else
    echo "❌ Scripts Electron manquants"
    exit 1
fi

# Test 4: Tester le build
echo "🏗️  Test 4: Build de l'application..."
npm run build > /dev/null 2>&1
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "✅ Build web réussi"
else
    echo "❌ Échec du build web"
    exit 1
fi

# Test 5: Vérifier si le DMG existe
echo "💿 Test 5: Vérification du DMG..."
if [ -f "dist-electron/Lock Zip Magic-1.0.0.dmg" ]; then
    echo "✅ DMG existant trouvé"
    ls -lh "dist-electron/Lock Zip Magic-1.0.0.dmg"
else
    echo "ℹ️  Aucun DMG trouvé (normal si première exécution)"
fi

echo ""
echo "🎉 Tous les tests sont passés !"
echo "🚀 Votre application est prête pour le développement et la distribution."
echo ""
echo "Commandes utiles :"
echo "  ./dev.sh          - Développement"
echo "  ./build-dmg.sh    - Créer un DMG"
echo "  npm run electron:dev - Développement (npm)"
echo "  npm run dist:dmg     - Créer un DMG (npm)"
