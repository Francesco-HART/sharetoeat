import { Clock } from "@app/core/domain/providers/clock/clock";
import { CampaignRepository } from "@app/marketing-campaign/ports/campaign.repository";
import { WalletGateway } from "@app/wallet/public-ports/wallet.gateway";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";

export class SendCampaignsNotificationsCommand implements ICommand { }

@CommandHandler(SendCampaignsNotificationsCommand)
export class SendCampaignsNotificationsCommandHandler
    implements ICommandHandler<SendCampaignsNotificationsCommand> {

    constructor(
        private readonly campaignRepo: CampaignRepository,
        private readonly clock: Clock,
        private readonly walletGateway: WalletGateway
    ) { }

    async execute(_: SendCampaignsNotificationsCommand): Promise<void> {
        const now = this.clock.nowDateOnly();
        const campaigns = await this.campaignRepo.getCampaignsWithNotificationsScheduledAt(now);

        await Promise.all(campaigns.map(async (campaign) => {
            const notification = campaign.notifications.find((n) => n.scheduledAt.getTime() === now.value.getTime())!;

            await this.walletGateway.sendNotification({
                shopId: campaign.shopId,
                message: notification.message,
            });

            notification.isSent = true;
        }))

        await Promise.all(campaigns.map(async (campaign) => await this.campaignRepo.update(campaign)));

    }
}
