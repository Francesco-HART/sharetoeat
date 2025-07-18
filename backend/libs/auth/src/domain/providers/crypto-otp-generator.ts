import * as crypto from 'node:crypto'
import { OTPGenerator } from './otp-generator'

export class CryptoOTPGenerator implements OTPGenerator {
  generate(): string {
    return crypto.randomInt(100000, 1000000).toString()
  }
}
