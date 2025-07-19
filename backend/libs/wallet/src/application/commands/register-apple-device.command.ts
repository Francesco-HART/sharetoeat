import { AppleRegistrationRepository } from "@app/wallet/ports/apple-wallet-registration.repository";
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

    constructor(private readonly appleRegistrationRepository: AppleRegistrationRepository) { }

    async execute(command: RegisterAppleDeviceCommand): Promise<any> {
        await this.appleRegistrationRepository.register(command.params);
    }
}
