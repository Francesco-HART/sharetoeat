/*
import express from "express";
import path from "node:path";
import fs from "node:fs";
import type { ApplePassGenerator } from "../../ports/apple-pass-generator";
import type { PushNotification } from "./PushNotification";

export const startServer = (
    passGenerator: ApplePassGenerator,
    pushNotification: PushNotification,
) => {
    const app = express();
    app.use(express.json());

    app.use((req, res, next) => {
        console.log(`${req.method} ${req.originalUrl}`);
        next();
    });

    const port = 3000;

    // Stockage simple en mémoire (à remplacer par une base persistante)
    const registrations: Record<string, Record<string, string>> = {};
    const updatedPasses: Record<string, boolean> = {};

    const passes: Record<string, string> = {};

    // Middleware d’authentification basique pour demo (à adapter)
    function authenticate(req: any, res: any, next: any) {
        const authHeader = req.headers.authorization || "";
        if (!authHeader.startsWith("ApplePass ")) {
            return res.status(401).send("Unauthorized");
        }
        next();
    }

    // Enregistrer un device pour un pass
    app.post(
        "/v1/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier/:serialNumber",
        authenticate,
        (req, res) => {
            const { deviceLibraryIdentifier, serialNumber } = req.params;
            const pushToken = req.body.pushToken;

            if (!pushToken) {
                return res.status(400).json({ error: "Missing pushToken" });
            }

            if (!registrations[serialNumber]) registrations[serialNumber] = {};
            registrations[serialNumber][deviceLibraryIdentifier] = pushToken;

            console.log(
                `Registered device ${deviceLibraryIdentifier} for pass ${serialNumber}`,
            );

            res.status(201).send(); // Created
        },
    );

    // Désinscrire un device
    app.delete(
        "/v1/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier/:serialNumber",
        authenticate,
        (req, res) => {
            const { deviceLibraryIdentifier, serialNumber } = req.params;

            if (registrations[serialNumber]) {
                delete registrations[serialNumber][deviceLibraryIdentifier];
                console.log(
                    `Unregistered device ${deviceLibraryIdentifier} for pass ${serialNumber}`,
                );
            }
            res.status(200).send();
        },
    );
    app.get(
        "/v1/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier",
        (req, res) => {
            console.log("Get list updated");
            const { deviceLibraryIdentifier } = req.params;

            // Récupère tous les passes associés à ce device
            const updatedSerial = getUpdatedPassesForDevice(deviceLibraryIdentifier);

            if (updatedSerial.length === 0) {
                return res.status(204).send(); // Pas de mise à jour
            }

            for (const serial of updatedSerial) {
                delete updatedPasses[serial as any];
            }

            console.log({
                lastUpdated: new Date().toISOString(),
                serialNumbers: updatedSerial, // <- très important
            });

            res.status(200).json({
                lastUpdated: new Date().toISOString(),
                serialNumbers: updatedSerial, // <- très important
            });
        },
    );

    // Envoyer le pass .pkpass
    app.get(
        "/v1/passes/:passTypeIdentifier/:serialNumber",
        authenticate,
        (req, res) => {
            console.log("Sending pass");
            const { serialNumber } = req.params;

            const pkpassPath = path.resolve("pkpass", `${serialNumber}.pkpass`);

            if (!fs.existsSync(pkpassPath)) {
                return res.status(404).send("Pass not found");
            }

            res.set({
                "Content-Type": "application/vnd.apple.pkpass",
                "Content-Disposition": `attachment; filename=${serialNumber}.pkpass`,
            });
            fs.createReadStream(pkpassPath).pipe(res);
        },
    );

    app.get("/update/:serialNumber", async (req, res) => {
        const serialNumber = req.params.serialNumber;
        const authToken = passes[serialNumber];
        passGenerator.generate({
            serialNumber,
            icon: "icon.png",
            authToken,
            title: "Updated Title",
        });
        const devices = registrations[serialNumber];
        if (devices) {
            for (const deviceLibraryIdentifier in devices) {
                const pushToken = devices[deviceLibraryIdentifier];
                await pushNotification.send(pushToken);
            }
            console.log(`Notified ${Object.keys(devices).length} device(s).`);
        }
        markPassAsUpdated(serialNumber);
        return res.status(200).send();
    });

    app.get("/create", (_, res) => {
        const serialNumber = crypto.randomUUID();
        const authToken = crypto.randomUUID();
        passGenerator.generate({
            serialNumber,
            icon: "icon.png",
            authToken,
            title: "ShareToEat",
        });

        passes[serialNumber] = authToken;
        return res.status(200).send(serialNumber);
    });

    // Démarrer le serveur
    app.listen(port, () => {
        console.log(`PassKit server running at http://localhost:${port}`);
    });

    function getUpdatedPassesForDevice(
        deviceLibraryIdentifier: string,
    ): string[] {
        const serials: string[] = [];

        for (const serialNumber in updatedPasses) {
            if (!updatedPasses[serialNumber]) continue;

            const devices = registrations[serialNumber];
            if (devices && deviceLibraryIdentifier in devices) {
                serials.push(serialNumber);
            }
        }

        return serials;
    }

    function markPassAsUpdated(serialNumber: string) {
        updatedPasses[serialNumber] = true;
    }
};
*/
