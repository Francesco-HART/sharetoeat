import {
  AuthWithEmailCommand,
  AuthWithEmailHandler,
} from '@app/auth/application/commands/auth-with-email'
import { EmailAuthRequestBuilder } from '../builders/email-auth-request.builder'
import { UserBuilder } from '../builders/user.builder'
import { DeterministicClock } from '@app/core/domain/providers/clock/deterministic-clock'
import { FakeUserRepository } from '@app/auth/infrastructure/adapters/repositories/user/fake-user.repository'
import { FakeEmailAuthRequestRepository } from '@app/auth/infrastructure/adapters/repositories/email-auth-request/fake-email-auth-request.repository'
import { DeterministicIDGenerator } from '@app/core/domain/providers/id-generator/deterministic-id-generator'
import { User } from '@app/auth/domain/entities/user'
import { EmailAuthRequest } from '@app/auth/domain/entities/email-auth-request'
import { FakeJwtGenerator } from '@app/auth/infrastructure/adapters/jwt-generator/fake-jwt-generator'
import { err, ok } from 'neverthrow'
import {
  EmailAuthRequestAlreadyUsedError,
  EmailAuthRequestExpiredError,
  EmailAuthRequestInvalidCodeError,
} from '@app/auth/domain/errors/email-auth-requests.errors'
import { EmailAuthRequestNotFoundError } from '@app/auth/application/errors/auth-email-request.errors'
import { NullTransformationPerformer } from '@app/core/infrastructure/adapters/transaction-performer/null-transaction-performer'

class SUT {
  private clock = new DeterministicClock(new Date('2025-01-01T00:00:00.000Z'))
  private idGenerator = new DeterministicIDGenerator('uuid')
  private emailAuthRequestRepository = new FakeEmailAuthRequestRepository()
  private userRepository = new FakeUserRepository()
  private jwtProvider = new FakeJwtGenerator()
  private transactionPerformer = new NullTransformationPerformer()

  withNow(date: Date) {
    this.clock = new DeterministicClock(date)
    return this
  }

  withUUID(id: string) {
    this.idGenerator = new DeterministicIDGenerator(id)
    return this
  }

  withUser(user: User) {
    this.userRepository.insert(user)
    return this
  }

  withRefreshToken(id: string, token: string) {
    this.jwtProvider.addRefreshToken(id, token)
    return this
  }

  withAccessToken(id: string, token: string) {
    this.jwtProvider.addAccessToken(id, token)
    return this
  }

  withEmailAuthRequest(emailAuthRequest: EmailAuthRequest) {
    this.emailAuthRequestRepository.insert(emailAuthRequest)
    return this
  }

  async authWithEmail(props: AuthWithEmailCommand['props']) {
    return await new AuthWithEmailHandler(
      this.emailAuthRequestRepository,
      this.userRepository,
      this.clock,
      this.idGenerator,
      this.jwtProvider,
      this.transactionPerformer,
    ).execute(new AuthWithEmailCommand(props))
  }

  getUsers() {
    return this.userRepository.getAll()
  }

  getRequests() {
    return this.emailAuthRequestRepository.getAll()
  }

  getOutboxEvents() {
    return this.userRepository.getOutboxEvents()
  }
}

