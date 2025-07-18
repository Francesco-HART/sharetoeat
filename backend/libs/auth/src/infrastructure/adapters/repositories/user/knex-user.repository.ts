import { UserRepository } from '@app/auth/application/ports/repositories/user.repository'
import { User } from '@app/auth/domain/entities/user'
import { BaseKnexRepository } from '../base-knex-repository'
import { UserPm } from '@app/core/infrastructure/database-configuration/persistent-models/auth/user.pm'
import { Knex } from 'knex'
import { TransactionableAsync } from '@app/core/application/ports/transaction-performer'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class KnexUserRepository
  extends BaseKnexRepository
  implements UserRepository
{
  constructor(@Inject('Knex') knex: Knex) {
    super(knex, 'auth')
  }

  async findById(id: string): Promise<User | null> {
    const userPm = await this.knex
      .withSchema(this.schema)
      .from('users')
      .select<UserPm>('*')
      .where('id', id)
      .first()

    if (!userPm) {
      return null
    }

    return User.fromSnapshot({
      id: userPm.id,
      email: userPm.email,
      name: userPm.name ?? undefined,
      avatarUrl: userPm.avatar_url ?? undefined,
      registerAt: userPm.register_at,
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    const userPm = await this.knex
      .withSchema(this.schema)
      .from('users')
      .select<UserPm>('*')
      .where('email', email)
      .first()

    if (!userPm) {
      return null
    }

    return User.fromSnapshot({
      id: userPm.id,
      email: userPm.email,
      name: userPm.name ?? undefined,
      avatarUrl: userPm.avatar_url ?? undefined,
      registerAt: userPm.register_at,
    })
  }

  save(entity: User): TransactionableAsync<void> {
    return async (trx: Knex.Transaction) => {
      const { id, name, email, registerAt, avatarUrl } = entity.snapshot

      await this.knex
        .withSchema(this.schema)
        .transacting(trx)
        .insert<UserPm>({
          id,
          name,
          email,
          register_at: registerAt,
          avatar_url: avatarUrl,
        })
        .into('users')
        .onConflict('id')
        .merge()

      await this.saveEvents(entity)(trx)
    }
  }
}
