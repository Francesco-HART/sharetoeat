export type Registration = {
    deviceLibraryIdentifier: string;
    pushToken: string;
    serialNumber: string;
}

export type Unregistration = Omit<Registration, "pushToken">

export abstract class AppleRegistrationRepository {
    abstract register(registration: Registration): Promise<void>;
    abstract unregister(unregistration: Unregistration): Promise<void>;
}
