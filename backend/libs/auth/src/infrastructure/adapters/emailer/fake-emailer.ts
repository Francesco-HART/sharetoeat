import { Emailer, SendAuthOTPProps } from '@app/auth/application/ports/emailer'

export class FakeEmailer extends Emailer {
  lastAuthOTPSend: SendAuthOTPProps | null = null
  async sendAuthOTP(props: SendAuthOTPProps): Promise<void> {
    this.lastAuthOTPSend = props
  }
}
