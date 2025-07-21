import { Campaign } from "../domain/campaign";

export abstract class CampaignRepository {
  abstract create(Campaign: Campaign): Promise<void>;
}
