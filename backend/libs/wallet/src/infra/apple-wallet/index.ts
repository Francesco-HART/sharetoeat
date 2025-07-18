import { PkPassGenerator } from "./PkPassGenerator";
import type { ApplePassGenerator } from "../../ports/apple-pass-generator";
import { PkPassSignator } from "./PkPassSignator";
import { startServer } from "./server";
import { PushNotification } from "./PushNotification";

const apiUrl = "https://5c117371f0ee.ngrok-free.app";

const signator = new PkPassSignator({
    certificatePath: "certificats/pass.pem",
    keyPath: "certificats/pass.key",
    wwdrCertificatePath: "certificats/wwdr.pem",
});

const pkPassGenerator = new PkPassGenerator(
    {
        teamId: "Z4KA5FWMCJ",
        passTypeId: "pass.fr.wally.wallet",
        outputPath: "pkpass",
        passkitApiUrl: `${apiUrl}`,
    },
    signator,
);

const passGenerator: ApplePassGenerator = pkPassGenerator;
const pushNotification = new PushNotification({
    certificatePath: "certificats/pass.pem",
    keyPath: "certificats/pass.key",
    passTypeIdentifier: "pass.fr.wally.wallet",
});

startServer(passGenerator, pushNotification);
