/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('FAVORITE', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('USER');
    table.string('title', 64).notNullable();
    table.string('prefecture', 32).notNullable();
    table.json('images').notNullable();
    table.integer('price').notNullable();
    table.string('access', 32).notNullable();
    table.string('postCode', 8).notNullable();
    table.string('address', 64).notNullable();
    table.string('business').notNullable();
    table.string('phoneNumber').notNullable();
    table.string('parking').notNullable();
    table.string('toilet').notNullable();
    table.string('closed').notNullable();
    table.json('publicTransport').notNullable();
    table.json('car').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('FAVORITE');
};
