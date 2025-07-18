import { OTPGenerator } from '@app/auth/domain/providers/otp-generator'
import { Clock } from '@app/core/domain/providers/clock/clock'
import { IDGenerator } from '@app/core/domain/providers/id-generator/id-generator'
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { EmailAuthRequestRepository } from '../ports/repositories/email-auth-request.repository'
import { EmailAuthRequest } from '@app/auth/domain/entities/email-auth-request'
import { ok, Result } from 'neverthrow'
import { TransactionPerformer } from '@app/core/application/ports/transaction-performer'

type RequestAuthWithEmailProps = {
  email: string
}

export class RequestAuthWithEmailCommand implements ICommand {
  constructor(public readonly props: RequestAuthWithEmailProps) {}
}

export type RequestAuthWithEmailResult = Result<{ id: string }, never>

@CommandHandler(RequestAuthWithEmailCommand)
export class RequestAuthWithEmailHandler
  implements ICommandHandler<RequestAuthWithEmailCommand>
{
  constructor(
    private clock: Clock,
    private idGenerator: IDGenerator,
    private otpGenerator: OTPGenerator,
    private emailAuthRequestRepository: EmailAuthRequestRepository,
    private transactionPerformer: TransactionPerformer,
  ) {}

  execute(command: RequestAuthWithEmailCommand) {
    return this.transactionPerformer.perform(async (trx) => {
      const { email } = command.props

      const request = EmailAuthRequest.create({
        id: this.idGenerator.generate(),
        email,
        code: this.otpGenerator.generate(),
        currentDate: this.clock.now(),
      })

      await this.emailAuthRequestRepository.save(request)(trx)

      return ok({
        id: request.id,
      })
    })
  }
}
