import { StartMarketingCampaignCommand } from "@app/marketing-campaign/application/commands/start-marketing-campaign.command";
import { Body, Controller, HttpCode, Param, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { StartMarketingCampaignBody } from "../dtos/marketing-campaign.body";
import { StartMarketingCampaignParams } from "../dtos/marketing-campaign.param";


@Controller('campaings')
export class MarketingCampaingController {
    constructor(private readonly commandBus: CommandBus) { }

    @Post(":shopId/:id")
    @HttpCode(201)
    async create(@Param() { id, shopId }: StartMarketingCampaignParams, @Body() body: StartMarketingCampaignBody) {
        await this.commandBus.execute(new StartMarketingCampaignCommand({
            id,
            shopId,
            notifications: body.notifications
        }));
    }
}
