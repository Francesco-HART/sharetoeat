import {
  RequestAuthWithEmailHandler,
  RequestAuthWithEmailCommand,
} from '@app/auth/application/commands/request-auth-with-email'
import { EmailAuthRequestBuilder } from '../builders/email-auth-request.builder'
import { DeterministicIDGenerator } from '@app/core/domain/providers/id-generator/deterministic-id-generator'
import { DeterministicClock } from '@app/core/domain/providers/clock/deterministic-clock'
import { FakeEmailAuthRequestRepository } from '@app/auth/infrastructure/adapters/repositories/email-auth-request/fake-email-auth-request.repository'
import { DeterministicOTPGenerator } from '@app/auth/domain/providers/deterministic-otp-generator'
import { ok } from 'neverthrow'
import { NullTransformationPerformer } from '@app/core/infrastructure/adapters/transaction-performer/null-transaction-performer'

class SUT {
  private clock = new DeterministicClock(new Date('2025-01-01'))
  private idGenerator = new DeterministicIDGenerator('uuid')
  private otpGenerator = new DeterministicOTPGenerator('otp')
  private emailAuthRequestRepository = new FakeEmailAuthRequestRepository()
  private transactionPerformer = new NullTransformationPerformer()

  withDate(date: Date) {
    this.clock = new DeterministicClock(date)
    return this
  }

  withUUID(uuid: string) {
    this.idGenerator = new DeterministicIDGenerator(uuid)
    return this
  }

  withOTP(otp: string) {
    this.otpGenerator = new DeterministicOTPGenerator(otp)
    return this
  }

  requestAuthWithEmail(props: RequestAuthWithEmailCommand['props']) {
    return new RequestAuthWithEmailHandler(
      this.clock,
      this.idGenerator,
      this.otpGenerator,
      this.emailAuthRequestRepository,
      this.transactionPerformer,
    ).execute(new RequestAuthWithEmailCommand(props))
  }

  getAuthRequests() {
    return this.emailAuthRequestRepository.getAll()
  }

  getOutboxEvents() {
    return this.emailAuthRequestRepository.getOutboxEvents()
  }
}

describe('Feature: Request Auth With Email', () => {
  test('Request is created', async () => {
    const sut = new SUT()
      .withDate(new Date('2025-01-01T00:00:00'))
      .withUUID('uuid')
      .withOTP('otp')

    await sut.requestAuthWithEmail({ email: 'john.doe@email.com' })

    expect(sut.getAuthRequests()).toEqual([
      new EmailAuthRequestBuilder()
        .withId('uuid')
        .withEmail('john.doe@email.com')
        .withCode('otp')
        .expiresAt(new Date('2025-01-01T00:10:00'))
        .unUsed()
        .build(),
    ])
  })

  test('Created event is emitted', async () => {
    const sut = new SUT()
      .withDate(new Date('2025-01-01T00:00:00'))
      .withUUID('uuid')
      .withOTP('otp')

    await sut.requestAuthWithEmail({ email: 'john.doe@email.com' })

    expect(sut.getOutboxEvents()).toEqual([
      {
        name: 'email-auth-request.created',
        payload: {
          id: 'uuid',
          email: 'john.doe@email.com',
          code: 'otp',
        },
      },
    ])
  })

  test('Id is retrieve from creation', async () => {
    const sut = new SUT()
      .withDate(new Date('2025-01-01T00:00:00'))
      .withUUID('uuid')
      .withOTP('otp')

    const result = await sut.requestAuthWithEmail({
      email: 'john.doe@email.com',
    })

    expect(result).toEqual(
      ok({
        id: 'uuid',
      }),
    )
  })
})
