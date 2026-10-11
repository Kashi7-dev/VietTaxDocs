const taxTypesService = require("../services/taxTypes.service");

async function list(req, res, next) {
  try {
    const taxTypes = await taxTypesService.listTaxTypes();
    res.status(200).json(taxTypes);
  } catch (err) {
    next(err);
  }
}

module.exports = { list };
