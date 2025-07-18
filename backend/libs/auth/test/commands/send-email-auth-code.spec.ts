import {
  SendEmailAuthCodeCommand,
  SendEmailAuthCodeHandler,
} from '@app/auth/application/commands/send-email-auth-code'
import { FakeEmailer } from '@app/auth/infrastructure/adapters/emailer/fake-emailer'

describe('Feature: Send Email Auth Code', () => {
  test('Email with code is send to right email address', async () => {
    const emailSender = new FakeEmailer()

    await new SendEmailAuthCodeHandler(emailSender).execute(
      new SendEmailAuthCodeCommand({
        email: 'john.doe@email.com',
        code: '123456',
      }),
    )

    expect(emailSender.lastAuthOTPSend).toEqual({
      email: 'john.doe@email.com',
      code: '123456',
    })
  })
})
