export type UserCreatedEvent = {
  id: string
  email: string
  name?: string
  avatarUrl?: string
}

export type UserUpdatedEvent = {
  id: string
  name?: string
  avatarUrl?: string
}
