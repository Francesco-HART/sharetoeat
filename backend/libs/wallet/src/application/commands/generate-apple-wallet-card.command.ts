import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { IDGenerator } from "@app/core/domain/providers/id-generator/id-generator";
import { ApplePassGenerator } from "@app/google-wallet/ports/apple-pass-generator";

export class GenerateAppleWalletCardCommand implements ICommand {
    constructor(public shopId: string) { }
}

@CommandHandler(GenerateAppleWalletCardCommand)
export class GenerateAppleWalletCardCommandHandler
    implements ICommandHandler<GenerateAppleWalletCardCommand, string> {

    constructor(
        private readonly applePassGenerator: ApplePassGenerator,
        private readonly idGenerator: IDGenerator
    ) { }

    async execute(_: GenerateAppleWalletCardCommand): Promise<string> {
        return this.applePassGenerator.generate({
            serialNumber: this.idGenerator.generate(),
            authToken: this.idGenerator.generate(),
            icon: "icon.png",
            title: "ShareToEat",
        });
    }
}
