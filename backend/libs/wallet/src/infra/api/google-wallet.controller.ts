import { GenerateGoogleWalletCardCommand } from "@app/wallet/application/generate-google-wallet-card.command";
import { Controller, Get, Param, Res } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Response } from "express";

@Controller("google-wallet")
export class GoogleWalletController {
    constructor(private readonly commandBus: CommandBus) { }

    @Get("/:shopId")
    async generateWalletCard(
        @Param("shopId") shopId: string,
        @Res() res: Response
    ) {
        const url = await this.commandBus.execute(
            new GenerateGoogleWalletCardCommand(shopId)
        );

        return res.redirect(url);
    }
}
