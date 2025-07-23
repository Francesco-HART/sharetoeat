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
        const campaigns = await this.campaignRepo.getCampaignsWithNotificationsScheduledAt(this.clock.nowDateOnly());
        const campaign = campaigns[0];

        await this.walletGateway.sendNotification({
            shopId: campaign.shopId,
            message: campaign.notifications[0].message,
        });

        campaign.notifications[0].isSent = true;

        await this.campaignRepo.update(campaign);
    }
}
