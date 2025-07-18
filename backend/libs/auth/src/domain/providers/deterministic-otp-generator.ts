import { OTPGenerator } from './otp-generator'

export class DeterministicOTPGenerator implements OTPGenerator {
  constructor(private otp: string) {}

  generate() {
    return this.otp
  }
}
