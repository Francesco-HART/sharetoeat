import { Campaign } from "../domain/campaign";
import { CampaignRepository } from "./campaign.repository";

export class InMemoryCampaignRepository implements CampaignRepository {
  Campaigns = new Map<string, Campaign>();
  async create(Campaign: Campaign) {
    this.Campaigns.set(Campaign.id, Campaign);
  }

  getOneCampaign(id: string) {
    return this.Campaigns.get(id);
  }
}
