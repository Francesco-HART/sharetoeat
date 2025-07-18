import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('auth').createTable('outbox_events', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.jsonb('payload').notNullable()
    table.datetime('created_at').defaultTo(knex.fn.now()).notNullable()
    table.datetime('processed_at').nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('auth').dropTableIfExists('outbox_events')
}
