# 🚀 Serveur Node.js - Google Wallet API

Serveur Express.js pour créer et gérer des cartes Google Wallet.

## 📦 Installation

```bash
# Installer les dépendances
pnpm install

# Copier le fichier de configuration
cp .env.example .env
```

## 🔧 Configuration

Éditez le fichier `.env` avec vos paramètres :

```env
PORT=3000
NODE_ENV=development
GOOGLE_WALLET_ISSUER_ID=votre_issuer_id
GOOGLE_WALLET_SERVICE_ACCOUNT_KEY=votre_service_account_key
```

## 🏃‍♂️ Démarrage

```bash
# Mode développement
pnpm dev

# Mode production
pnpm build && pnpm start

# Serveur uniquement
pnpm server
```

## 📚 API Documentation

### Endpoints principaux

- **GET /** - Information sur l'API
- **GET /health** - Vérification de santé
- **GET /demo** - Exemples d'utilisation
- **GET /api/postman-collection** - Collection Postman

### Cartes Google Wallet

#### Carte de fidélité

```http
POST /api/wallet/loyalty-card
Content-Type: application/json

{
  "customerName": "Jean Dupont",
  "points": 2500,
  "cardNumber": "LYL123456789",
  "companyName": "Mon Magasin",
  "logoUrl": "https://example.com/logo.png"
}
```

#### Ticket d'événement

```http
POST /api/wallet/event-ticket
Content-Type: application/json

{
  "eventName": "Concert Rock",
  "venue": "Stade de France",
  "date": "2024-06-15 20:00",
  "seatNumber": "Section A, Rang 12, Siège 5",
  "customerName": "Marie Martin",
  "ticketNumber": "TKT987654321",
  "eventImageUrl": "https://example.com/concert.jpg"
}
```

#### Carte personnalisée

```http
POST /api/wallet/custom-card
Content-Type: application/json

{
  "title": "Carte VIP",
  "subtitle": "Pierre Dubois",
  "description": "Membre Premium",
  "backgroundColor": "#FFD700",
  "textModules": [
    {
      "header": "Numéro de membre",
      "body": "VIP-12345",
      "id": "member_number"
    }
  ],
  "barcodeValue": "VIP-12345"
}
```

## 🧪 Tests

```bash
# Lancer les tests
pnpm test

# Tests en mode watch
pnpm test:watch

# Tests avec couverture
pnpm test:coverage
```

## 📋 Utilisation avec Postman

1. Allez sur `http://localhost:3000/api/postman-collection`
2. Copiez le JSON retourné
3. Importez-le dans Postman
4. Testez les endpoints

## 🔧 Fonctionnalités

- ✅ Serveur Express.js avec TypeScript
- ✅ Middleware de sécurité (Helmet)
- ✅ CORS configuré
- ✅ Logging avec Morgan
- ✅ Validation des données
- ✅ Gestion d'erreurs globale
- ✅ Mode simulation pour les tests
- ✅ Documentation API intégrée
- ✅ Collection Postman générée automatiquement
- ✅ Health check endpoint
- ✅ Arrêt propre du serveur

## 📁 Structure du projet

```
src/
├── app.ts              # Application Express principale
├── init.ts             # Initialisation des services
├── google-wallet.ts    # Service Google Wallet
├── demo.ts            # Script de démonstration
└── server.ts          # Serveur (version alternative)
```

## 🌐 Endpoints disponibles

### Informations

- `GET /` - Informations sur l'API
- `GET /health` - Vérification de santé
- `GET /demo` - Exemples d'utilisation

### Google Wallet

- `POST /api/wallet/loyalty-card` - Créer une carte de fidélité
- `POST /api/wallet/event-ticket` - Créer un ticket d'événement
- `POST /api/wallet/custom-card` - Créer une carte personnalisée
- `GET /api/wallet/card/:objectId` - Obtenir les infos d'une carte

### Outils

- `GET /api/postman-collection` - Collection Postman

## 🚦 Codes de statut

- **200** - Succès
- **400** - Données manquantes ou invalides
- **404** - Route non trouvée
- **500** - Erreur serveur

## 📱 Test rapide

```bash
# Démarrer le serveur
pnpm dev

# Tester le health check
curl http://localhost:3000/health

# Créer une carte de fidélité
curl -X POST http://localhost:3000/api/wallet/loyalty-card \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "points": 1000,
    "cardNumber": "TEST123",
    "companyName": "Test Company"
  }'
```

## 🔮 Prochaines étapes

- [ ] Intégration réelle avec Google Wallet API
- [ ] Authentification JWT
- [ ] Base de données pour persister les cartes
- [ ] Rate limiting
- [ ] Swagger/OpenAPI documentation
- [ ] Monitoring et métriques
- [ ] Tests d'intégration

## 🐛 Debug

En cas d'erreur, vérifiez :

1. Les dépendances sont installées (`pnpm install`)
2. Le fichier `.env` est configuré
3. Le port 3000 est disponible
4. Les logs dans la console

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request
