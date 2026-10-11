const taxCalculationsService = require("../services/taxCalculations.service");
const {
  parseCalculationBody,
} = require("../validators/taxCalculation.validator");

// POST /api/tax-calculations
async function calculate(req, res, next) {
  try {
    const input = parseCalculationBody(req.body);
    const result = await taxCalculationsService.calculateTncn(input);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { calculate };
