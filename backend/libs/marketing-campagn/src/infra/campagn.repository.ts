import { Campagn } from "../domain/campagn";

export abstract class CampagnRepository {
  abstract create(campagn: Campagn): Promise<void>;
}
