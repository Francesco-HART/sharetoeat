import { Module } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { GoogleWalletGateway } from "./ports/google-wallet.gateway";
import * as path from "path";
import { GoogleWalletService } from "./infra/google-wallet/google-wallet.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CoreModule } from "@app/core/core.module";
import { GoogleWalletController } from "./infra/api/google-wallet.controller";
import { CommandHandler } from "@nestjs/cqrs";
import { GenerateGoogleWalletCardCommandHandler } from "./application/generate-google-wallet-card.command";

export const BASE_PROJECT_PATH = process.cwd();

@Module({
  imports: [CoreModule],

  controllers: [GoogleWalletController],

  providers: [
    GenerateGoogleWalletCardCommandHandler,
    WalletService,
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
export class WalletModule {}
