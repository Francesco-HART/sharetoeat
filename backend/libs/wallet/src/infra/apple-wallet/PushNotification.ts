import apn from "apn";
import path from "node:path";

type PushNotificationConfig = {
	certificatePath: string;
	keyPath: string;
	passTypeIdentifier: string;
};

export class PushNotification {
	private apnProvider: apn.Provider;

	constructor(private config: PushNotificationConfig) {
		this.apnProvider = new apn.Provider({
			cert: path.resolve(config.certificatePath),
			key: path.resolve(config.keyPath),
			production: true,
		});
	}

	async send(pushToken: string) {
		const notification = new apn.Notification();
		notification.payload = {};
		notification.topic = this.config.passTypeIdentifier;
		await this.apnProvider.send(notification, pushToken);
	}
}
