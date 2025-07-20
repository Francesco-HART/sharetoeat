import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { IDGenerator } from "@app/core/domain/providers/id-generator/id-generator";
import { ApplePassGenerator } from "@app/wallet/ports/apple-pass-generator";
import { LoyaltyCardRepository } from "@app/wallet/ports/loyalty-card.repository";
import { Clock } from "@app/core/domain/providers/clock/clock";
import { LoyaltyCard } from "@app/wallet/domain/loyalty-card";

export class GenerateAppleWalletCardCommand implements ICommand {
    constructor(public shopId: string) { }
}

@CommandHandler(GenerateAppleWalletCardCommand)
export class GenerateAppleWalletCardCommandHandler
    implements ICommandHandler<GenerateAppleWalletCardCommand, string> {

    constructor(
        private readonly loyaltyCardRepository: LoyaltyCardRepository,
        private readonly applePassGenerator: ApplePassGenerator,
        private readonly idGenerator: IDGenerator,
        private readonly clock: Clock
    ) { }

    async execute({ shopId }: GenerateAppleWalletCardCommand): Promise<string> {
        const loyaltyCard = LoyaltyCard.create({
            id: this.idGenerator.generate(),
            shopId,
            code: this.idGenerator.generate(),
            currentDate: this.clock.now(),
        })

        await this.loyaltyCardRepository.create(loyaltyCard);
        return this.applePassGenerator.generate(loyaltyCard);
    }
}
