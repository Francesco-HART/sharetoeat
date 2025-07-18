# Google Wallet Card Generator

Ce projet contient un service TypeScript pour créer des cartes Google Wallet personnalisées.

## Installation

Installez les dépendances :

```bash
pnpm install
```

## Configuration

1. **Obtenir un Issuer ID** :

   - Allez sur [Google Pay Console](https://pay.google.com/business/console)
   - Créez un nouveau compte ou connectez-vous
   - Obtenez votre Issuer ID

2. **Configuration OAuth2** :
   - Configurez l'authentification OAuth2 pour l'API Google Wallet
   - Remplacez `YOUR_OAUTH2_ACCESS_TOKEN` dans le code par votre vraie logique d'authentification

## Utilisation

### Exemple basique

```typescript
import { createGoogleWalletService } from "./google-wallet";

const walletService = createGoogleWalletService("VOTRE_ISSUER_ID");

// Créer une carte de fidélité
const loyaltyCard = await walletService.createLoyaltyCard({
  customerName: "Jean Dupont",
  points: 2500,
  cardNumber: "LYL123456789",
  companyName: "Mon Magasin",
  logoUrl: "https://example.com/logo.png",
});

console.log("URL pour ajouter la carte:", loyaltyCard.saveUrl);
```

### Types de cartes disponibles

#### 1. Carte de fidélité

```typescript
const loyaltyCard = await walletService.createLoyaltyCard({
  customerName: "Jean Dupont",
  points: 2500,
  cardNumber: "LYL123456789",
  companyName: "Mon Magasin",
  logoUrl: "https://example.com/logo.png",
});
```

#### 2. Ticket d'événement

```typescript
const eventTicket = await walletService.createEventTicket({
  eventName: "Concert Rock",
  venue: "Stade de France",
  date: "2024-06-15 20:00",
  seatNumber: "Section A, Rang 12, Siège 5",
  customerName: "Marie Martin",
  ticketNumber: "TKT987654321",
  eventImageUrl: "https://example.com/concert.jpg",
});
```

#### 3. Carte personnalisée

```typescript
const customCard = await walletService.createWalletCard({
  classSuffix: "membership_vip",
  objectSuffix: "member_12345",
  title: "Carte VIP",
  subtitle: "Pierre Dubois",
  description: "Membre Premium",
  logoUrl: "https://example.com/vip-logo.png",
  backgroundColor: "#FFD700",
  textModules: [
    {
      header: "Numéro de membre",
      body: "VIP-12345",
      id: "member_number",
    },
  ],
  barcodeValue: "VIP-12345",
});
```

## Structure des données

### GenericClass

Structure pour définir le modèle de carte :

- `id` : Identifiant unique de la classe
- `imageModulesData` : Images à afficher
- `textModulesData` : Modules de texte
- `linksModuleData` : Liens associés

### GenericObject

Structure pour l'instance de carte :

- `id` : Identifiant unique de l'objet
- `classId` : Référence à la classe
- `cardTitle` : Titre de la carte
- `logo` : Logo de la carte
- `barcode` : Code-barres (QR code, etc.)
- `heroImage` : Image principale

## Fonctionnalités

✅ Création de classes Google Wallet
✅ Création d'objets Google Wallet
✅ Génération d'URLs "Add to Google Wallet"
✅ Support des cartes de fidélité
✅ Support des tickets d'événement
✅ Cartes personnalisables
✅ Support des codes-barres QR
✅ Images et logos personnalisés
✅ Modules de texte flexibles

## Tests

Lancez les tests :

```bash
pnpm test
```

## API Google Wallet

Ce service utilise l'API Google Wallet Objects :

- [Documentation officielle](https://developers.google.com/wallet/generic)
- [REST API Reference](https://developers.google.com/wallet/generic/rest)

## Notes importantes

1. **Authentification** : L'authentification OAuth2 doit être correctement configurée en production
2. **Sécurité** : Les clés privées ne doivent jamais être exposées côté client
3. **JWT Signing** : En production, signez les JWT avec votre clé privée
4. **Rate Limiting** : Respectez les limites de taux de l'API Google

## Prochaines étapes

- [ ] Implémenter l'authentification OAuth2 complète
- [ ] Ajouter la signature JWT sécurisée
- [ ] Support pour d'autres types de cartes (transport, boarding pass, etc.)
- [ ] Cache pour les classes créées
- [ ] Gestion d'erreurs plus robuste
