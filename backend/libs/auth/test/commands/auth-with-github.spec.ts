import { FakeUserRepository } from '@app/auth/infrastructure/adapters/repositories/user/fake-user.repository'
import { UserBuilder } from '../builders/user.builder'
import { DeterministicIDGenerator } from '@app/core/domain/providers/id-generator/deterministic-id-generator'
import { DeterministicClock } from '@app/core/domain/providers/clock/deterministic-clock'
import { User } from '@app/auth/domain/entities/user'
import {
  AuthWithGithubCommand,
  AuthWithGithubHandler,
} from '@app/auth/application/commands/auth-with-github'
import { ok } from 'neverthrow'
import { FakeJwtGenerator } from '@app/auth/infrastructure/adapters/jwt-generator/fake-jwt-generator'
import { FakeGithubGateway } from '@app/auth/infrastructure/adapters/github/fake-github.gateway'
import { GithubUser } from '@app/auth/application/ports/github.gateway'
import { NullTransformationPerformer } from '@app/core/infrastructure/adapters/transaction-performer/null-transaction-performer'

class SUT {
  private clock = new DeterministicClock(new Date('2025-01-01T00:00:00.000Z'))
  private idGenerator = new DeterministicIDGenerator('uuid')
  private userRepository = new FakeUserRepository()
  private jwtGenerator = new FakeJwtGenerator()
  private githubGateway = new FakeGithubGateway()
  private transactionPerformer = new NullTransformationPerformer()

  withUser(user: User) {
    this.userRepository.insert(user)
    return this
  }

  withNow(date: Date) {
    this.clock = new DeterministicClock(date)
    return this
  }

  withId(id: string) {
    this.idGenerator = new DeterministicIDGenerator(id)
    return this
  }

  withRefreshToken(id: string, token: string) {
    this.jwtGenerator.addRefreshToken(id, token)
    return this
  }

  withAccessToken(id: string, token: string) {
    this.jwtGenerator.addAccessToken(id, token)
    return this
  }

  withGithubUser(code: string, user: GithubUser) {
    this.githubGateway.withUser(code, user)
    return this
  }

  authWithGitHub(code: string) {
    return new AuthWithGithubHandler(
      this.clock,
      this.idGenerator,
      this.userRepository,
      this.jwtGenerator,
      this.githubGateway,
      this.transactionPerformer,
    ).execute(new AuthWithGithubCommand(code))
  }

  getUsers() {
    return this.userRepository.getAll()
  }

  getOutboxEvents() {
    return this.userRepository.getOutboxEvents()
  }
}

describe('Feature: Auth with GitHub', () => {
  describe('Scenario: User already exists', () => {
    test('Tokens are created', async () => {
      const user = new UserBuilder()
        .withId('user-id-1')
        .withEmail('john.doe@email.com')
        .build()

      const sut = new SUT()
        .withUser(user)
        .withGithubUser('123456', {
          name: 'John Doe',
          email: 'john.doe@email.com',
          avatarUrl: 'https://avatar.com',
        })
        .withAccessToken('user-id-1', 'access-token')
        .withRefreshToken('user-id-1', 'refresh-token')

      const result = await sut.authWithGitHub('123456')

      expect(result).toEqual(
        ok({
          tokens: {
            access: 'access-token',
            refresh: 'refresh-token',
          },
        }),
      )
    })

    describe('Scenario: User does not exist', () => {
      test('User are created', async () => {
        const sut = new SUT()
          .withGithubUser('123456', {
            name: 'John Doe',
            email: 'john.doe@email.com',
            avatarUrl: 'https://avatar.com',
          })
          .withId('user-id-1')
          .withNow(new Date('2025-01-01T00:00:00.000Z'))

        await sut.authWithGitHub('123456')

        expect(sut.getUsers()).toEqual([
          new UserBuilder()
            .withId('user-id-1')
            .withEmail('john.doe@email.com')
            .withName('John Doe')
            .withAvatar('https://avatar.com')
            .registerAt(new Date('2025-01-01T00:00:00.000Z'))
            .build(),
        ])
      })

      test('User created event are emitted', async () => {
        const sut = new SUT()
          .withGithubUser('123456', {
            name: 'John Doe',
            email: 'john.doe@email.com',
            avatarUrl: 'https://avatar.com',
          })
          .withId('user-id-1')
          .withNow(new Date('2025-01-01T00:00:00.000Z'))

        await sut.authWithGitHub('123456')

        expect(sut.getOutboxEvents()).toEqual([
          {
            name: 'user.created',
            payload: {
              id: 'user-id-1',
              email: 'john.doe@email.com',
              name: 'John Doe',
              avatarUrl: 'https://avatar.com',
            },
          },
        ])
      })
    })
  })
})
