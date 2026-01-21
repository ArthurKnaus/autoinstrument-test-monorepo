/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Create sessions table
  await knex.schema.createTable('sessions', (table) => {
    table.string('id').primary();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Create messages table
  await knex.schema.createTable('messages', (table) => {
    table.increments('id').primary();
    table.string('session_id').notNullable();
    table.enum('role', ['user', 'assistant']).notNullable();
    table.text('content').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.foreign('session_id').references('id').inTable('sessions').onDelete('CASCADE');
    table.index('session_id');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('messages');
  await knex.schema.dropTableIfExists('sessions');
}
