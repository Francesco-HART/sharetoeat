import { BaseEntity } from './base-entity'

export type DomainEvent = {
  name: string
  payload: Record<string, unknown>
}

export abstract class AggregateRoot<
  P extends Record<string, unknown> = Record<string, unknown>,
  S extends Record<string, unknown> = Record<string, unknown>,
> extends BaseEntity<P, S> {
  private events: DomainEvent[] = []

  protected addEvent<T extends Record<string, unknown>>(
    name: string,
    payload: T,
  ) {
    if (!this.events) {
      this.events = []
    }

    this.events.push({ name, payload })
  }

  public getAndClearEvents() {
    const events = this.events
    this.events = []

    return events
  }
}
