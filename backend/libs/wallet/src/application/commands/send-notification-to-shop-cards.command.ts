import { LoyaltyCardRepository } from "@app/wallet/ports/loyalty-card.repository";
import { ICommand, ICommandHandler } from "@nestjs/cqrs";
import { WalletFactory } from "libs/wallet/test/commands/send-notifications-to-shop-card.command.spec";

export class SendNotificationToShopCardsCommand implements ICommand {
    constructor(public params: {
        shopId: string,
        message: string
    }) { }
}

export class SendNotificationToShopCardsCommandHandler implements ICommandHandler<SendNotificationToShopCardsCommand> {
    constructor(
        private readonly loyaltyCardRepository: LoyaltyCardRepository,
        private wallets: WalletFactory
    ) { }

    async execute(command: SendNotificationToShopCardsCommand): Promise<any> {
    }
}
