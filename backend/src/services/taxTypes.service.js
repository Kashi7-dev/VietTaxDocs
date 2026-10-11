const db = require("../config/db");

async function listTaxTypes() {
  return db("tax_types")
    .select("id", "code", "name", "description")
    .orderBy("code");
}

module.exports = { listTaxTypes };
