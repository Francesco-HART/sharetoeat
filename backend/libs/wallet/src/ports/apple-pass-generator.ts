import { LoyaltyCard } from "../domain/loyalty-card";

export abstract class ApplePassGenerator {
    abstract generate(loyaltyCard: LoyaltyCard): Promise<string>;
}
