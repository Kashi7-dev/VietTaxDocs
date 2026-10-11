const db = require("../config/db");

async function listIssuingAgencies() {
  return db("issuing_agencies")
    .select("id", "name", "website_url")
    .orderBy("id");
}

module.exports = { listIssuingAgencies };
