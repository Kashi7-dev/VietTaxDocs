const pg = require("pg");
pg.types.setTypeParser(1082, (value) => value); // cột DATE trả về chuỗi "YYYY-MM-DD"
const knex = require("knex");
const config = require("../../knexfile");

const environment = process.env.NODE_ENV || "development";

if (!config[environment]) {
  throw new Error(
    `Thiếu cấu hình Knex cho môi trường "${environment}" trong knexfile.js`,
  );
}

// Một kết nối (pool) dùng chung cho cả dự án.
module.exports = knex(config[environment]);
