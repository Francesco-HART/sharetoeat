import { GoogleWalletService } from "./google-wallet";

// Configuration simple pour initialiser le service Google Wallet
const ISSUER_ID = process.env.GOOGLE_WALLET_ISSUER_ID || "3388000000022135762";
const SERVICE_ACCOUNT_KEY =
  process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_KEY || "dummy_key_for_demo";

// Créer une instance du service Google Wallet
const walletService = new GoogleWalletService({
  issuerId: ISSUER_ID,
  serviceAccountKey: SERVICE_ACCOUNT_KEY,
});

console.log("✅ Service Google Wallet initialisé");
console.log(`📱 Issuer ID: ${ISSUER_ID}`);

export { walletService };
export default walletService;
