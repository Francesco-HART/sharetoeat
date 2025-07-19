import { DeterministicClock } from "@app/core/domain/providers/clock/deterministic-clock";
import { DeterministicIDGenerator } from "@app/core/domain/providers/id-generator/deterministic-id-generator";
import { GenerateAppleWalletCardCommand, GenerateAppleWalletCardCommandHandler } from "@app/wallet/application/commands/generate-apple-wallet-card.command";
import { InMemoryLoyaltyCardRepository } from "@app/wallet/infra/repositories/loyalty-cards/in-memory-loyalty-card.repository";
import { ApplePassGenerator, GenerationParams } from "@app/wallet/ports/apple-pass-generator";

class FakeApplePassGenerator implements ApplePassGenerator {
    generate(params: GenerationParams): Promise<string> {
        return Promise.resolve("card-url");
    }
}

describe('Feature: Generate loyalty card', () => {
    test('Card is generated', async () => {
        const repository = new InMemoryLoyaltyCardRepository();
        await new GenerateAppleWalletCardCommandHandler(
            repository,
            new FakeApplePassGenerator(),
            new DeterministicIDGenerator("1234"),
            new DeterministicClock(new Date("2025-01-01"))
        ).execute(new GenerateAppleWalletCardCommand("shop-1"));

        const cards = repository.getAll();
        expect(cards).toEqual([
            {
                id: "1234",
                code: "1234",
                shopId: "shop-1",
                isInWallet: false,
                createdAt: new Date("2025-01-01")
            }
        ])
    })
});
