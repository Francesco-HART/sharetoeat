export interface Campagn {
  id: string;
  shopId: string;
  notifications: {
    id: string;
    scheduledAt: Date;
    message: string;
    isSent: boolean;
  }[];
}
