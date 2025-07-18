import { Module } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { GoogleWalletGateway } from "./ports/google-wallet.gateway";
import * as path from "node:path";
import { GoogleWalletService } from "./infra/google-wallet/google-wallet.service";
import { ConfigService } from "@nestjs/config";
import { CoreModule } from "@app/core/core.module";
import { GoogleWalletController } from "./infra/api/google-wallet.controller";
import { GenerateGoogleWalletCardCommandHandler } from "./application/generate-google-wallet-card.command";
import { GenerateAppleWalletCardCommandHandler } from "./application/generate-apple-wallet-card.command";
import { ApplePassGenerator } from "./ports/apple-pass-generator";
import { PkPassGenerator } from "./infra/apple-wallet/PkPassGenerator";
import { PkPassSignator } from "./infra/apple-wallet/PkPassSignator";
import { AppleWalletController } from "./infra/api/apple-wallet.controller";

@Module({
    imports: [CoreModule],
    controllers: [GoogleWalletController, AppleWalletController],
    providers: [
        GenerateGoogleWalletCardCommandHandler,
        GenerateAppleWalletCardCommandHandler,
        WalletService,
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
                    passkitApiUrl: "https://5c117371f0ee.ngrok-free.app",
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
    exports: [WalletService],
})
export class WalletModule { }
