import { DateOnly } from "@app/core/domain/value-objects/date-only";
import { Campaign } from "../domain/campaign";
import { CampaignRepository } from "../ports/campaign.repository";

export class InMemoryCampaignRepository implements CampaignRepository {
    campaigns = new Map<string, Campaign>();

    async create(campaign: Campaign) {
        this.campaigns.set(campaign.id, campaign);
    }

    async update(campaign: Campaign): Promise<void> {
        this.campaigns.set(campaign.id, campaign);
    }

    async getCampaignsWithNotificationsScheduledAt(scheduledAt: DateOnly): Promise<Campaign[]> {
        const scheduledAtDate = scheduledAt.value;
        return Array.from(this.campaigns.values())
            .filter((c) => c.notifications.some((n) => n.scheduledAt.getTime() === scheduledAtDate.getTime()));
    }

    getOneCampaign(id: string) {
        return this.campaigns.get(id);
    }

    addCampaign(campaign: Campaign) {
        this.campaigns.set(campaign.id, campaign);
    }
}
