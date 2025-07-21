import { CampaignNotification } from "./notification";

export interface Campaign {
  id: string;
  shopId: string;
  notifications: CampaignNotification[];
}
