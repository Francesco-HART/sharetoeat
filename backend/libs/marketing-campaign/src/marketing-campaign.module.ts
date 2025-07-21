import { CoreModule } from "@app/core/core.module";
import { Module } from "@nestjs/common";
import { MarketingCampaingController } from "./infra/api/controllers/marketing-campaing.controller";
import { StartMarketingCampaignCommandHandler } from "./application/commands/start-marketing-campaign.command";
import { CampaignRepository } from "./infra/campaign.repository";
import { InMemoryCampaignRepository } from "./infra/in-memory-campaign.repository";

@Module({
    imports: [CoreModule],
    controllers: [MarketingCampaingController],
    providers: [
        StartMarketingCampaignCommandHandler,
        {
            provide: CampaignRepository,
            useClass: InMemoryCampaignRepository
        }
    ],
})
export class MarketingCampaignModule { }
