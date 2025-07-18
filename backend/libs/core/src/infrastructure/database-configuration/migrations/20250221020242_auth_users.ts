import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createSchemaIfNotExists('auth')

  await knex.schema.withSchema('auth').createTable('users', (table) => {
    table.uuid('id').primary()
    table.string('email').notNullable().unique()
    table.string('name')
    table.string('avatar_url')
    table.datetime('register_at').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('auth').dropTableIfExists('users')
  await knex.schema.dropSchemaIfExists('auth')
}
