import { IDGenerator } from './id-generator'

export class DeterministicIDGenerator implements IDGenerator {
  constructor(private id: string) {}

  generate() {
    return this.id
  }
}
