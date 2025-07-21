import { CoreModule } from "@app/core/core.module";
import { MarketingCampaignModule } from "@app/marketing-campaign/marketing-campaign.module";
import { WalletModule } from "@app/wallet";
import { Module } from "@nestjs/common";

@Module({
    imports: [CoreModule, WalletModule, MarketingCampaignModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
