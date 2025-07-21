import { IDGenerator } from "@app/core/domain/providers/id-generator/id-generator";
import { CampagnRepository } from "@app/marketing-campagn/infra/campagn.repository";
import { StartMarketingCampagnCommand } from "@app/marketing-campagn/tests/start-campagn.command.spec";
import { ICommandHandler } from "@nestjs/cqrs";

export class StartMarketingCampagnCommandHandler
  implements ICommandHandler<StartMarketingCampagnCommand>
{
  constructor(
    private readonly campagnRepo: CampagnRepository,
    private readonly idProvider: IDGenerator
  ) {}
  async execute({ params }: StartMarketingCampagnCommand): Promise<void> {
    await this.campagnRepo.create({
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
