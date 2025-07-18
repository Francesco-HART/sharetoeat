import { AuthModule } from "@app/auth";
import { CoreModule } from "@app/core/core.module";
import { WalletModule } from "@app/google-wallet";
import { Module } from "@nestjs/common";

@Module({
  imports: [CoreModule, WalletModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
