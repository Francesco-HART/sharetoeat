import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Cron, CronExpression } from "@nestjs/schedule";
import { SendCampaignsNotificationsCommand } from "../commands/send-campaigns-notifications.command";

@Injectable()
export class MarketingCampaignNotificationsJob {
    constructor(private commandBus: CommandBus) { }

    @Cron(CronExpression.EVERY_DAY_AT_NOON)
    async sendCampaignsNotifications() {
        await this.commandBus.execute(new SendCampaignsNotificationsCommand());
    }
}
