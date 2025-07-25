import axios from "axios";
import * as crypto from "crypto";
import { GoogleAuth } from "google-auth-library";
import * as jwt from "jsonwebtoken";
import { GenericClass } from "./generic-class";
import { GenericObject } from "./generic-object";
import { GoogleWalletConfig } from "./google-wallet-config";
import { GoogleWalletGateway } from "@app/wallet/ports/google-wallet.gateway";
import { Injectable } from "@nestjs/common";
import { GoogleAuthentifier } from "./google-wallet-authentifier";

@Injectable()
export class GoogleWalletGenerator implements GoogleWalletGateway {
  private issuerId: string;
  private baseURL = "https://walletobjects.googleapis.com/walletobjects/v1";

  constructor(
    config: GoogleWalletConfig,
    private readonly googleAuthentifer: GoogleAuthentifier
  ) {
    this.issuerId = config.issuerId;
  }

  async createClass(
    classSuffix: string,
    classData?: Partial<GenericClass>
  ): Promise<string> {
    const classId = `${this.issuerId}.${classSuffix}`;
    console.log("Creating class with ID:", classId);

    try {
      const request = await this.googleAuthentifer.buildAuthenticatedRequest(
        "GET",
        `${this.baseURL}/genericClass/${classId}`
      );
      await axios(request);
      console.log(`Class ${classId} already exists!`);
      return classId;
    } catch (err: any) {
      if (err.response && err.response.status !== 404) {
        console.error("Error checking class:", err);
        throw err;
      }
    }

    const newClass: GenericClass = {
      id: classId,
      ...classData,
    };

    try {
      const request = await this.googleAuthentifer.buildAuthenticatedRequest(
        "POST",
        "/genericClass",
        newClass
      );

      const response = await axios(request);

      console.log("Class created successfully:", response.data);
      return classId;
    } catch (err) {
      console.error("Error creating class:", err);
      throw err;
    }
  }

  async createObject(
    objectSuffix: string,
    classId: string,
    objectData: Partial<GenericObject>
  ): Promise<{ objectId: string; saveUrl: string }> {
    const objectId = `${this.issuerId}.${objectSuffix}`;

    const walletObject: GenericObject = {
      id: objectId,
      classId: classId,
      genericType: "GENERIC_TYPE_UNSPECIFIED",
      hexBackgroundColor: "#4285f4",
      logo: {
        sourceUri: {
          uri: "https://storage.googleapis.com/wallet-lab-tools-codelab-artifacts-public/pass_google_logo.jpg",
        },
        contentDescription: {
          defaultValue: {
            language: "en-US",
            value: "Generic card logo",
          },
        },
      },
      cardTitle: {
        defaultValue: {
          language: "en-US",
          value: "Generic card title",
        },
      },
      subheader: {
        defaultValue: {
          language: "en-US",
          value: "Generic card subheader",
        },
      },
      header: {
        defaultValue: {
          language: "en-US",
          value: "Generic card header",
        },
      },
      ...objectData,
    };

    try {
      const request = await this.googleAuthentifer.buildAuthenticatedRequest(
        "POST",
        "/genericObject",
        walletObject
      );

      await axios(request);

      console.log("Object created successfully");

      const saveUrl = this.generateAddToGoogleWalletUrl(objectId);

      return {
        objectId,
        saveUrl,
      };
    } catch (err: any) {
      console.error("Error creating object:", err);

      console.error("Error creating object:", err?.response?.data?.error);

      throw err;
    }
  }

  private generateAddToGoogleWalletUrl(objectId: string): string {
    const baseUrl = "https://pay.google.com/gp/v/save/";
    const payload = {
      iss: this.googleAuthentifer.getPrivateEmail(),
      aud: "google",
      typ: "savetowallet",
      iat: Math.floor(Date.now() / 1000),
      origins: ["https://ce9c3c3e91b625.lhr.life/health"],

      payload: {
        genericObjects: [
          {
            id: objectId,
          },
        ],
      },
    };

    // En production, vous devriez signer ce JWT avec votre clé privée
    // Pour cet exemple, nous retournons une URL de base
    const encodedPayload = jwt.sign(
      payload,
      this.googleAuthentifer.getPrivateKey(),
      {
        algorithm: "RS256",
        header: {
          typ: "JWT",
          alg: "RS256",
        },
      }
    );

    return `${baseUrl}${encodedPayload}`;
  }

