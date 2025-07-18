import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { GoogleWalletService } from "./google-wallet";

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const service = new GoogleWalletService({
  issuerId: "3388000000022747072",
  serviceAccountKey: "BCR2DN4T6OC75NLU",
});
// Middleware
app.use(helmet()); // Sécurité
app.use(cors()); // CORS
app.use(morgan("combined")); // Logging
app.use(express.json()); // Parser JSON
app.use(express.urlencoded({ extended: true })); // Parser URL-encoded

// Routes de base
app.get("/", async (req: Request, res: Response) => {
  const classSuffix = `loyalty_${crypto.randomUUID()}`;
  const result = await service.createClass(classSuffix);

  res.json({
    message: "🎫 Google Wallet Card Generator API",
    result,
  });
});

// Routes de base
app.get("/notify/:objectId", async (req: Request, res: Response) => {
  const { objectId } = req.params;
  const result = await service.sendPushNotification(objectId);

  res.json({
    message: "Send push notification ",
    result,
  });
});

// Route de santé
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version,
  });
});

// Routes API Wallet (temporairement désactivées jusqu'à ce que google-wallet soit fixé)
app.get(
  "/api/wallet/loyalty-card/:classId",
  async (req: Request, res: Response) => {
    try {
      const { classId } = req.params;
      const response = await service.createLoyaltyCard({
        classId,
        customerName: "string",
        points: 10,
        cardNumber: "string",
        companyName: "string",
      });

      res.json({
        success: true,
        data: response,
        message: "Carte de fidélité créée avec succès (mode simulation)",
      });
    } catch (error) {
      console.error("Erreur création carte de fidélité:", error);
      res.status(500).json({
        error: "Erreur serveur",
        message: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }
);

// Middleware de gestion d'erreurs
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Erreur non gérée:", err);
  res.status(500).json({
    error: "Erreur serveur interne",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Une erreur est survenue",
    timestamp: new Date().toISOString(),
  });
});

// Route 404
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    error: "Route non trouvée",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// Démarrage du serveur
const server = app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📱 API disponible sur: http://localhost:${PORT}`);
  console.log(`🔍 Documentation: http://localhost:${PORT}/`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log(`🎯 Démonstration: http://localhost:${PORT}/demo`);
  console.log(
    `📋 Collection Postman: http://localhost:${PORT}/api/postman-collection`
  );
});

// Gestion propre de l'arrêt
process.on("SIGTERM", () => {
  console.log("🛑 Signal SIGTERM reçu, arrêt du serveur...");
  server.close(() => {
    console.log("✅ Serveur arrêté proprement");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("🛑 Signal SIGINT reçu, arrêt du serveur...");
  server.close(() => {
    console.log("✅ Serveur arrêté proprement");
    process.exit(0);
  });
});

export default app;
