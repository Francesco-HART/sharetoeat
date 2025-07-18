import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { UserViewModel } from '../view-models/user.view-model'
import { Knex } from 'knex'
import { UserPm } from '@app/core/infrastructure/database-configuration/persistent-models/auth/user.pm'
import { Inject } from '@nestjs/common'
import { err, ok, Result } from 'neverthrow'
import { UserNotFoundError } from '../errors/user.errors'

export class GetUserQuery implements IQuery {
  constructor(public id: string) {}
}

export type GetUserQueryResult = Result<UserViewModel, UserNotFoundError>

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler
  implements IQueryHandler<GetUserQuery, GetUserQueryResult>
{
  constructor(@Inject('Knex') private readonly knex: Knex) {}

  async execute(query: GetUserQuery): Promise<GetUserQueryResult> {
    const user = await this.knex
      .withSchema('auth')
      .from<UserPm>('users')
      .select('email', 'name', 'avatar_url as avatarUrl')
      .where('id', query.id)
      .first()

    if (!user) {
      return err(new UserNotFoundError())
    }

    return ok(user)
  }
}
