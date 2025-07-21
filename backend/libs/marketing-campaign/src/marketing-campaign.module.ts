import { CoreModule } from "@app/core/core.module";
import { Module } from "@nestjs/common";
import { MarketingCampaingController } from "./infra/api/controllers/marketing-campaing.controller";
import { StartMarketingCampaignCommandHandler } from "./application/commands/start-marketing-campaign.command";
import { CampaignRepository } from "./infra/campaign.repository";
import { InMemoryCampaignRepository } from "./infra/in-memory-campaign.repository";
import { MarketingCampaignNotificationsJob } from "./application/jobs/marketing-campaign-notifications.job";
import { SendCampaignsNotificationsCommandHandler } from "./application/commands/send-campaigns-notifications.command";
import { WalletGateway } from "@app/wallet/public-ports/wallet.gateway";
import { RealWalletGateway } from "@app/wallet/public-ports/real-wallet.gateway";

@Module({
    imports: [CoreModule],
    controllers: [MarketingCampaingController],
    providers: [
        MarketingCampaignNotificationsJob,
        SendCampaignsNotificationsCommandHandler,
        StartMarketingCampaignCommandHandler,
        {
            provide: WalletGateway,
            useClass: RealWalletGateway
        },
        {
            provide: CampaignRepository,
            useClass: InMemoryCampaignRepository
        }
    ],
})
export class MarketingCampaignModule { }
