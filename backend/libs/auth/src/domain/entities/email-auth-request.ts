import { err, ok } from 'neverthrow'
import { EmailAuthRequestCreatedEvent } from '../events/email-auth-request.events'
import { Time } from '../value-objects/time'
import {
  EmailAuthRequestAlreadyUsedError,
  EmailAuthRequestExpiredError,
  EmailAuthRequestInvalidCodeError,
} from '../errors/email-auth-requests.errors'
import { AggregateRoot } from '@app/core/domain/entities/aggregate-root'

type Props = {
  id: string
  email: string
  code: string
  expiresAt: Date
  isUsed: boolean
}

export type EmailAuthRequestSnapshot = EmailAuthRequest['snapshot']

type CreateProps = Omit<Props, 'isUsed' | 'expiresAt'> & {
  currentDate: Date
}

export class EmailAuthRequest extends AggregateRoot<Props> {
  get id() {
    return this.props.id
  }

  get email() {
    return this.props.email
  }

  get snapshot() {
    return {
      id: this.props.id,
      email: this.props.email,
      code: this.props.code,
      expiresAt: this.props.expiresAt,
      isUsed: this.props.isUsed,
    }
  }

  verify(code: string, currentDate: Date) {
    if (this.isCodeInvalid(code))
      return err(new EmailAuthRequestInvalidCodeError())
    if (this.isExpired(currentDate))
      return err(new EmailAuthRequestExpiredError())
    if (this.props.isUsed) return err(new EmailAuthRequestAlreadyUsedError())
    this.use()
    return ok(true)
  }

  private isCodeInvalid(code: string) {
    return code != this.props.code
  }

  private isExpired(currentDate: Date) {
    return currentDate.getTime() >= this.props.expiresAt.getTime()
  }

  private use() {
    this.props.isUsed = true
  }

  static fromSnapshot(snapshot: EmailAuthRequestSnapshot) {
    return new EmailAuthRequest({
      id: snapshot.id,
      email: snapshot.email,
      code: snapshot.code,
      expiresAt: snapshot.expiresAt,
      isUsed: snapshot.isUsed,
    })
  }

  static create({ currentDate, ...props }: CreateProps) {
    const request = new EmailAuthRequest({
      ...props,
      expiresAt: this.getExpirationDate(currentDate),
      isUsed: false,
    })

    request.addEvent<EmailAuthRequestCreatedEvent>(
      'email-auth-request.created',
      {
        id: request.id,
        email: request.props.email,
        code: request.props.code,
      },
    )
    return request
  }

  private static getExpirationDate(currentDate: Date) {
    return Time.fromDate(currentDate).add(Time.minutes(10)).toDate()
  }
}
