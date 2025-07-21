import { LoyaltyCard, LoyaltyCardSnapshot } from "@app/wallet/domain/loyalty-card";
import { LoyaltyCardRepository } from "@app/wallet/ports/loyalty-card.repository";

export class InMemoryLoyaltyCardRepository implements LoyaltyCardRepository {
    private cards: Map<string, LoyaltyCardSnapshot> = new Map();

    async create(loyaltyCard: LoyaltyCard): Promise<void> {
        this.cards.set(loyaltyCard.id, loyaltyCard.snapshot);
    }

    async update(loyaltyCard: LoyaltyCard): Promise<void> {
        this.cards.set(loyaltyCard.id, loyaltyCard.snapshot);
    }

    async findById(id: string): Promise<LoyaltyCard | null> {
        const snapshot = this.cards.get(id);
        return snapshot ? LoyaltyCard.fromSnapshot(snapshot) : null;
    }

    public getAll(): LoyaltyCardSnapshot[] {
        return Array.from(this.cards.values());
    }

    public addCard(card: LoyaltyCard) {
        this.cards.set(card.id, card.snapshot);
    }
}
