import { UserCreatedEvent, UserUpdatedEvent } from '../events/user.events'
import { AggregateRoot } from '@app/core/domain/entities/aggregate-root'

type Props = {
  id: string
  email: string
  name?: string
  avatarUrl?: string
  registerAt: Date
}

export type UserSnapshot = User['snapshot']

type CreateUserProps = Omit<Props, 'registerAt'> & { currentDate: Date }
type UpdateUserProps = Omit<Props, 'id' | 'email' | 'registerAt'>

export class User extends AggregateRoot<Props> {
  get id() {
    return this.props.id
  }

  get snapshot() {
    return {
      id: this.id,
      email: this.props.email,
      name: this.props.name,
      avatarUrl: this.props.avatarUrl,
      registerAt: this.props.registerAt,
    }
  }

  update({ name, avatarUrl }: UpdateUserProps) {
    if (avatarUrl) this.props.avatarUrl = avatarUrl
    if (name) this.props.name = name
    this.addEvent<UserUpdatedEvent>('user.updated', {
      id: this.id,
      name,
      avatarUrl,
    })
  }

  static fromSnapshot(snapshot: UserSnapshot) {
    return new User({
      id: snapshot.id,
      email: snapshot.email,
      name: snapshot.name,
      avatarUrl: snapshot.avatarUrl,
      registerAt: snapshot.registerAt,
    })
  }

  static create({ currentDate, ...props }: CreateUserProps) {
    const user = new User({
      ...props,
      registerAt: currentDate,
    })

    user.addEvent<UserCreatedEvent>('user.created', {
      id: user.id,
      email: user.props.email,
      name: user.props.name,
      avatarUrl: user.props.avatarUrl,
    })

    return user
  }
}
