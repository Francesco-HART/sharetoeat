import { AuthTokensGenerator } from "./AuthTokensGenerator";
import * as crypto from "node:crypto";

export class UUIDAuthTokenGenerator implements AuthTokensGenerator {
    generate(): string {
        return crypto.randomUUID();
    }
}
