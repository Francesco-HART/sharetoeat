import { CampaignNotification } from "../domain/notification";

export const createNotification = ({
  id = "",
  scheduledAt = new Date(),
  message = "",
  isSent = false,
}: Partial<CampaignNotification>): CampaignNotification => {
  return {
    id,
    scheduledAt,
    message,
    isSent,
  };
};

export const createNotifications = (
  params: Partial<CampaignNotification>[]
): CampaignNotification[] => {
  return params.map(createNotification);
};
