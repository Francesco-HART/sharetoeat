import { TransactionableAsync } from '@app/core/application/ports/transaction-performer'
import { AggregateRoot } from '@app/core/domain/entities/aggregate-root'
import { BaseEntity } from '@app/core/domain/entities/base-entity'
import { Knex } from 'knex'

export class BaseKnexRepository {
  constructor(
    protected knex: Knex,
    protected schema: string,
  ) {}

  protected saveEvents(entity: AggregateRoot): TransactionableAsync<void> {
    return async (trx: Knex.Transaction) => {
      const events = entity.getAndClearEvents().map((event) => ({
        name: event.name,
        payload: event.payload,
      }))

      if (!events.length) {
        return
      }

      await this.knex
        .withSchema(this.schema)
        .transacting(trx)
        .insert(events)
        .into('outbox_events')
    }
  }

  protected saveManyEvents(
    entities: AggregateRoot[],
  ): TransactionableAsync<void> {
    return async (trx: Knex.Transaction) => {
      const events = entities
        .map((entity) => entity.getAndClearEvents())
        .flat()
        .map((event) => ({
          name: event.name,
          payload: event.payload,
        }))

      if (!events.length) {
        return
      }

      await this.knex
        .withSchema(this.schema)
        .transacting(trx)
        .insert(events)
        .into('outbox_events')
    }
  }
}
