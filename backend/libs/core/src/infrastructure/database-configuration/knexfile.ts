import { Knex } from 'knex'

const migrations: Knex.Config['migrations'] = {
    directory: `${__dirname}/migrations/`,
    tableName: 'knex_migrations',
}

const config: Record<'development' | 'production' | 'test', Knex.Config> = {
    development: {
        client: 'postgresql',
        connection: {
            host: '127.0.0.1',
            database: 'wally',
            user: 'root',
            password: 'root',
            port: 5432,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: migrations,
    },
    production: {
        client: 'postgresql',
        connection: {
            host: process.env.PGHOST,
            database: process.env.POSTGRES_DB,
            user: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            port: Number(process.env.PGHOST!),
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: migrations,
    },
    test: {
        client: 'postgresql',
        connection: {
            host: '127.0.0.1',
            database: 'wally',
            user: 'root',
            password: 'root',
            port: 5433,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: migrations,
    },
}

export default config
