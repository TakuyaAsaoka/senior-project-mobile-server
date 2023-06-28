// Update with your config settings.
require('dotenv').config({ path: '.env' });

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      user: process.env.DB_USER || 'asaokatakuya',
      database: process.env.DB_NAME || 'senior_project',
    },
    migrations: {
      directory: '../db/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: '../db/seeds',
    },
  },

  production: {
    client: 'postgresql',
    connection: process.env.DB_URL,
    migrations: {
      directory: '../db/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: '../db/seeds',
    },
  },
};
