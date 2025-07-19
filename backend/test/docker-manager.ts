import {
    DockerComposeEnvironment,
    StartedDockerComposeEnvironment,
} from 'testcontainers'
import * as path from 'path'
import knex, { Knex } from 'knex'
import config from '../libs/core/src/infrastructure/database-configuration/knexfile'

const composeFilePath = path.resolve(process.cwd(), 'test')
const composeFile = 'docker-compose-test.yaml'

export let dockerInstance: StartedDockerComposeEnvironment | null = null

export const startDockerPostgresql = async (): Promise<void> => {
    let sqlConnection: Knex | null = null
    try {
        console.log('start DB migration')
        dockerInstance = await new DockerComposeEnvironment(
            composeFilePath,
            composeFile,
        ).up()

        sqlConnection = knex(config.test)
        await sqlConnection?.migrate.latest()

        console.log('end DB migration')
    } catch (e) {
        console.log(e)
        throw new Error('Fail to start the database' + e)
    } finally {
        await sqlConnection?.destroy()
    }
}

const tables = {
    auth: ['users', 'email_auth_requests', 'outbox_events'],
}

const resetAuthDB = async (sqlConnection: Knex) => {
    return Promise.all(
        tables.auth.map((table) =>
            sqlConnection.withSchema('auth').table(table).truncate(),
        ),
    )
}

export const resetDB = async (sqlConnection: Knex) => {
    await resetAuthDB(sqlConnection)
}
