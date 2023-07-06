/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("FAVORITE", (table) => {
    table.increments("id").primary();
    table.string("user_id", 64).notNullable();
    table.string("name", 64).notNullable();
    table.string("prefecture", 32).notNullable();
    table.json("images").notNullable();
    table.integer("price").notNullable();
    table.string("access", 32).notNullable();
    table.string("zip_code", 8).notNullable();
    table.string("address", 64).notNullable();
    table.string("business").notNullable();
    table.string("phone_number", 16).notNullable();
    table.string("parking").notNullable();
    table.string("toilet").notNullable();
    table.string("closed").notNullable();
    table.json("public_transport").notNullable();
    table.json("car").notNullable();
    table.boolean("has_visited").notNullable();
    table.decimal("latitude").notNullable();
    table.decimal("longitude").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("FAVORITE");
};
