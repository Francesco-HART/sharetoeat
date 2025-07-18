import {
  EmailAuthRequest,
  EmailAuthRequestSnapshot,
} from '@app/auth/domain/entities/email-auth-request'

export class EmailAuthRequestBuilder {
  constructor(
    private snapshot: EmailAuthRequestSnapshot = {
      id: 'id',
      email: 'email',
      code: 'code',
      expiresAt: new Date('2025-01-01T00:00:00.000Z'),
      isUsed: false,
    },
  ) {}

  withId(id: string) {
    this.snapshot.id = id
    return this
  }

  withEmail(email: string) {
    this.snapshot.email = email
    return this
  }

  withCode(code: string) {
    this.snapshot.code = code
    return this
  }

  expiresAt(date: Date) {
    this.snapshot.expiresAt = date
    return this
  }

  used() {
    this.snapshot.isUsed = true
    return this
  }

  unUsed() {
    this.snapshot.isUsed = false
    return this
  }

  build() {
    return EmailAuthRequest.fromSnapshot(this.snapshot)
  }
}
