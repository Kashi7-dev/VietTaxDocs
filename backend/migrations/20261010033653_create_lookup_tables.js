exports.up = async function (knex) {
  await knex.raw(`
    CREATE TABLE tax_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,      -- VD: 'TNCN', 'TNDN', 'GTGT'
    name VARCHAR(255) NOT NULL,
    description TEXT
);
  CREATE TABLE issuing_agencies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,             -- VD: 'Bộ Tài chính', 'Tổng cục Thuế'
    website_url VARCHAR(500)
);  
  `);
};

exports.down = async function (knex) {
  await knex.raw(`
    DROP TABLE IF EXISTS issuing_agencies;
    DROP TABLE IF EXISTS tax_types;
  `);
};