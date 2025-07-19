import { Provider, Notification } from "apn";
import * as path from "node:path";

type PushNotificationConfig = {
    certificatePath: string;
    keyPath: string;
    passTypeIdentifier: string;
};

export class PushNotification {
    private apnProvider: Provider;

    constructor(private config: PushNotificationConfig) {
        this.apnProvider = new Provider({
            cert: path.resolve(config.certificatePath),
            key: path.resolve(config.keyPath),
            production: true,
        });
    }

    async send(pushToken: string) {
        const notification = new Notification();
        notification.payload = {};
        notification.topic = this.config.passTypeIdentifier;
        await this.apnProvider.send(notification, pushToken);
    }
}
