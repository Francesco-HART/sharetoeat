import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ScheduleModule } from '@nestjs/schedule'
import knex from 'knex'
import config from './infrastructure/database-configuration/knexfile'
import { Clock } from './domain/providers/clock/clock'
import { SystemClock } from './domain/providers/clock/system-clock'
import { IDGenerator } from './domain/providers/id-generator/id-generator'
import { UUIDGenerator } from './domain/providers/id-generator/uuid-generator'
import { TransactionPerformer } from './application/ports/transaction-performer'
import { KnexTransactionPerformer } from './infrastructure/adapters/transaction-performer/knex-transaction-performer'
import { JwtAuthGuard } from './infrastructure/api/guards/jwt-auth-guard'
import { JwtDecoder } from './application/ports/jwt-decoder'
import { NestJwtDecoder } from './infrastructure/adapters/jwt-decoder/nest-jwt-decoder'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'

@Module({
    imports: [
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 0,
                    limit: 0,
                },
            ],
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        EventEmitterModule.forRoot({
            wildcard: true,
        }),
        CqrsModule.forRoot(),
        ScheduleModule.forRoot(),
        JwtModule.register({
            secret: 'secret',
        }),
    ],
    providers: [
        {
            provide: 'Knex',
            inject: [ConfigService],
            useFactory: (configService: ConfigService) =>
                knex(
                    configService.get('NODE_ENV') === 'production'
                        ? config.production
                        : config.development,
                ),
        },
        {
            provide: Clock,
            useClass: SystemClock,
        },
        {
            provide: IDGenerator,
            useClass: UUIDGenerator,
        },
        {
            provide: TransactionPerformer,
            useClass: KnexTransactionPerformer,
        },
        JwtAuthGuard,
        { provide: JwtDecoder, useClass: NestJwtDecoder },
    ],
    exports: [
        'Knex',
        Clock,
        IDGenerator,
        TransactionPerformer,
        JwtAuthGuard,
        JwtDecoder,
    ],
})
export class CoreModule { }
