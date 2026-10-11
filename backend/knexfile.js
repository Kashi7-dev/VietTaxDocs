require("dotenv").config();

const base = {
  client: "pg",
  migrations: { directory: "./migrations" },
  seeds: { directory: "./seeds" },
};

module.exports = {
  development: {
    ...base,
    connection: process.env.DATABASE_URL,
  },
  production: {
    ...base,
    connection: process.env.DATABASE_URL,
    pool: { min: 0, max: 5 },
  },
};
