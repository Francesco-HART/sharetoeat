import { Clock } from '@app/core/domain/providers/clock/clock'
import { IDGenerator } from '@app/core/domain/providers/id-generator/id-generator'
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { ok, Result } from 'neverthrow'
import { UserRepository } from '../ports/repositories/user.repository'
import { JwtGenerator } from '../ports/jwt-generator'
import { GithubGateway } from '../ports/github.gateway'
import { User } from '@app/auth/domain/entities/user'
import { TransactionPerformer } from '@app/core/application/ports/transaction-performer'

export class AuthWithGithubCommand implements ICommand {
  constructor(public readonly code: string) {}
}

export type AuthWithGithubResult = Result<
  { tokens: { access: string; refresh: string } },
  Error
>

@CommandHandler(AuthWithGithubCommand)
export class AuthWithGithubHandler
  implements ICommandHandler<AuthWithGithubCommand>
{
  constructor(
    private readonly clock: Clock,
    private readonly idGenerator: IDGenerator,
    private readonly usersRepository: UserRepository,
    private readonly jwtGenerator: JwtGenerator,
    private readonly githubGateway: GithubGateway,
    private readonly transactionPerformer: TransactionPerformer,
  ) {}

  async execute(command: AuthWithGithubCommand): Promise<AuthWithGithubResult> {
    const githubUser = await this.githubGateway.getUser(command.code)

    return this.transactionPerformer.perform(async (trx) => {
      let user = await this.usersRepository.findByEmail(githubUser.email)

      if (!user) {
        user = User.create({
          id: this.idGenerator.generate(),
          email: githubUser.email,
          name: githubUser.name,
          avatarUrl: githubUser.avatarUrl,
          currentDate: this.clock.now(),
        })
        await this.usersRepository.save(user)(trx)
      }

      return ok({
        tokens: {
          access: this.jwtGenerator.generateAccess(user!.id),
          refresh: this.jwtGenerator.generateRefresh(user!.id),
        },
      })
    })
  }
}
