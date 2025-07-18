import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { Emailer } from '../ports/emailer'

type SendEmailAuthCodeProps = {
  email: string
  code: string
}

export class SendEmailAuthCodeCommand implements ICommand {
  constructor(public readonly props: SendEmailAuthCodeProps) {}
}

@CommandHandler(SendEmailAuthCodeCommand)
export class SendEmailAuthCodeHandler
  implements ICommandHandler<SendEmailAuthCodeCommand>
{
  constructor(private readonly emailer: Emailer) {}

  async execute(command: SendEmailAuthCodeCommand) {
    await this.emailer.sendAuthOTP(command.props)
  }
}
