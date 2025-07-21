import { Campagn } from "../domain/campagn";
import { CampagnRepository } from "./campagn.repository";

export class InMemoryCampagnRepository implements CampagnRepository {
  campagns = new Map<string, Campagn>();
  async create(campagn: Campagn) {
    this.campagns.set(campagn.id, campagn);
  }

  getOneCampagn(id: string) {
    return this.campagns.get(id);
  }
}
