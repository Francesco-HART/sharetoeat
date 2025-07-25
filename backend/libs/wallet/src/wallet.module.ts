import { Module } from "@nestjs/common";
import * as path from "node:path";
import { ConfigService } from "@nestjs/config";
import { CoreModule } from "@app/core/core.module";
import { GoogleWalletController } from "./infra/api/google-wallet.controller";
import { GenerateGoogleWalletCardCommandHandler } from "./application/commands/generate-google-wallet-card.command";
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
import { IDGenerator } from "@app/core/domain/providers/id-generator/id-generator";
import { AuthTokensGenerator } from "./infra/apple-wallet/AuthTokensGenerator";
import { UUIDAuthTokenGenerator } from "./infra/apple-wallet/UUIDAuthTokenGenerator";
import { GoogleWalletSdk } from "./infra/google-wallet/google-wallet-sdk";
import { GoogleAuthentifier } from "./infra/google-wallet/google-wallet-authentifier";
import { GoogleWalletGenerator } from "./infra/google-wallet/google-wallet-generator";
import { GoogleWalletNotifier } from "./infra/google-wallet/google-wallet-notifier";

@Module({
  imports: [
    CoreModule,
    ServeStaticModule.forRoot({
      rootPath: path.resolve("pkpass"),
      serveRoot: "/passes",
    }),
  ],
  controllers: [GoogleWalletController, AppleWalletController],
  providers: [
    {
      provide: LoyaltyCardRepository,
      useClass: InMemoryLoyaltyCardRepository,
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
      provide: AuthTokensGenerator,
      useClass: UUIDAuthTokenGenerator,
    },
    {
      provide: ApplePassGenerator,
      inject: [PkPassSignator, IDGenerator],
      useFactory: (
        signator: PkPassSignator,
        authTokenGenerator: AuthTokensGenerator
      ) => {
        return new PkPassGenerator(
          {
            teamId: "Z4KA5FWMCJ",
            passTypeId: "pass.fr.wally.wallet",
            outputPath: "pkpass",
            passkitApiUrl: "https://7b221f6524d7.ngrok-free.app/apple-wallet",
            apiUrl: "https://7b221f6524d7.ngrok-free.app/passes",
          },
          signator,
          authTokenGenerator
        );
      },
    },
    {
      provide: GoogleWalletSdk,
      useFactory: (configService: ConfigService) => {
        const authentifier = new GoogleAuthentifier({
          serviceAccountKeyFilePath: path.resolve("service-account.json"),
        });
        const googleWalletGenerator = new GoogleWalletGenerator(
          {
            issuerId:
              configService.get<string>("GOOGLE_WALLET_ISSUER_ID") || "",
          },
          authentifier
        );

        const googleWalletNotifier = new GoogleWalletNotifier(authentifier);
        return new GoogleWalletSdk(googleWalletGenerator, googleWalletNotifier);
      },
      inject: [ConfigService],
    },
  ],
  exports: [],
})
export class WalletModule {}
