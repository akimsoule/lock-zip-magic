#!/bin/bash

# 🔍 Vérification finale de Lock Zip Magic

echo "🔍 Vérification finale de la structure du projet Lock Zip Magic"
echo "============================================================"

# Vérifier les fichiers essentiels
echo "📋 Fichiers essentiels :"
files=(
    "package.json"
    "README.md"
    "electron/main.js"
    "dev.sh"
    "build-dmg.sh"
    "test.sh"
    "vite.config.ts"
    "src/App.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file MANQUANT"
    fi
done

# Vérifier les dossiers
echo ""
echo "📁 Dossiers :"
dirs=(
    "src"
    "public" 
    "electron"
    "node_modules"
)

for dir in "${dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "  ✅ $dir/"
    else
        echo "  ❌ $dir/ MANQUANT"
    fi
done

# Vérifier si DMG existe
echo ""
echo "💿 Build DMG :"
if [ -f "dist-electron/Lock Zip Magic-1.0.0.dmg" ]; then
    size=$(ls -lh "dist-electron/Lock Zip Magic-1.0.0.dmg" | awk '{print $5}')
    echo "  ✅ DMG disponible ($size)"
else
    echo "  ℹ️  DMG non construit (exécutez ./build-dmg.sh)"
fi

# Scripts exécutables
echo ""
echo "🔧 Scripts exécutables :"
scripts=("dev.sh" "build-dmg.sh" "test.sh")
for script in "${scripts[@]}"; do
    if [ -x "$script" ]; then
        echo "  ✅ $script"
    else
        echo "  ❌ $script (pas exécutable - chmod +x $script)"
    fi
done

echo ""
echo "🎉 Vérification terminée !"
echo ""
echo "🚀 Commandes utiles :"
echo "  ./dev.sh          - Développement"
echo "  ./build-dmg.sh    - Créer DMG"
echo "  ./test.sh         - Tests"
