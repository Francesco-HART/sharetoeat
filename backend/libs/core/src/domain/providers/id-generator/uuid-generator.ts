import { IDGenerator } from './id-generator'
import { uuidv7 } from 'uuidv7'

export class UUIDGenerator implements IDGenerator {
  generate(): string {
    return uuidv7()
  }
}
