import { User } from '@app/auth/domain/entities/user'
import { KnexUserRepository } from '@app/auth/infrastructure/adapters/repositories/user/knex-user.repository'
import { UserPm } from '@app/core/infrastructure/database-configuration/persistent-models/auth/user.pm'
import { setupDatabase } from '@test/setup-database'
import { Knex } from 'knex'
import { UserBuilder } from '../../builders/user.builder'
import { KnexTransactionPerformer } from '@app/core/infrastructure/adapters/transaction-performer/knex-transaction-performer'

class SUT {
  constructor(private readonly knex: Knex) {}

  async findById(id: string) {
    return new KnexUserRepository(this.knex).findById(id)
  }

  findByEmail(email: string) {
    return new KnexUserRepository(this.knex).findByEmail(email)
  }

  save(user: User) {
    return new KnexTransactionPerformer(this.knex).perform(
      new KnexUserRepository(this.knex).save(user),
    )
  }

  async insertUser(user: User) {
    const { id, email, name, avatarUrl, registerAt } = user.snapshot
    await this.knex.withSchema('auth').from('users').insert<UserPm>({
      id,
      email,
      name,
      avatar_url: avatarUrl,
      register_at: registerAt,
    })
    return this
  }

  async getAllUsers() {
    const userPms = await this.knex.withSchema('auth').select('*').from('users')

    return userPms.map((u) =>
      User.fromSnapshot({
        id: u.id,
        email: u.email,
        name: u.name ?? undefined,
        avatarUrl: u.avatar_url ?? undefined,
        registerAt: u.register_at,
      }),
    )
  }
}

describe('KnexUserRepository', () => {
  const { getKnex } = setupDatabase()

  describe('findById', () => {
    it('retrieve user when exist', async () => {
      const user = new UserBuilder()
        .withId('6fd624d5-20eb-42c6-b4de-ad10be4a0477')
        .build()
      const sut = new SUT(getKnex())
      await sut.insertUser(user)

      const userFound = await sut.findById(user.id)

      expect(userFound).toEqual(user)
    })

    it('return null when user NOT exist', async () => {
      const sut = new SUT(getKnex())

      const userFound = await sut.findById(
        '6fd624d5-20eb-42c6-b4de-ad10be4a0477',
      )

      expect(userFound).toBeNull()
    })
  })

  describe('findByEmail', () => {
    it('retrieve user when exist', async () => {
      const user = new UserBuilder()
        .withId('6fd624d5-20eb-42c6-b4de-ad10be4a0477')
        .withEmail('john.doe@email.com')
        .build()

      const sut = new SUT(getKnex())
      await sut.insertUser(user)

      const userFound = await sut.findByEmail(user.snapshot.email)

      expect(userFound).toEqual(user)
    })

    it('return null when user NOT exist', async () => {
      const sut = new SUT(getKnex())

      const userFound = await sut.findByEmail('wrong@email.com')

      expect(userFound).toBeNull()
    })
  })

  describe('save', () => {
    it('create user when NOT in database', async () => {
      const user = new UserBuilder()
        .withId('6fd624d5-20eb-42c6-b4de-ad10be4a0477')
        .withName('John Doe')
        .withAvatar('http://avatar.com')
        .build()

      const sut = new SUT(getKnex())

      await sut.save(user)

      expect(await sut.getAllUsers()).toEqual([user])
    })
  })

  it('update user when in database', async () => {
    const userBuilder = new UserBuilder().withId(
      '6fd624d5-20eb-42c6-b4de-ad10be4a0477',
    )

    const sut = new SUT(getKnex())
    await sut.insertUser(userBuilder.build())

    const updatedUser = userBuilder.withName('Lee Sin').build()

    await sut.save(updatedUser)

    expect(await sut.getAllUsers()).toEqual([updatedUser])
  })
})
