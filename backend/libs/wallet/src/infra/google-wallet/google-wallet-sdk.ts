import {
  CreateLoyaltyCardDto,
  GoogleWalletGateway,
} from "@app/wallet/ports/google-wallet.gateway";
import { Wallet } from "libs/wallet/test/commands/send-notifications-to-shop-card.command.spec";
import { GoogleAuthentifier } from "./google-wallet-authentifier";
import { LoyaltyCard } from "@app/wallet/domain/loyalty-card";
import { GoogleWalletGenerator } from "./google-wallet-generator";
import { GoogleWalletNotifier } from "./google-wallet-notifier";

export class GoogleWalletSdk extends Wallet {
  constructor(
    private readonly googleWalletGenerator: GoogleWalletGenerator,
    private readonly googleWalletNotifier: GoogleWalletNotifier
  ) {
    super();
  }

  generateCard(loyaltyCard: LoyaltyCard): Promise<string> {
    // await this.googleWalletGenerator.createClass()
    throw Error("Methode not implemented");
  }

  async createLoyaltyCard(
    command: CreateLoyaltyCardDto
  ): Promise<{ objectId: string; saveUrl: string }> {
    const card = await this.googleWalletGenerator.createLoyaltyCard(command);
    return card;
  }

  async notify(card: LoyaltyCard, message: string): Promise<void> {
    await this.googleWalletNotifier.sendPushNotification(
      card.id,
      message,
      "New update"
    );
  }
  async notifyBulk(cards: LoyaltyCard[], message: string): Promise<void> {
    await Promise.all(
      cards.map((card) => {
        this.notify(card, message);
      })
    );
  }
}
