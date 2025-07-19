import { AppleRegistrationRepository, Registration, Unregistration } from "@app/google-wallet/ports/apple-wallet-registration.repository";

type SerialNumber = string;
type DeviceLibraryIdentifier = string;
type PushToken = string;

export class InMemoryAppleRegistrationRepository implements AppleRegistrationRepository {
    private registrations: Map<SerialNumber, Map<DeviceLibraryIdentifier, PushToken>> = new Map();

    async register({ serialNumber, deviceLibraryIdentifier, pushToken }: Registration): Promise<void> {
        if (!this.registrations[serialNumber]) this.registrations[serialNumber] = {};
        this.registrations[serialNumber][deviceLibraryIdentifier] = pushToken;
    }

    async unregister({ serialNumber, deviceLibraryIdentifier }: Unregistration): Promise<void> {
        if (!this.registrations[serialNumber]) return;
        delete this.registrations[serialNumber][deviceLibraryIdentifier];
    }
}
