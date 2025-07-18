import { Clock } from '@app/core/domain/providers/clock/clock'
import { IDGenerator } from '@app/core/domain/providers/id-generator/id-generator'
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { JwtGenerator } from '../ports/jwt-generator'
import { UserRepository } from '../ports/repositories/user.repository'
import { EmailAuthRequestRepository } from '../ports/repositories/email-auth-request.repository'
import { User } from '@app/auth/domain/entities/user'
import { err, ok, Result } from 'neverthrow'
import {
    EmailAuthRequestAlreadyUsedError,
    EmailAuthRequestInvalidCodeError,
} from '@app/auth/domain/errors/email-auth-requests.errors'
import { EmailAuthRequestNotFoundError } from '../errors/auth-email-request.errors'
import { TransactionPerformer } from '@app/core/application/ports/transaction-performer'

type AuthWithEmailProps = {
    requestId: string
    code: string
}
export class AuthWithEmailCommand implements ICommand {
    constructor(public readonly props: AuthWithEmailProps) { }
}

export type AuthWithEmailResult = Result<
    { tokens: { access: string; refresh: string } },
    | EmailAuthRequestNotFoundError
    | EmailAuthRequestAlreadyUsedError
    | EmailAuthRequestInvalidCodeError
    | EmailAuthRequestAlreadyUsedError
>

@CommandHandler(AuthWithEmailCommand)
export class AuthWithEmailHandler
    implements ICommandHandler<AuthWithEmailCommand> {
    constructor(
        private readonly emailAuthRequestRepository: EmailAuthRequestRepository,
        private readonly userRepository: UserRepository,
        private readonly clock: Clock,
        private readonly idGenerator: IDGenerator,
        private readonly jwtGenerator: JwtGenerator,
        private readonly transactionPerformer: TransactionPerformer,
    ) { }

    async execute(command: AuthWithEmailCommand): Promise<AuthWithEmailResult> {
        return this.transactionPerformer.perform(async (trx) => {
            const { requestId, code } = command.props

            const request = await this.emailAuthRequestRepository.findById(requestId)

            if (!request) {
                return err(new EmailAuthRequestNotFoundError())
            }

            const result = request.verify(code, this.clock.now())

            if (result.isErr()) {
                return result
            }

            let user = await this.userRepository.findByEmail(request.email)

            if (!user) {
                user = User.create({
                    id: this.idGenerator.generate(),
                    email: request.email,
                    currentDate: this.clock.now(),
                })
                await this.userRepository.save(user)(trx)
            }

            await this.emailAuthRequestRepository.save(request)(trx)

            return ok({
                tokens: {
                    access: this.jwtGenerator.generateAccess(user.id),
                    refresh: this.jwtGenerator.generateRefresh(user.id),
                },
            })
        })
    }
}
