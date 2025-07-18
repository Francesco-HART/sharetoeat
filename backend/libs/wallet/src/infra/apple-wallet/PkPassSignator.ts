import * as forge from "node-forge";
import * as fs from "node:fs";
import type { Manifest } from "./PkPassGenerator";

type SignatorConfig = {
    certificatePath: string;
    keyPath: string;
    wwdrCertificatePath: string;
};

export class PkPassSignator {
    private key: forge.pki.rsa.PrivateKey;
    private cert: forge.pki.Certificate;
    private wwdr: forge.pki.Certificate;

    constructor(config: SignatorConfig) {
        const passCert = this.readFile(config.certificatePath);
        const passKey = this.readFile(config.keyPath);
        const wwdrCert = this.readFile(config.wwdrCertificatePath);

        this.cert = forge.pki.certificateFromPem(passCert);
        this.key = forge.pki.privateKeyFromPem(passKey);
        this.wwdr = forge.pki.certificateFromPem(wwdrCert);
    }

    private readFile(path: string): string {
        return fs.readFileSync(path, "utf-8");
    }

    sign(manifest: Manifest): string {
        const md = forge.md.sha1.create();
        const p7 = forge.pkcs7.createSignedData();

        p7.content = forge.util.createBuffer(JSON.stringify(manifest));

        p7.addCertificate(this.cert);
        p7.addCertificate(this.wwdr);

        p7.addSigner({
            key: this.key,
            certificate: this.cert,
            digestAlgorithm: forge.pki.oids.sha1,
            authenticatedAttributes: [
                {
                    type: forge.pki.oids.contentType,
                    value: forge.pki.oids.data,
                },
                {
                    type: forge.pki.oids.messageDigest,
                    value: md.digest().bytes(),
                },
                {
                    type: forge.pki.oids.signingTime,
                    value: new Date().toISOString(),
                },
            ],
        });

        p7.sign({ detached: true });

        return forge.asn1.toDer(p7.toAsn1()).getBytes();
    }
}
