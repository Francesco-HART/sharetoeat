import {
    BadRequestException,
    Body,
    Controller,
    Get,
    GoneException,
    HttpCode,
    InternalServerErrorException,
    NotFoundException,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common'
import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import {
    AuthWithEmailCommand,
    AuthWithEmailResult,
} from '@app/auth/application/commands/auth-with-email'
import {
    RequestAuthWithEmailCommand,
    RequestAuthWithEmailResult,
} from '@app/auth/application/commands/request-auth-with-email'
import {
    GetUserQuery,
    GetUserQueryResult,
} from '@app/auth/application/queries/get-user'
import {
    EmailAuthRequestAlreadyUsedError,
    EmailAuthRequestExpiredError,
    EmailAuthRequestInvalidCodeError,
} from '@app/auth/domain/errors/email-auth-requests.errors'
import { EmailAuthRequestNotFoundError } from '@app/auth/application/errors/auth-email-request.errors'
import {
    AuthWithGithubCommand,
    AuthWithGithubResult,
} from '@app/auth/application/commands/auth-with-github'
import {
    UpdateUserCommand,
    UpdateUserResult,
} from '@app/auth/application/commands/update-user'
import {
    RefreshTokensCommand,
    RefreshTokensResult,
} from '@app/auth/application/commands/refresh-tokens'
import { JwtAuthGuard } from '@app/core/infrastructure/api/guards/jwt-auth-guard'
import { User } from '@app/core/infrastructure/api/decorators/user.decorator'
import { UserNotFoundError } from '@app/auth/application/errors/user.errors'
import { Throttle, ThrottlerGuard } from '@nestjs/throttler'
import { Time } from '@app/auth/domain/value-objects/time'

export class RefreshTokensBody {
    @IsString()
    refreshToken: string
}

export class RequestAuthWithEmailBody {
    @IsEmail()
    email: string
}

export class VerifyAuthWithEmailBody {
    @IsString()
    code: string

    @IsUUID()
    id: string
}

export class UpadateMeBody {
    @IsString()
    @IsOptional()
    name?: string

    @IsString()
    @IsOptional()
    avatarUrl?: string
}

export class AuthWithGithubBody {
    @IsString()
    code: string
}

@Controller('auth')
export class AuthController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) { }

    @Post('github')
    @HttpCode(200)
    async authWithGithub(@Body() body: AuthWithGithubBody) {
        const result: AuthWithGithubResult = await this.commandBus.execute(
            new AuthWithGithubCommand(body.code),
        )

        return result.match(
            (res) => res,
            () => { },
        )
    }

    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { ttl: Time.seconds(30).value, limit: 5 } })
    @Post('email/otp/validation')
    @HttpCode(200)
    async verifyAuthWithEmail(@Body() body: VerifyAuthWithEmailBody) {
        const result: AuthWithEmailResult = await this.commandBus.execute(
            new AuthWithEmailCommand({
                code: body.code,
                requestId: body.id,
            }),
        )

        return result.match(
            (res) => res,
            (err) => {
                if (err instanceof EmailAuthRequestNotFoundError) {
                    throw new NotFoundException(err.code)
                }

                if (
                    err instanceof EmailAuthRequestExpiredError ||
                    err instanceof EmailAuthRequestAlreadyUsedError
                ) {
                    throw new GoneException(err.code)
                }

                if (err instanceof EmailAuthRequestInvalidCodeError) {
                    throw new BadRequestException(err.code)
                }
            },
        )
    }

    @Post('email/otp')
    async requestAuthWithEmail(@Body() body: RequestAuthWithEmailBody) {
        const result: RequestAuthWithEmailResult = await this.commandBus.execute(
            new RequestAuthWithEmailCommand(body),
        )

        return result.match(
            (res) => res,
            () => { },
        )
    }

    @Patch('me')
    @UseGuards(JwtAuthGuard)
    async updateMe(@Body() body: UpadateMeBody, @User() user: string) {
        const result: UpdateUserResult = await this.commandBus.execute(
            new UpdateUserCommand({
                id: user,
                name: body.name,
                avatarUrl: body.avatarUrl,
            }),
        )
        return result.match(
            (res) => res,
            () => { },
        )
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me(@User() user: string) {
        const result: GetUserQueryResult = await this.queryBus.execute(
            new GetUserQuery(user),
        )

        return result.match(
            (res) => res,
            (err) => {
                if (err instanceof UserNotFoundError) {
                    throw new NotFoundException(err.code)
                }
                throw new InternalServerErrorException(err)
            },
        )
    }

    @Post('refresh')
    async refreshTokens(@Body() body: RefreshTokensBody) {
        const result: RefreshTokensResult = await this.commandBus.execute(
            new RefreshTokensCommand(body.refreshToken),
        )

        return result.match(
            (res) => res,
            (err) => {
                throw new BadRequestException(err.message)
            },
        )
    }
}
