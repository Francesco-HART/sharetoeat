import {
  SendNotificationToShopCardsCommand,
  SendNotificationToShopCardsCommandHandler,
} from "@app/wallet/application/commands/send-notification-to-shop-cards.command";
import { LoyaltyCard } from "@app/wallet/domain/loyalty-card";
import { InMemoryLoyaltyCardRepository } from "@app/wallet/infra/repositories/loyalty-cards/in-memory-loyalty-card.repository";

export class GoogleWallet implements Wallet {
  notifyBulk(cards: LoyaltyCard[], message: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  notify(card: LoyaltyCard, message: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  generateCard(loyaltyCard: LoyaltyCard): Promise<string> {
    throw new Error("Method not implemented.");
  }
}

export class AppleWallet implements Wallet {
  notifyBulk(cards: LoyaltyCard[], message: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  notify(card: LoyaltyCard, message: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  generateCard(loyaltyCard: LoyaltyCard): Promise<string> {
    throw new Error("Method not implemented.");
  }
}

export abstract class Wallet {
  abstract notify(card: LoyaltyCard, message: string): Promise<void>;
  abstract notifyBulk(cards: LoyaltyCard[], message: string): Promise<void>;
  abstract generateCard(loyaltyCard: LoyaltyCard): Promise<string>;
}

export class WalletFactory {
  private wallets: Map<string, Wallet> = new Map();
  add(name: string, wallet: Wallet) {
    this.wallets.set(name, wallet);
  }

  get(name: string): Wallet | undefined {
    return this.wallets.get(name);
  }
}

describe("Send notifications to shop cards", () => {
  describe("Google", () => {
    it("One notification is sent", async () => {
      const card = LoyaltyCard.fromSnapshot({
        id: "1",
        code: "1234",
        shopId: "1",
        isInWallet: true,
        createdAt: new Date("2025-01-01"),
      });

      const cardsRepository = new InMemoryLoyaltyCardRepository();
      cardsRepository.addCard(card);

      const handler = new SendNotificationToShopCardsCommandHandler(
        cardsRepository
      );

      await handler.execute(
        new SendNotificationToShopCardsCommand({
          shopId: "1",
          message: "Hello, world!",
        })
      );
    });
  });
});
