import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .withSchema('auth')
    .createTable('email_auth_requests', (table) => {
      table.uuid('id').primary()
      table.string('email').notNullable()
      table.string('code').notNullable()
      table.datetime('expires_at').notNullable()
      table.boolean('is_used').notNullable()
    })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('auth').dropTableIfExists('email_auth_requests')
}
