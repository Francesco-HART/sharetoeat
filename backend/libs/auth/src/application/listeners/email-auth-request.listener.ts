import { EmailAuthRequestCreatedEvent } from '@app/auth/domain/events/email-auth-request.events'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { SendEmailAuthCodeCommand } from '../commands/send-email-auth-code'
import { CommandBus } from '@nestjs/cqrs'

@Injectable()
export class EmailAuthRequestListener {
  constructor(private readonly commandBus: CommandBus) {}

  @OnEvent('email-auth-request.created')
  onEmailAuthRequestCreated(payload: EmailAuthRequestCreatedEvent) {
    this.commandBus.execute(
      new SendEmailAuthCodeCommand({
        email: payload.email,
        code: payload.code,
      }),
    )
  }
}
