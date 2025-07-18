import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { JwtGenerator } from '../ports/jwt-generator'
import { ok, Result } from 'neverthrow'

export class RefreshTokensCommand implements ICommand {
  constructor(readonly refreshToken: string) {}
}

export type RefreshTokensResult = Result<{ access: string }, Error>

@CommandHandler(RefreshTokensCommand)
export class RefreshTokensHandler
  implements ICommandHandler<RefreshTokensCommand>
{
  constructor(private jwtGenerator: JwtGenerator) {}

  async execute(command: RefreshTokensCommand) {
    const result = this.jwtGenerator.refresh(command.refreshToken)

    if (result.isErr()) {
      return result
    }

    return ok({
      access: result.value,
    })
  }
}
