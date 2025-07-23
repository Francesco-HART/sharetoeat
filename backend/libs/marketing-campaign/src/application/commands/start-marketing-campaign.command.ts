import { IDGenerator } from "@app/core/domain/providers/id-generator/id-generator";
import { CampaignRepository } from "@app/marketing-campaign/ports/campaign.repository";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";

export class StartMarketingCampaignCommand implements ICommand {
    constructor(
        public params: {
            id: string;
            shopId: string;
            notifications: {
                scheduledAt: Date;
                message: string;
            }[];
        }
    ) { }
}

@CommandHandler(StartMarketingCampaignCommand)
export class StartMarketingCampaignCommandHandler
    implements ICommandHandler<StartMarketingCampaignCommand> {
    constructor(
        private readonly campaignRepo: CampaignRepository,
        private readonly idProvider: IDGenerator
    ) { }
    async execute({ params }: StartMarketingCampaignCommand): Promise<void> {
        await this.campaignRepo.create({
            id: params.id,
            shopId: params.shopId,
            notifications: params.notifications.map((notif) => ({
                id: this.idProvider.generate(),
                scheduledAt: notif.scheduledAt,
                message: notif.message,
                isSent: false,
            })),
        });
    }
}
