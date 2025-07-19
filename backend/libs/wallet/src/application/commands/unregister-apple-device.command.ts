import { AppleRegistrationRepository } from "@app/wallet/ports/apple-wallet-registration.repository";
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

    constructor(private readonly appleRegistrationRepository: AppleRegistrationRepository) { }

    async execute(command: UnregisterAppleDeviceCommand): Promise<any> {
        await this.appleRegistrationRepository.unregister(command.params);
    }
}
