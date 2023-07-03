"use strict";
// Update with your config settings.
// require("dotenv").config({ path: ".env" });
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: "tokitabi.c7jkgtibfhqn.us-east-1.rds.amazonaws.com",
      port: 5432,
      user: process.env.DB_USER || "postgresql",
      database: process.env.DB_NAME || "tokiTabi",
      password: "",
    },
    migrations: {
      directory: "../db/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "../db/seeds",
    },
  },
  production: {
    client: "postgresql",
    connection: {
      host: process.env.RDS_HOSTNAME,
      port: 5432,
      user: process.env.RDS_USERNAME,
      database: process.env.RDS_DB_NAME,
      password: process.env.RDS_PASSWORD,
    },
    migrations: {
      directory: "../db/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "../db/seeds",
    },
  },
};
