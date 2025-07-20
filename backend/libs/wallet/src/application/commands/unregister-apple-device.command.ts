import { AppleRegistrationRepository } from "@app/wallet/ports/apple-wallet-registration.repository";
import { LoyaltyCardRepository } from "@app/wallet/ports/loyalty-card.repository";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";

export class UnregisterAppleDeviceCommand implements ICommand {
    constructor(public params: {
        deviceLibraryIdentifier: string,
        serialNumber: string
    }) { }
}

@CommandHandler(UnregisterAppleDeviceCommand)
export class UnregisterAppleDeviceCommandHandler
    implements ICommandHandler<UnregisterAppleDeviceCommand> {

    constructor(
        private readonly appleRegistrationRepository: AppleRegistrationRepository,
        private readonly loyaltyCardRepository: LoyaltyCardRepository
    ) { }

    async execute({ params }: UnregisterAppleDeviceCommand): Promise<any> {
        const { serialNumber } = params;
        const loyaltyCard = await this.loyaltyCardRepository.findById(serialNumber);

        if (!loyaltyCard) {
            return;
        }

        loyaltyCard.removeFromWallet();

        await this.loyaltyCardRepository.update(loyaltyCard);
        await this.appleRegistrationRepository.unregister(params);
    }
}
