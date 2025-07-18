import {
  UpdateUserCommand,
  UpdateUserHandler,
} from '@app/auth/application/commands/update-user'
import { FakeUserRepository } from '@app/auth/infrastructure/adapters/repositories/user/fake-user.repository'
import { UserBuilder } from '../builders/user.builder'
import { User } from '@app/auth/domain/entities/user'
import { err, ok } from 'neverthrow'
import { UserNotFoundError } from '@app/auth/application/errors/user.errors'
import { NullTransformationPerformer } from '@app/core/infrastructure/adapters/transaction-performer/null-transaction-performer'

class SUT {
  private userRepository = new FakeUserRepository()
  private transactionPerformer = new NullTransformationPerformer()

  withUser(user: User) {
    this.userRepository.insert(user)
    return this
  }

  updateUser(props: UpdateUserCommand['props']) {
    return new UpdateUserHandler(
      this.userRepository,
      this.transactionPerformer,
    ).execute(new UpdateUserCommand(props))
  }

  getUsers() {
    return this.userRepository.getAll()
  }

  getOutboxEvents() {
    return this.userRepository.getOutboxEvents()
  }
}
describe('Feature: Update User', () => {
  describe('Scenario: User exist', () => {
    test('Ok is returned', async () => {
      const userBuilder = new UserBuilder()
        .withId('12345')
        .withName('John Doe')
        .withAvatar('https://avatar.com/john-doe')

      const sut = new SUT().withUser(userBuilder.build())

      const result = await sut.updateUser({
        id: '12345',
        name: 'Lee Sin',
        avatarUrl: 'https://avatar.com/lee-sin',
      })

      expect(result).toEqual(ok(undefined))
    })

    test('User is updated', async () => {
      const userBuilder = new UserBuilder()
        .withId('12345')
        .withName('John Doe')
        .withAvatar('https://avatar.com/john-doe')

      const sut = new SUT().withUser(userBuilder.build())

      await sut.updateUser({
        id: '12345',
        name: 'Lee Sin',
        avatarUrl: 'https://avatar.com/lee-sin',
      })

      expect(sut.getUsers()).toEqual([
        userBuilder
          .withName('Lee Sin')
          .withAvatar('https://avatar.com/lee-sin')
          .build(),
      ])
    })

    test('Only name is updated', async () => {
      const userBuilder = new UserBuilder()
        .withId('12345')
        .withName('John Doe')
        .withAvatar('https://avatar.com/john-doe')

      const sut = new SUT().withUser(userBuilder.build())

      await sut.updateUser({
        id: '12345',
        name: 'Lee Sin',
      })

      expect(sut.getUsers()).toEqual([
        userBuilder
          .withName('Lee Sin')
          .withAvatar('https://avatar.com/john-doe')
          .build(),
      ])
    })

    test('Only avatarUrl is updated', async () => {
      const userBuilder = new UserBuilder()
        .withId('12345')
        .withName('John Doe')
        .withAvatar('https://avatar.com/john-doe')

      const sut = new SUT().withUser(userBuilder.build())

      await sut.updateUser({
        id: '12345',
        avatarUrl: 'https://avatar.com/lee-sin',
      })

      expect(sut.getUsers()).toEqual([
        userBuilder.withAvatar('https://avatar.com/lee-sin').build(),
      ])
    })

    test('User updated event is emitted', async () => {
      const userBuilder = new UserBuilder()
        .withId('12345')
        .withName('John Doe')
        .withAvatar('https://avatar.com/john-doe')

      const sut = new SUT().withUser(userBuilder.build())

      await sut.updateUser({
        id: '12345',
        name: 'Lee Sin',
        avatarUrl: 'https://avatar.com/lee-sin',
      })

      expect(sut.getOutboxEvents()).toEqual([
        {
          name: 'user.updated',
          payload: {
            id: '12345',
            name: 'Lee Sin',
            avatarUrl: 'https://avatar.com/lee-sin',
          },
        },
      ])
    })
  })

  describe('Scenario: User does not exist', () => {
    test('Error is thrown', async () => {
      const sut = new SUT()

      const result = await sut.updateUser({
        id: '12345',
        name: 'Lee Sin',
      })

      expect(result).toEqual(err(new UserNotFoundError()))
    })
  })
})
