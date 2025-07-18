import { Clock } from './clock'

export class DeterministicClock implements Clock {
  constructor(private currentDate: Date) {}

  now(): Date {
    return this.currentDate
  }
}
