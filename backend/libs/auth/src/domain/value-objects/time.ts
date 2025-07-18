export class Time {
  private constructor(private _value: number) {}

  add(time: Time) {
    return new Time(this.value + time.value)
  }

  sub(time: Time) {
    return new Time(this.value - time.value)
  }

  static days(days: number) {
    return Time.ms(days * 24 * 60 * 60 * 1000)
  }

  static hours(hours: number) {
    return Time.ms(hours * 60 * 60 * 1000)
  }

  static minutes(minutes: number) {
    return Time.ms(minutes * 60 * 1000)
  }

  static seconds(seconds: number) {
    return Time.ms(seconds * 1000)
  }

  static ms(milliseconds: number) {
    return new Time(milliseconds)
  }

  static fromDate(date: Date) {
    return new Time(date.getTime())
  }

  get value() {
    return this._value
  }

  toDate() {
    return new Date(this.value)
  }
}
