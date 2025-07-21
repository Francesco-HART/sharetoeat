export type SendNotificationParams = {
    shopId: string;
    message: string;
}

export abstract class WalletGateway {
    abstract sendNotification(params: SendNotificationParams): Promise<void>;
}
