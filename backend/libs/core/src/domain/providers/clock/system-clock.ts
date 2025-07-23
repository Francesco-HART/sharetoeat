import { DateOnly } from "../../value-objects/date-only";
import { Clock } from "./clock";

export class SystemClock implements Clock {
    nowDateOnly(): DateOnly {
        return DateOnly.fromDateUTC(new Date())
    }

    now() {
        return new Date()
    }
}
