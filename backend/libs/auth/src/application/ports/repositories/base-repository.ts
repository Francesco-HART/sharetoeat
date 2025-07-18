import { TransactionableAsync } from '@app/core/application/ports/transaction-performer'
import { BaseEntity } from '@app/core/domain/entities/base-entity'

export abstract class BaseRepository<T extends BaseEntity> {
  abstract save(entity: T): TransactionableAsync<void>
}
