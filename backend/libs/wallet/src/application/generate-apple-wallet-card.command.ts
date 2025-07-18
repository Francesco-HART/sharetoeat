import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { ApplePassGenerator } from "../ports/apple-pass-generator";
import { IDGenerator } from "@app/core/domain/providers/id-generator/id-generator";

export class GenerateAppleWalletCardCommand implements ICommand {
    constructor(public shopId: string) { }
}

@CommandHandler(GenerateAppleWalletCardCommand)
export class GenerateAppleWalletCardCommandHandler
    implements ICommandHandler<GenerateAppleWalletCardCommand, { url: string, serialNumber: string }> {

    constructor(
        private readonly applePassGenerator: ApplePassGenerator,
        private readonly idGenerator: IDGenerator
    ) { }

    async execute(_: GenerateAppleWalletCardCommand): Promise<{ url: string, serialNumber: string }> {
        const serialNumber = this.idGenerator.generate();
        const url = await this.applePassGenerator.generate({
            serialNumber,
            authToken: this.idGenerator.generate(),
            icon: "icon.png",
            title: "ShareToEat",
        });

        return {
            url,
            serialNumber
        };
    }
}
