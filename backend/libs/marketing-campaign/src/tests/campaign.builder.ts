import { Campaign } from "../domain/campaign";

export const createCampaign = ({
  id = "",
  shopId = "",
  notifications = [],
}: Partial<Campaign>): Campaign => {
  return {
    id,
    shopId,
    notifications,
  };
};
