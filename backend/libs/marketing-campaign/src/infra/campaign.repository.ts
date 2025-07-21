import { Campaign } from "../domain/campaign";

export abstract class CampaignRepository {
    abstract getCampaignsWithNotificationsScheduledAt(scheduledAt: Date): Promise<Campaign[]>
    abstract create(campaign: Campaign): Promise<void>;
    abstract update(campaign: Campaign): Promise<void>;
}
