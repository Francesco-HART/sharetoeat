import { LoyaltyCard } from "../domain/loyalty-card";

export abstract class LoyaltyCardRepository {
    abstract create(loyaltyCard: LoyaltyCard): Promise<void>
}
