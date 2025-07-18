import { setupDatabase } from '@test/setup-database'
import { EmailAuthRequestBuilder } from '../../builders/email-auth-request.builder'
import { EmailAuthRequest } from '@app/auth/domain/entities/email-auth-request'
import { KnexEmailAuthRequestRepository } from '@app/auth/infrastructure/adapters/repositories/email-auth-request/knex-email-auth-request.repository'
import { EmailAuthRequestPm } from '@app/core/infrastructure/database-configuration/persistent-models/auth/email-auth-request.pm'

describe('Knex Email Auth Request Repository', () => {
  const { getKnex } = setupDatabase()

  describe('save', () => {
    it('should save an email auth request', async () => {
      const emailAuthRequest = EmailAuthRequest.fromSnapshot({
        id: '67b6573c-45b4-8001-a09a-baaf3b570e5c',
        email: 'john.doe@email.com"',
        code: '123456',
        expiresAt: new Date('2025-02-20T00:00:00.000Z'),
        isUsed: false,
      })

      await getKnex().transaction(async (trx) => {
        await new KnexEmailAuthRequestRepository(getKnex()).save(
          emailAuthRequest,
        )(trx)
      })

      expect(await getAllEmailAuthRequests()).toEqual([
        {
          id: '67b6573c-45b4-8001-a09a-baaf3b570e5c',
          email: 'john.doe@email.com"',
          code: '123456',
          expires_at: new Date('2025-02-20T00:00:00.000Z'),
          is_used: false,
        },
      ])
    })

    it('should update an email auth request when exist', async () => {
      const requestBuilder = new EmailAuthRequestBuilder()
        .withId('67b6573c-45b4-8001-a09a-baaf3b570e5c')
        .withEmail('john.doe@email.com')
        .withCode('123456')
        .expiresAt(new Date('2025-02-20T00:00:00.000Z'))
        .unUsed()

      await insertEmailAuthRequest(requestBuilder.build())

      await getKnex().transaction(async (trx) => {
        await new KnexEmailAuthRequestRepository(getKnex()).save(
          requestBuilder.used().build(),
        )(trx)
      })

      expect(await getAllEmailAuthRequests()).toEqual([
        {
          id: '67b6573c-45b4-8001-a09a-baaf3b570e5c',
          email: 'john.doe@email.com',
          code: '123456',
          expires_at: new Date('2025-02-20T00:00:00.000Z'),
          is_used: true,
        },
      ])
    })
  })

  describe('findById', () => {
    it('Retrieve an email auth request by id', async () => {
      const request = new EmailAuthRequestBuilder()
        .withId('67b6573c-45b4-8001-a09a-baaf3b570e5c')
        .build()

      await insertEmailAuthRequest(request)

      const requestFound = await new KnexEmailAuthRequestRepository(
        getKnex(),
      ).findById(request.id)

      expect(requestFound).toEqual(request)
    })

    it('Return null if email auth request not found', async () => {
      const requestFound = await new KnexEmailAuthRequestRepository(
        getKnex(),
      ).findById('67b6573c-45b4-8001-a09a-baaf3b570e5c')

      expect(requestFound).toBeNull()
    })
  })

  const getAllEmailAuthRequests = async () => {
    return getKnex().withSchema('auth').select().from('email_auth_requests')
  }

  const insertEmailAuthRequest = async (emailAuthRequest: EmailAuthRequest) => {
    const knex = getKnex()
    const { id, email, code, expiresAt, isUsed } = emailAuthRequest.snapshot
    await knex
      .withSchema('auth')
      .insert<EmailAuthRequestPm>({
        id,
        email,
        code,
        expires_at: expiresAt,
        is_used: isUsed,
      })
      .into('email_auth_requests')
  }
})
