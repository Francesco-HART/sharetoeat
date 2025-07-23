import { DateOnly } from "@app/core/domain/value-objects/date-only";
import { Campaign } from "../domain/campaign";

export abstract class CampaignRepository {
    abstract getCampaignsWithNotificationsScheduledAt(scheduledAt: DateOnly): Promise<Campaign[]>
    abstract create(campaign: Campaign): Promise<void>;
    abstract update(campaign: Campaign): Promise<void>;
}
