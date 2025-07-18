import { Module } from '@nestjs/common'
import { RequestAuthWithEmailHandler } from './application/commands/request-auth-with-email'
import { OutboxEventSubscriber } from './infrastructure/outbox-events-subscriber'
import { SendEmailAuthCodeHandler } from './application/commands/send-email-auth-code'
import { JwtModule } from '@nestjs/jwt'
import { AuthWithEmailHandler } from './application/commands/auth-with-email'
import { AuthController } from './infrastructure/api/controllers/auth.controller'
import { OTPGenerator } from './domain/providers/otp-generator'
import { CryptoOTPGenerator } from './domain/providers/crypto-otp-generator'
import { EmailAuthRequestRepository } from './application/ports/repositories/email-auth-request.repository'
import { EmailAuthRequestListener } from './application/listeners/email-auth-request.listener'
import { Emailer } from './application/ports/emailer'
import { NodeMailerEmailer } from './infrastructure/adapters/emailer/nodemailer-emailer'
import { JwtGenerator } from './application/ports/jwt-generator'
import { NestJwtGenerator } from './infrastructure/adapters/jwt-generator/nest-jwt-generator'
import { UserRepository } from './application/ports/repositories/user.repository'
import { GetUserQueryHandler } from './application/queries/get-user'
import { KnexEmailAuthRequestRepository } from './infrastructure/adapters/repositories/email-auth-request/knex-email-auth-request.repository'
import { GithubGateway } from './application/ports/github.gateway'
import { AuthWithGithubHandler } from './application/commands/auth-with-github'
import { APIGithubGateway } from './infrastructure/adapters/github/api-github.gateway'
import { UpdateUserHandler } from './application/commands/update-user'
import { KnexUserRepository } from './infrastructure/adapters/repositories/user/knex-user.repository'
import { CoreModule } from '@app/core/core.module'
import { RefreshTokensHandler } from './application/commands/refresh-tokens'
import { ConfigService } from '@nestjs/config'

@Module({
    imports: [
        CoreModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET')!,
            })
        }),
    ],
    controllers: [AuthController],
    providers: [
        RequestAuthWithEmailHandler,
        {
            provide: OTPGenerator,
            useClass: CryptoOTPGenerator,
        },
        {
            provide: EmailAuthRequestRepository,
            useClass: KnexEmailAuthRequestRepository,
        },
        RefreshTokensHandler,
        OutboxEventSubscriber,
        EmailAuthRequestListener,
        SendEmailAuthCodeHandler,
        GetUserQueryHandler,
        AuthWithEmailHandler,
        AuthWithGithubHandler,
        UpdateUserHandler,
        {
            provide: Emailer,
            inject: [ConfigService],
            useFactory(configService: ConfigService) {
                return new NodeMailerEmailer({
                    email: 'noreply@flagster.fr',
                    password: configService.get('EMAIL_PASSWORD')!,
                })
            },
        },
        {
            provide: JwtGenerator,
            useClass: NestJwtGenerator,
        },
        {
            provide: UserRepository,
            useClass: KnexUserRepository,
        },
        {
            provide: GithubGateway,
            inject: [ConfigService],
            useFactory(configService: ConfigService) {
                return new APIGithubGateway({
                    clientId: configService.get('GITHUB_CLIENT_ID')!,
                    clientSecret: configService.get('GITHUB_CLIENT_SECRET')!,
                })
            },
        },
    ],
})
export class AuthModule { }
