import { IDGenerator } from "@app/core/domain/providers/id-generator/id-generator";
import { CampaignRepository } from "@app/marketing-campaign/infra/campaign.repository";
import { StartMarketingCampaignCommand } from "@app/marketing-campaign/tests/start-campaign.command.spec";
import { ICommandHandler } from "@nestjs/cqrs";

export class StartMarketingCampaignCommandHandler
  implements ICommandHandler<StartMarketingCampaignCommand>
{
  constructor(
    private readonly CampaignRepo: CampaignRepository,
    private readonly idProvider: IDGenerator
  ) {}
  async execute({ params }: StartMarketingCampaignCommand): Promise<void> {
    await this.CampaignRepo.create({
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
