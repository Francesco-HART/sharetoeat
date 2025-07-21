import { Clock } from './clock'

export class DeterministicClock implements Clock {
    constructor(public currentDate: Date) { }

    nowDateOnly(): Date {
        return new Date(Date.UTC(
            this.currentDate.getUTCFullYear(),
            this.currentDate.getUTCMonth(),
            this.currentDate.getUTCDate()
        ));
    }

    now(): Date {
        return this.currentDate
    }
}
