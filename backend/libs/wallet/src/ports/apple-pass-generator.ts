export type GenerationParams = {
    serialNumber: string;
    authToken: string;
    icon: string;
    title: string;
};

export abstract class ApplePassGenerator {
    abstract generate(params: GenerationParams): Promise<string>;
}
