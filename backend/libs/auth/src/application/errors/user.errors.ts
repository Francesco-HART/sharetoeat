import { ApplicationError } from '@app/core/application/errors/application-error'

export class UserNotFoundError extends ApplicationError {
  constructor() {
    super('USER_NOT_FOUND')
  }
}
