import { Clock } from '@app/core/domain/providers/clock/clock'
import { OutboxEventPm } from '@app/core/infrastructure/database-configuration/persistent-models/outbox-events.pm'
import { Inject, Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Cron, CronExpression } from '@nestjs/schedule'
import { Knex } from 'knex'

@Injectable()
export class OutboxEventSubscriber {
  constructor(
    @Inject('Knex') private readonly knex: Knex,
    private readonly eventEmitter: EventEmitter2,
    private readonly clock: Clock,
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  async processEvents() {
    await this.knex.transaction(async (trx) => {
      const events = await this.knex
        .withSchema('auth')
        .select<OutboxEventPm[]>()
        .from('outbox_events')
        .where({ processed_at: null })

      for (const event of events) {
        this.eventEmitter.emitAsync(event.name, event.payload)
        event.processed_at = this.clock.now()
      }

      if (events.length) {
        await this.knex
          .withSchema('auth')
          .transacting(trx)
          .insert(events)
          .into('outbox_events')
          .onConflict('id')
          .merge()
      }
    })
  }
}
