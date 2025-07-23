import { DateOnly } from '../../value-objects/date-only';
import { Clock } from './clock'

export class DeterministicClock implements Clock {
    constructor(public currentDate: Date) { }

    nowDateOnly(): DateOnly {
        return DateOnly.fromDateUTC(this.currentDate)
    }

    now(): Date {
        return this.currentDate
    }
}
