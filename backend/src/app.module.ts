import { CoreModule } from "@app/core/core.module";
import { WalletModule } from "@app/wallet";
import { Module } from "@nestjs/common";

@Module({
    imports: [CoreModule, WalletModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
