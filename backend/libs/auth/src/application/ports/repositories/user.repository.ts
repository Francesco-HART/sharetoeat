import { User } from '@app/auth/domain/entities/user'
import { BaseRepository } from './base-repository'

export abstract class UserRepository extends BaseRepository<User> {
  abstract findById(id: string): Promise<User | null>
  abstract findByEmail(email: string): Promise<User | null>
}
