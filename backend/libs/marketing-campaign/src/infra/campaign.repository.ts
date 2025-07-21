import { Campaign } from "../domain/campaign";

export abstract class CampaignRepository {
    abstract getCampaignsWithNotificationsScheduledAt(scheduledAt: Date): Promise<Campaign[]>
    abstract create(Campaign: Campaign): Promise<void>;
}
