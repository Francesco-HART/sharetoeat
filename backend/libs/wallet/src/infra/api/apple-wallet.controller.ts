import { GenerateAppleWalletCardCommand } from "@app/google-wallet/application/generate-apple-wallet-card.command";
import { Controller, Get, Param, Res } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Response } from "express";
import * as fs from "node:fs";

@Controller("apple-wallet")
export class AppleWalletController {
    constructor(private readonly commandBus: CommandBus) { }

    @Get("/:shopId")
    async generateWalletCard(
        @Param("shopId") shopId: string,
        @Res() res: Response
    ) {
        const { url, serialNumber } = await this.commandBus.execute(
            new GenerateAppleWalletCardCommand(shopId)
        );

        res.set({
            "Content-Type": "application/vnd.apple.pkpass",
            "Content-Disposition": `attachment; filename=${serialNumber}.pkpass`,
        });
        fs.createReadStream(url).pipe(res);
        return
    }
}
