# SecureZip - Chiffrement sécurisé de fichiers

Application web moderne pour chiffrer et compresser des fichiers avec un chiffrement AES-256 de niveau militaire.

## 🔐 Fonctionnalités

- **Chiffrement AES-256** : Protection de niveau militaire pour vos fichiers
- **Compression efficace** : Réduction de la taille sans perte de qualité  
- **Traitement local** : Aucune donnée n'est envoyée sur internet
- **Interface intuitive** : Drag & drop, validation en temps réel
- **Déchiffrement intégré** : Récupération complète des fichiers originaux

## 🚀 Installation

```bash
# Cloner le repository
git clone <repository-url>
cd lock-zip-magic

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour la production
npm run build
```

## 🛠️ Technologies utilisées

- **React 18** avec TypeScript
- **Vite** pour le build et le développement
- **Tailwind CSS** pour le styling
- **shadcn/ui** pour les composants UI
- **crypto-js** pour le chiffrement AES-256
- **fflate** pour la compression ZIP

## 🔒 Sécurité

- Chiffrement AES-256-CBC
- Traitement entièrement côté client
- Validation de force des mots de passe
- Gestion sécurisée de la mémoire

## 📱 Utilisation

1. **Chiffrer des fichiers :**
   - Glissez-déposez vos fichiers dans la zone prévue
   - Créez un mot de passe fort (minimum 8 caractères avec majuscules, minuscules, chiffres)
   - Téléchargez votre archive ZIP chiffrée

2. **Déchiffrer une archive :**
   - Sélectionnez votre archive ZIP chiffrée
   - Entrez le mot de passe utilisé lors du chiffrement
   - Téléchargez vos fichiers originaux

## 🏗️ Structure du projet

```
src/
├── components/          # Composants React
│   ├── FileDropZone.tsx # Zone de glisser-déposer
│   ├── FileList.tsx     # Liste des fichiers
│   ├── FileZipper.tsx   # Composant de chiffrement
│   ├── PasswordInput.tsx # Gestion des mots de passe
│   ├── ZipDecryptor.tsx # Composant de déchiffrement
│   └── ui/             # Composants UI réutilisables
├── pages/              # Pages de l'application
├── utils/              # Utilitaires (chiffrement, ZIP)
└── hooks/              # Hooks React personnalisés
```

## 🧪 Tests

```bash
# Lancer les tests
npm run test

# Tests avec coverage
npm run test:coverage
```

## 📦 Build et déploiement

```bash
# Build de production
npm run build

# Prévisualiser le build
npm run preview
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre feature
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
