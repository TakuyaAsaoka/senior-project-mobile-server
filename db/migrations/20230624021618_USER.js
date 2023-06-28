/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("USER", (table) => {
    table.increments("id").primary();
    table.string("name", 32).notNullable();
    table.string("email", 64).notNullable();
    table.string("password", 32).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("USER");
};
