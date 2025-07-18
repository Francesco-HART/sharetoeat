import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UserRepository } from '../ports/repositories/user.repository'
import { err, ok, Result } from 'neverthrow'
import { UserNotFoundError } from '../errors/user.errors'
import { TransactionPerformer } from '@app/core/application/ports/transaction-performer'

type UpdateUserProps = {
  id: string
  name?: string
  avatarUrl?: string
}

export class UpdateUserCommand {
  constructor(public readonly props: UpdateUserProps) {}
}

export type UpdateUserResult = Result<void, Error>

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly transactionPerformer: TransactionPerformer,
  ) {}

  async execute(command: UpdateUserCommand) {
    return await this.transactionPerformer.perform(async (trx) => {
      const user = await this.userRepository.findById(command.props.id)

      if (!user) {
        return err(new UserNotFoundError())
      }

      user.update({
        name: command.props.name,
        avatarUrl: command.props.avatarUrl,
      })

      await this.userRepository.save(user)(trx)
      return ok(undefined)
    })
  }
}
