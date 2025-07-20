import { LoyaltyCard } from "../domain/loyalty-card";

export abstract class LoyaltyCardRepository {
    abstract create(loyaltyCard: LoyaltyCard): Promise<void>
    abstract update(loyaltyCard: LoyaltyCard): Promise<void>
    abstract findById(id: string): Promise<LoyaltyCard | null>
}
