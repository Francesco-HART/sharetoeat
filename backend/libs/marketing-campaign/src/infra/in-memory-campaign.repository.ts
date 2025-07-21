import { Campaign } from "../domain/campaign";
import { CampaignRepository } from "./campaign.repository";

export class InMemoryCampaignRepository implements CampaignRepository {
    campaigns = new Map<string, Campaign>();

    async create(Campaign: Campaign) {
        this.campaigns.set(Campaign.id, Campaign);
    }

    async getCampaignsWithNotificationsScheduledAt(scheduledAt: Date): Promise<Campaign[]> {
        return Array.from(this.campaigns.values())
            .filter((c) => c.notifications.some((n) => n.scheduledAt.getTime() === scheduledAt.getTime()));
    }

    getOneCampaign(id: string) {
        return this.campaigns.get(id);
    }

    addCampaign(campaign: Campaign) {
        this.campaigns.set(campaign.id, campaign);
    }
}
