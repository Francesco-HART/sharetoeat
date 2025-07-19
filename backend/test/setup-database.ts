import knex, { Knex } from 'knex'
import { resetDB } from './docker-manager'
import config from '@app/core/infrastructure/database-configuration/knexfile'

export const setupDatabase = () => {
  let sqlConnection: Knex

  beforeAll(async () => {
    sqlConnection = knex(config.test)
  })

  beforeEach(async () => {
    await resetDB(sqlConnection)
  })

  afterAll(async () => {
    await sqlConnection.destroy()
  })

  return {
    getKnex() {
      return sqlConnection
    },
  }
}
