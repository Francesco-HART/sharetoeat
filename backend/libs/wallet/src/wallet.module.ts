import { Module } from "@nestjs/common";
import { GoogleWalletGateway } from "./ports/google-wallet.gateway";
import * as path from "node:path";
import { GoogleWalletService } from "./infra/google-wallet/google-wallet.service";
import { ConfigService } from "@nestjs/config";
import { CoreModule } from "@app/core/core.module";
import { GoogleWalletController } from "./infra/api/google-wallet.controller";
import { GenerateGoogleWalletCardCommandHandler } from "./application/generate-google-wallet-card.command";
import { GenerateAppleWalletCardCommandHandler } from "./application/commands/generate-apple-wallet-card.command";
import { ApplePassGenerator } from "./ports/apple-pass-generator";
import { PkPassGenerator } from "./infra/apple-wallet/PkPassGenerator";
import { PkPassSignator } from "./infra/apple-wallet/PkPassSignator";
import { AppleWalletController } from "./infra/api/apple-wallet.controller";
import { RegisterAppleDeviceCommandHandler } from "./application/commands/register-apple-device.command";
import { UnregisterAppleDeviceCommandHandler } from "./application/commands/unregister-apple-device.command";
import { AppleRegistrationRepository } from "./ports/apple-wallet-registration.repository";
import { InMemoryAppleRegistrationRepository } from "./infra/apple-wallet/in-memory-apple-registration.repository";
import { ServeStaticModule } from "@nestjs/serve-static";
import { LoyaltyCardRepository } from "./ports/loyalty-card.repository";
import { InMemoryLoyaltyCardRepository } from "./infra/repositories/loyalty-cards/in-memory-loyalty-card.repository";

@Module({
    imports: [CoreModule, ServeStaticModule.forRoot({
        rootPath: path.resolve('pkpass'),
        serveRoot: '/passes',
    }),],
    controllers: [GoogleWalletController, AppleWalletController],
    providers: [
        {
            provide: LoyaltyCardRepository,
            useClass: InMemoryLoyaltyCardRepository
        },

        GenerateGoogleWalletCardCommandHandler,
        GenerateAppleWalletCardCommandHandler,
        RegisterAppleDeviceCommandHandler,
        UnregisterAppleDeviceCommandHandler,
        {
            provide: AppleRegistrationRepository,
            useClass: InMemoryAppleRegistrationRepository,
        },
        {
            provide: PkPassSignator,
            useFactory: () => {
                return new PkPassSignator({
                    certificatePath: "certificats/pass.pem",
                    keyPath: "certificats/pass.key",
                    wwdrCertificatePath: "certificats/wwdr.pem",
                });
            },
        },
        {
            provide: ApplePassGenerator,
            inject: [PkPassSignator],
            useFactory: (signator: PkPassSignator) => {
                return new PkPassGenerator({
                    teamId: "Z4KA5FWMCJ",
                    passTypeId: "pass.fr.wally.wallet",
                    outputPath: "pkpass",
                    passkitApiUrl: "https://7b221f6524d7.ngrok-free.app/apple-wallet",
                    apiUrl: "https://7b221f6524d7.ngrok-free.app/passes",
                }, signator);
            },
        },
        {
            provide: GoogleWalletGateway,
            useFactory: (configService: ConfigService) => {
                return new GoogleWalletService({
                    issuerId: configService.get<string>("GOOGLE_WALLET_ISSUER_ID") || "",
                    serviceAccountKey:
                        configService.get<string>("GOOGLE_WALLET_SERVICE_ACCOUNT_KEY") ||
                        "",
                    keyFilePath: path.resolve("service-account.json"),
                });
            },
            inject: [ConfigService],
        },
    ],
    exports: [],
})
export class WalletModule { }
