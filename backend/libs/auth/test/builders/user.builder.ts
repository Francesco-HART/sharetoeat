import { User, UserSnapshot } from '@app/auth/domain/entities/user'

export class UserBuilder {
  constructor(
    private snapshot: UserSnapshot = {
      id: 'id',
      email: 'email',
      name: undefined,
      avatarUrl: undefined,
      registerAt: new Date('2025-01-01T00:00:00.000Z'),
    },
  ) {}

  withId(id: string) {
    this.snapshot.id = id
    return this
  }

  withEmail(email: string) {
    this.snapshot.email = email
    return this
  }

  withName(name: string) {
    this.snapshot.name = name
    return this
  }

  withAvatar(avatar: string) {
    this.snapshot.avatarUrl = avatar
    return this
  }

  registerAt(date: Date) {
    this.snapshot.registerAt = date
    return this
  }

  build() {
    return User.fromSnapshot(this.snapshot)
  }
}
