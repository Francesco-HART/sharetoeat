import * as fs from "fs";
import { GoogleAuth } from "google-auth-library/build/src/auth/googleauth";

export class GoogleAuthConfig {
  serviceAccountKeyFilePath: string;
}

export class GoogleAuthentifier {
  private readonly privateKey: string;
  private readonly privateClientEmail: string;
  private serviceAccountKeyFilePath: string;

  constructor(config: GoogleAuthConfig) {
    const serviceAccountJson = JSON.parse(
      fs.readFileSync(config.serviceAccountKeyFilePath, "utf-8")
    );
    this.privateKey = serviceAccountJson.private_key;
    this.privateClientEmail = serviceAccountJson.client_email;
  }

  getPrivateKey() {
    return this.privateKey;
  }

  getPrivateEmail() {
    return this.privateClientEmail;
  }

  private async getBearerToken() {
    const auth = new GoogleAuth({
      keyFile: this.serviceAccountKeyFilePath,
      scopes: ["https://www.googleapis.com/auth/wallet_object.issuer"],
    });

    const client = await auth.getClient();

    try {
      const accessTokenResponse = await client.getAccessToken();
      console.log("Using Bearer token");
      return accessTokenResponse.token;
    } catch (error) {
      console.error("Error getting access token:", error);
    }
  }

  async buildAuthenticatedRequest(method: string, url: string, data?: any) {
    const token = await this.getBearerToken();

    return {
      method,
      url,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data,
    };
  }
}
