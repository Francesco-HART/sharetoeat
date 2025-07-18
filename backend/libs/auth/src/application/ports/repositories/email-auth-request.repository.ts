import { EmailAuthRequest } from '@app/auth/domain/entities/email-auth-request'
import { BaseRepository } from './base-repository'

export abstract class EmailAuthRequestRepository extends BaseRepository<EmailAuthRequest> {
  abstract findById(id: string): Promise<EmailAuthRequest | null>
}
