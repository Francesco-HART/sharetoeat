import { IDGenerator } from "./id-generator";

export class DeterministicIDGenerator implements IDGenerator {
  constructor(public id: string) {}

  generate() {
    return this.id;
  }
}
