import { AppleRegistrationRepository } from "@app/wallet/ports/apple-wallet-registration.repository";
import { LoyaltyCardRepository } from "@app/wallet/ports/loyalty-card.repository";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";

export class RegisterAppleDeviceCommand implements ICommand {
    constructor(public params: {
        deviceLibraryIdentifier: string,
        pushToken: string,
        serialNumber: string
    }) { }
}

@CommandHandler(RegisterAppleDeviceCommand)
export class RegisterAppleDeviceCommandHandler
    implements ICommandHandler<RegisterAppleDeviceCommand> {

    constructor(
        private readonly appleRegistrationRepository: AppleRegistrationRepository,
        private readonly loyaltyCardRepository: LoyaltyCardRepository
    ) { }

    async execute({ params }: RegisterAppleDeviceCommand): Promise<any> {
        const { serialNumber } = params;
        const loyaltyCard = await this.loyaltyCardRepository.findById(serialNumber);

        if (!loyaltyCard) {
            return;
        }

        loyaltyCard.addToWallet();

        await this.loyaltyCardRepository.update(loyaltyCard);
        await this.appleRegistrationRepository.register(params);
    }
}
