import { GenerateAppleWalletCardCommand } from "@app/wallet/application/commands/generate-apple-wallet-card.command";
import { RegisterAppleDeviceCommand } from "@app/wallet/application/commands/register-apple-device.command";
import { UnregisterAppleDeviceCommand } from "@app/wallet/application/commands/unregister-apple-device.command";
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Res } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Response } from "express";

@Controller("apple-wallet")
export class AppleWalletController {
    constructor(private readonly commandBus: CommandBus) { }

    @Get("/:shopId")
    async generateWalletCard(
        @Param("shopId") shopId: string,
        @Res() res: Response
    ) {
        const url = await this.commandBus.execute(
            new GenerateAppleWalletCardCommand(shopId)
        );
        return res.redirect(url);
    }


    @Post("/v1/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier/:serialNumber")
    @HttpCode(201)
    async registerDevice(@Param("deviceLibraryIdentifier") deviceLibraryIdentifier: string, @Param("serialNumber") serialNumber: string, @Body("pushToken") pushToken: string) {
        await this.commandBus.execute(new RegisterAppleDeviceCommand({
            deviceLibraryIdentifier,
            pushToken,
            serialNumber
        }));
    }

    @Delete("/v1/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier/:serialNumber")
    async unregisterDevice(@Param("deviceLibraryIdentifier") deviceLibraryIdentifier: string, @Param("serialNumber") serialNumber: string) {
        await this.commandBus.execute(new UnregisterAppleDeviceCommand({
            deviceLibraryIdentifier,
            serialNumber
        }));
    }

    @Get("/v1/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier")
    async getUpdatedPasses(@Param("deviceLibraryIdentifier") deviceLibraryIdentifier: string, @Param("passTypeIdentifier") passTypeIdentifier: string) {

    }

    @Get("/v1/passes/:passTypeIdentifier/:serialNumber")
    async getPass(@Res() res: Response, @Param("passTypeIdentifier") passTypeIdentifier: string, @Param("serialNumber") serialNumber: string) {
    }
}
