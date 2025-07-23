export class DateOnly {
    private constructor(private date: Date) { }

    get value(): Date {
        return this.date
    }

    public static fromDateUTC(date: Date) {
        return new DateOnly(new Date(Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate()
        )));
    }
}
