import { IDGenerator } from "./id-generator";

export class FakeSequentialIDGenerator implements IDGenerator {
  public ids: string[];
  private index = 0;

  constructor(...ids: string[]) {
    this.ids = ids;
  }

  generate(): string {
    if (this.index >= this.ids.length) {
      throw new Error("No more fake IDs available");
    }
    return this.ids[this.index++];
  }
}
