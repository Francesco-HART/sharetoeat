import { Injectable } from "@nestjs/common";
import { SendNotificationParams, WalletGateway } from "./wallet.gateway";
import { CommandBus } from "@nestjs/cqrs";
import { SendNotificationToShopCardsCommand } from "../application/commands/send-notification-to-shop-cards.command";

@Injectable()
export class RealWalletGateway implements WalletGateway {
    constructor(private commandBus: CommandBus) { }

    async sendNotification(params: SendNotificationParams): Promise<void> {
        await this.commandBus.execute(
            new SendNotificationToShopCardsCommand(params)
        )
    }
}
