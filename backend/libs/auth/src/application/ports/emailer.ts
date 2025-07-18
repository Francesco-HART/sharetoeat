export type SendAuthOTPProps = {
  email: string
  code: string
}

export abstract class Emailer {
  abstract sendAuthOTP(props: SendAuthOTPProps): Promise<void>
}