  async createWalletCard(cardData: {
    objectSuffix: string;
    title: string;
    classId: string;
    subtitle?: string;
    description?: string;
    logoUrl?: string;
    heroImageUrl?: string;
    backgroundColor?: string;
    textModules?: Array<{ header: string; body: string; id: string }>;
    imageModules?: Array<{ imageUrl: string; description: string; id: string }>;
    barcodeValue?: string;
  }): Promise<{ objectId: string; saveUrl: string }> {
    const objectSuffix = `${crypto.randomUUID()}_${cardData.objectSuffix}`;
    const objectResult = await this.createObject(
      objectSuffix,
      cardData.classId,
      {
        hexBackgroundColor: cardData.backgroundColor || "#4285f4",
        logo: cardData.logoUrl
          ? {
              sourceUri: { uri: cardData.logoUrl },
              contentDescription: {
                defaultValue: { language: "en-US", value: "Card logo" },
              },
            }
          : undefined,
        cardTitle: {
          defaultValue: { language: "en-US", value: cardData.title },
        },
        subheader: cardData.subtitle
          ? {
              defaultValue: { language: "en-US", value: cardData.subtitle },
            }
          : undefined,
        header: cardData.description
          ? {
              defaultValue: { language: "en-US", value: cardData.description },
            }
          : undefined,
        heroImage: cardData.heroImageUrl
          ? {
              sourceUri: { uri: cardData.heroImageUrl },
              contentDescription: {
                defaultValue: { language: "en-US", value: "Hero image" },
              },
            }
          : undefined,
        textModulesData: cardData.textModules,
        imageModulesData: cardData.imageModules?.map((img) => ({
          mainImage: {
            sourceUri: { uri: img.imageUrl },
            contentDescription: {
              defaultValue: { language: "en-US", value: img.description },
            },
          },
          id: img.id,
        })),
        barcode: cardData.barcodeValue
          ? {
              type: "QR_CODE",
              value: cardData.barcodeValue,
              alternateText: cardData.barcodeValue,
            }
          : undefined,
      }
    );

    return {
      objectId: objectResult.objectId,
      saveUrl: objectResult.saveUrl,
    };
  }

  async createLoyaltyCard(customerData: {
    classId: string;
  }): Promise<{ objectId: string; saveUrl: string }> {
    const cardNumber = crypto.randomUUID();

    const companyName = "Wally";

    const objectSuffix = `customer_${cardNumber}_${customerData.classId}`;
    const description = "Hello world";
    const barcodeValue = "";

    return this.createWalletCard({
      classId: customerData.classId,
      objectSuffix,
      title: `${companyName} - Carte de fidélité`,
      subtitle: companyName,
      description: `${description} `,
      logoUrl: undefined,
      backgroundColor: "#1976d2",

      textModules: [
        {
          header: "Numéro de carte",
          body: cardNumber,
          id: "card_number",
        },
        // {
        //   header: "Points",
        //   body: customerData.points.toString(),
        //   id: "points",
        // },
      ],
      barcodeValue,
    });
  }

  async sendWalletPushNotification(objectId: string) {
    const data = {
      message: {
        header: "🛎 Mise à jour",
        body: "Votre solde de points a changé.",
        id: `notif-${Date.now()}`, // ID unique
        messageType: "TEXT_AND_NOTIFY",
      },
    };

    try {
      const request = await this.googleAuthentifer.buildAuthenticatedRequest(
        "POST",
        `/genericObject/${objectId}/addMessage`,
        data
      );
      await axios(request);

      console.log("✅ Notification push envoyée.");
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi de la notification :", error);
    }
  }

  async sendPushNotification(classObject: string) {
    // wallet response
    /**
     * "objectId":"3388000000022747072.5811342a-dbd1-4a8f-b814-88695323e3e0_customer_string_3388000000022747072.loyalty_3ec8a9f7-0881-4f67-a8fc-8bc29886fef2"
     * https://pay.google.com/gp/v/save/eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3YWxseS02ODdAaW52ZXJ0aWJsZS1sZW5zLTI4MDIyMy5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsImF1ZCI6Imdvb2dsZSIsInR5cCI6InNhdmV0b3dhbGxldCIsImlhdCI6MTc1Mjc2NTU2Nywib3JpZ2lucyI6WyJodHRwczovL2NlOWMzYzNlOTFiNjI1Lmxoci5saWZlL2hlYWx0aCJdLCJwYXlsb2FkIjp7ImdlbmVyaWNPYmplY3RzIjpbeyJpZCI6IjMzODgwMDAwMDAwMjI3NDcwNzIuNTgxMTM0MmEtZGJkMS00YThmLWI4MTQtODg2OTUzMjNlM2UwX2N1c3RvbWVyX3N0cmluZ18zMzg4MDAwMDAwMDIyNzQ3MDcyLmxveWFsdHlfM2VjOGE5ZjctMDg4MS00ZjY3LWE4ZmMtOGJjMjk4ODZmZWYyIn1dfX0.Kgz6hs9mmk_W9z_InSZUPB1TNyH5RyveZ1S_RpiyBx6H7vqPaDrL3gOA2SxSdgWLC_aF0wGSiYDPOdrW_nM3uEc-Zf7DwNLz4kSSyD1UnV41sTpBVi1EuTT6LV6g9T_sXvApwjXPl9pBs2pqojXzFXYo-awueJJt_nfRFP1-qffSMXiStd0odSyYaOlA6clwk1XAu5ruWd5azGg7g60OxbhIXtK0jojET5_YQ1dlv6oPjETB0eDAU0P51B0jHVmoO2CTPcSGDsrEn3SrtgIgwGeKqLVwR4ddb577-jg6ujQglI1b6MKQWGsKojqL2QFrsj-rDmFpXi08cbINu9eeOw
     * url http://localhost:3000/api/wallet/loyalty-card/3388000000022747072.loyalty_3ec8a9f7-0881-4f67-a8fc-8bc29886fef2
     */
    const data = {
      textModulesData: [
        {
          header: "Hello beau mal !!!!!",
          body: "hello",
          id: "dynamic_update_2",
        },
      ],
      state: "active",
      hasLinkedDevice: true,
    };
    try {
      const request = await this.googleAuthentifer.buildAuthenticatedRequest(
        "PATCH",
        `/genericObject/${classObject}`,
        data
      );

      await axios(request);
    } catch (error) {
      console.error("Error sending push notification:", error);
      throw error;
    }
  }
}
