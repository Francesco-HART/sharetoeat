import { Clock } from './clock'

export class DeterministicClock implements Clock {
    constructor(public currentDate: Date) { }

    now(): Date {
        return this.currentDate
    }
}
