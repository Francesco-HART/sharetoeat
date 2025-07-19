import { LoyaltyCard, LoyaltyCardSnapshot } from "@app/wallet/domain/loyalty-card";
import { LoyaltyCardRepository } from "@app/wallet/ports/loyalty-card.repository";

export class InMemoryLoyaltyCardRepository implements LoyaltyCardRepository {
    private cards: Map<string, LoyaltyCardSnapshot> = new Map();

    async create(loyaltyCard: LoyaltyCard): Promise<void> {
        this.cards.set(loyaltyCard.id, loyaltyCard.snapshot);
    }

    public getAll(): LoyaltyCardSnapshot[] {
        return Array.from(this.cards.values());
    }
}