describe('Feature: Auth with email', () => {
  const request = new EmailAuthRequestBuilder()
    .withId('1234')
    .withCode('123456')
    .withEmail('john.doe@email.com')
    .expiresAt(new Date('2025-01-01T00:10:00.000Z'))
    .build()

  describe('Scenario: Code is valid', () => {
    test('Request is used', async () => {
      const requestBuilder = new EmailAuthRequestBuilder()
        .withId('1234')
        .withCode('123456')
        .expiresAt(new Date('2025-01-01T00:10:00.000Z'))
        .unUsed()
        .withEmail('john.doe@email.com')

      const sut = new SUT()
        .withEmailAuthRequest(requestBuilder.build())
        .withNow(new Date('2025-01-01T00:00:00.000Z'))
        .withUUID('user-id-1')

      await sut.authWithEmail({
        requestId: '1234',
        code: '123456',
      })

      expect(sut.getRequests()).toEqual([requestBuilder.used().build()])
    })

    describe('User is already registered', () => {
      test('Tokens are created', async () => {
        const user = new UserBuilder()
          .withId('user-id-1')
          .withEmail('john.doe@email.com')
          .build()
        const sut = new SUT()
          .withEmailAuthRequest(request)
          .withNow(new Date('2025-01-01T00:00:00.000Z'))
          .withUser(user)
          .withRefreshToken('user-id-1', 'refresh-token')
          .withAccessToken('user-id-1', 'access-token')

        const tokens = await sut.authWithEmail({
          requestId: '1234',
          code: '123456',
        })

        expect(tokens).toEqual(
          ok({
            tokens: {
              access: 'access-token',
              refresh: 'refresh-token',
            },
          }),
        )
      })

      test('A user is not created', async () => {
        const user = new UserBuilder().withEmail('john.doe@email.com').build()

        const sut = new SUT()
          .withEmailAuthRequest(request)
          .withNow(new Date('2025-01-01T00:00:00.000Z'))
          .withUser(user)

        await sut.authWithEmail({
          requestId: '1234',
          code: '123456',
        })

        expect(sut.getUsers()).toEqual([user])
      })
    })

    describe('User is not registered', () => {
      test('Tokens are created', async () => {
        const sut = new SUT()
          .withEmailAuthRequest(request)
          .withUUID('user-id-1')
          .withNow(new Date('2025-01-01T00:00:00.000Z'))
          .withRefreshToken('user-id-1', 'refresh-token')
          .withAccessToken('user-id-1', 'access-token')

        const tokens = await sut.authWithEmail({
          requestId: '1234',
          code: '123456',
        })

        expect(tokens).toEqual(
          ok({
            tokens: {
              access: 'access-token',
              refresh: 'refresh-token',
            },
          }),
        )
      })
      test('A user is created', async () => {
        const sut = new SUT()
          .withEmailAuthRequest(request)
          .withNow(new Date('2025-01-01T00:00:00.000Z'))
          .withUUID('user-id-1')

        await sut.authWithEmail({
          requestId: '1234',
          code: '123456',
        })

        expect(sut.getOutboxEvents()).toEqual([
          {
            name: 'user.created',
            payload: {
              id: 'user-id-1',
              email: 'john.doe@email.com',
            },
          },
        ])
      })
    })
  })

  describe('Scenario: Code is invalid', () => {
    test('Error is thrown', async () => {
      const request = new EmailAuthRequestBuilder()
        .withId('1234')
        .withCode('123456')
        .withEmail('john.doe@email.com')
        .expiresAt(new Date('2025-01-01T00:10:00.000Z'))
        .build()

      const sut = new SUT()
        .withEmailAuthRequest(request)
        .withNow(new Date('2025-01-01T00:00:00.000Z'))
        .withUUID('user-id-1')

      const result = await sut.authWithEmail({
        requestId: '1234',
        code: '987654',
      })

      expect(result).toEqual(err(new EmailAuthRequestInvalidCodeError()))
    })
  })

  describe('Scenario: Request is expired', () => {
    test('Error is thrown', async () => {
      const request = new EmailAuthRequestBuilder()
        .withId('1234')
        .withCode('123456')
        .withEmail('john.doe@email.com')
        .expiresAt(new Date('2025-01-01T00:00:00.000Z'))
        .build()

      const sut = new SUT()
        .withEmailAuthRequest(request)
        .withNow(new Date('2025-01-01T00:00:00.000Z'))
        .withUUID('user-id-1')

      const result = await sut.authWithEmail({
        requestId: '1234',
        code: '123456',
      })

      expect(result).toEqual(err(new EmailAuthRequestExpiredError()))
    })
  })

  describe('Scenario: Request already used', () => {
    test('Error is thrown', async () => {
      const request = new EmailAuthRequestBuilder()
        .withId('1234')
        .withCode('123456')
        .withEmail('john.doe@email.com')
        .expiresAt(new Date('2025-01-01T00:10:00.000Z'))
        .used()
        .build()

      const sut = new SUT()
        .withEmailAuthRequest(request)
        .withNow(new Date('2025-01-01T00:00:00.000Z'))
        .withUUID('user-id-1')

      const result = await sut.authWithEmail({
        requestId: '1234',
        code: '123456',
      })

      expect(result).toEqual(err(new EmailAuthRequestAlreadyUsedError()))
    })
  })

  describe('Scenario: Request not found', () => {
    test('Error is thrown', async () => {
      const sut = new SUT()

      const result = await sut.authWithEmail({
        requestId: '1234',
        code: '123456',
      })
      expect(result).toEqual(err(new EmailAuthRequestNotFoundError()))
    })
  })
})
