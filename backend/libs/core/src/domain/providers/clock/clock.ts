import { DateOnly } from "../../value-objects/date-only";

export abstract class Clock {
    abstract now(): Date
    abstract nowDateOnly(): DateOnly
}
