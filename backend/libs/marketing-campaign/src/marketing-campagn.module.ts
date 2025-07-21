import { Module } from "@nestjs/common";
import { MarketingCampaignService } from "./marketing-Campaign.service";

@Module({
  providers: [MarketingCampaignService],
  exports: [MarketingCampaignService],
})
export class MarketingCampaignModule {}
