import * as path from "node:path";
import * as fs from "node:fs";
import * as crypto from "node:crypto";
import * as archiver from "archiver";
import type { GenerationParams, ApplePassGenerator } from "../../ports/apple-pass-generator";
import type { PkPassSignator } from "./PkPassSignator";

type PkPassGeneratorConfig = {
    teamId: string;
    passTypeId: string;
    outputPath: string;
    passkitApiUrl: string;
    apiUrl: string;
};

type Pass = {
    formatVersion: number;
    passTypeIdentifier: string;
    serialNumber: string;
    teamIdentifier: string;
    organizationName: string;
    description: string;
    backgroundColor: string;
    foregroundColor: string;
    webServiceURL: string;
    authenticationToken: string;
    generic: {
        primaryFields: {
            key: string;
            label: string;
            value: string;
            changeMessage?: string;
        }[];
    };
};

export type Manifest = {
    "pass.json": string;
    "icon.png": string;
};

export class PkPassGenerator implements ApplePassGenerator {
    constructor(
        private config: PkPassGeneratorConfig,
        private signator: PkPassSignator,
    ) { }

    async generate({ icon, serialNumber, authToken, title }: GenerationParams): Promise<string> {
        const filename = `${serialNumber}.pkpass`;
        const outputPath = path.resolve(
            this.config.outputPath,
            filename
        );
        const pass = this.getPass(serialNumber, authToken, title);
        const manifest = this.getManifest(pass, icon);
        const signature = this.signator.sign(manifest);

        await this.generateArchive({
            pass,
            manifest,
            signature,
            outputPath,
            icon,
        });

        return `${this.config.apiUrl}/${filename}`;
    }

    private async generateArchive({
        pass,
        manifest,
        signature,
        outputPath,
        icon,
    }: {
        pass: Pass;
        manifest: Manifest;
        signature: string;
        outputPath: string;
        icon: string;
    }) {
        const output = fs.createWriteStream(outputPath);
        const archive = archiver("zip", { store: true });

        archive.pipe(output);
        archive.append(JSON.stringify(pass), { name: "pass.json" });
        archive.append(JSON.stringify(manifest), { name: "manifest.json" });
        archive.append(Buffer.from(signature, "binary"), { name: "signature" });
        archive.file(path.resolve(icon), { name: "icon.png" });
        await archive.finalize();

        return outputPath;
    }

    private getPass(
        serialNumber: string,
        authToken: string,
        title: string,
    ): Pass {
        return {
            formatVersion: 1,
            passTypeIdentifier: this.config.passTypeId,
            serialNumber: serialNumber,
            teamIdentifier: this.config.teamId,
            webServiceURL: this.config.passkitApiUrl,
            authenticationToken: authToken,
            organizationName: "ShareToEat",
            description: "ShareToEat",
            backgroundColor: "#FFFFFF",
            foregroundColor: "#000000",
            generic: {
                primaryFields: [
                    {
                        key: "titre",
                        label: "Carte",
                        value: title,
                        changeMessage: "Changement de titre: %@",
                    },
                ],
            },
        };
    }

    private getManifest(pass: Pass, iconPath: string): Manifest {
        const passHash = crypto
            .createHash("sha1")
            .update(JSON.stringify(pass))
            .digest("hex");

        const iconHash = crypto
            .createHash("sha1")
            .update(fs.readFileSync(path.resolve(iconPath)))
            .digest("hex");

        return {
            "pass.json": passHash,
            "icon.png": iconHash,
        };
    }
}
