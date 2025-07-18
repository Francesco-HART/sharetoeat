import { EmailAuthRequestRepository } from '@app/auth/application/ports/repositories/email-auth-request.repository'
import {
  EmailAuthRequest,
  EmailAuthRequestSnapshot,
} from '@app/auth/domain/entities/email-auth-request'
import { BaseFakeRepository } from '../base-fake-repository'
import { TransactionableAsync } from '@app/core/application/ports/transaction-performer'

export class FakeEmailAuthRequestRepository
  extends BaseFakeRepository
  implements EmailAuthRequestRepository
{
  private requests: Map<string, EmailAuthRequestSnapshot> = new Map()

  save(emailAuthRequest: EmailAuthRequest): TransactionableAsync<void> {
    return async () => {
      this.requests.set(emailAuthRequest.id, emailAuthRequest.snapshot)
      this.saveOutboxEvents(emailAuthRequest.getAndClearEvents())
    }
  }

  async findById(id: string): Promise<EmailAuthRequest | null> {
    const snapshot = this.requests.get(id)
    if (!snapshot) {
      return null
    }

    return EmailAuthRequest.fromSnapshot(snapshot)
  }

  getAll() {
    return Array.from(this.requests.values()).map(EmailAuthRequest.fromSnapshot)
  }

  insert(request: EmailAuthRequest) {
    this.requests.set(request.id, request.snapshot)
  }
}
