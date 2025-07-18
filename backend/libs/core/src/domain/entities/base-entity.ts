import { Snapshotable } from '../snapshotable'

export type DomainEvent = {
  name: string
  payload: Record<string, unknown>
}

export abstract class BaseEntity<
  P extends Record<string, unknown> = Record<string, unknown>,
  S extends Record<string, unknown> = Record<string, unknown>,
> implements Snapshotable<S>
{
  protected constructor(protected props: P) {}
  abstract get snapshot(): S
}
