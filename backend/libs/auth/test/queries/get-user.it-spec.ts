import { UserNotFoundError } from '@app/auth/application/errors/user.errors'
import { GetUserQueryHandler } from '@app/auth/application/queries/get-user'
import { UserPm } from '@app/core/infrastructure/database-configuration/persistent-models/auth/user.pm'
import { setupDatabase } from '@test/setup-database'
import { err, ok } from 'neverthrow'

describe('Feature: Get User', () => {
  const { getKnex } = setupDatabase()

  describe('User exists', () => {
    it('retrieve user infos', async () => {
      await insertUser({
        id: '67b6573c-45b4-8001-a09a-baaf3b570e5c',
        email: 'john.doe@email.com',
        name: 'John Doe',
        avatar_url: 'https://avatar.com/john-doe',
        register_at: new Date('2025-02-20T00:00:00.000Z'),
      })

      const user = await new GetUserQueryHandler(getKnex()).execute({
        id: '67b6573c-45b4-8001-a09a-baaf3b570e5c',
      })

      expect(user).toEqual(
        ok({
          email: 'john.doe@email.com',
          name: 'John Doe',
          avatarUrl: 'https://avatar.com/john-doe',
        }),
      )
    })

    it('user not found', async () => {
      const user = await new GetUserQueryHandler(getKnex()).execute({
        id: '67b6573c-45b4-8001-a09a-baaf3b570e5c',
      })

      expect(user).toEqual(err(new UserNotFoundError()))
    })
  })

  const insertUser = async (user: UserPm) => {
    await getKnex().withSchema('auth').insert(user).into('users')
  }
})
