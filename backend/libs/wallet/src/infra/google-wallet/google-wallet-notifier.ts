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
export class GoogleWalletNotifier {
  constructor(private readonly googleAuthentifer: GoogleAuthentifier) {}

  async sendPushNotification(
    classObjectId: string,
    message: string,
    title: string
  ) {
    // wallet response
    /**
     * "objectId":"3388000000022747072.5811342a-dbd1-4a8f-b814-88695323e3e0_customer_string_3388000000022747072.loyalty_3ec8a9f7-0881-4f67-a8fc-8bc29886fef2"
     * https://pay.google.com/gp/v/save/eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3YWxseS02ODdAaW52ZXJ0aWJsZS1sZW5zLTI4MDIyMy5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsImF1ZCI6Imdvb2dsZSIsInR5cCI6InNhdmV0b3dhbGxldCIsImlhdCI6MTc1Mjc2NTU2Nywib3JpZ2lucyI6WyJodHRwczovL2NlOWMzYzNlOTFiNjI1Lmxoci5saWZlL2hlYWx0aCJdLCJwYXlsb2FkIjp7ImdlbmVyaWNPYmplY3RzIjpbeyJpZCI6IjMzODgwMDAwMDAwMjI3NDcwNzIuNTgxMTM0MmEtZGJkMS00YThmLWI4MTQtODg2OTUzMjNlM2UwX2N1c3RvbWVyX3N0cmluZ18zMzg4MDAwMDAwMDIyNzQ3MDcyLmxveWFsdHlfM2VjOGE5ZjctMDg4MS00ZjY3LWE4ZmMtOGJjMjk4ODZmZWYyIn1dfX0.Kgz6hs9mmk_W9z_InSZUPB1TNyH5RyveZ1S_RpiyBx6H7vqPaDrL3gOA2SxSdgWLC_aF0wGSiYDPOdrW_nM3uEc-Zf7DwNLz4kSSyD1UnV41sTpBVi1EuTT6LV6g9T_sXvApwjXPl9pBs2pqojXzFXYo-awueJJt_nfRFP1-qffSMXiStd0odSyYaOlA6clwk1XAu5ruWd5azGg7g60OxbhIXtK0jojET5_YQ1dlv6oPjETB0eDAU0P51B0jHVmoO2CTPcSGDsrEn3SrtgIgwGeKqLVwR4ddb577-jg6ujQglI1b6MKQWGsKojqL2QFrsj-rDmFpXi08cbINu9eeOw
     * url http://localhost:3000/api/wallet/loyalty-card/3388000000022747072.loyalty_3ec8a9f7-0881-4f67-a8fc-8bc29886fef2
     */
    const data = {
      textModulesData: [
        {
          header: title,
          body: message,
          id: "dynamic_update_2",
        },
      ],
      state: "active",
      hasLinkedDevice: true,
    };
    try {
      const request = await this.googleAuthentifer.buildAuthenticatedRequest(
        "PATCH",
        `/genericObject/${classObjectId}`,
        data
      );

      await axios(request);
    } catch (error) {
      console.error("Error sending push notification:", error);
      throw error;
    }
  }
}
