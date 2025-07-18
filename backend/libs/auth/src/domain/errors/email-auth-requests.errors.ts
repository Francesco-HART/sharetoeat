import { DomainError } from '@app/core/domain/errors/error'

export class EmailAuthRequestExpiredError extends DomainError {
  constructor() {
    super('REQUEST_EXPIRED')
  }
}

export class EmailAuthRequestAlreadyUsedError extends DomainError {
  constructor() {
    super('REQUEST_ALREADY_USED')
  }
}

export class EmailAuthRequestInvalidCodeError extends DomainError {
  constructor() {
    super('INVALID_CODE')
  }
}
