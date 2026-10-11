const HttpError = require("../utils/httpError");
const { assertPlainObject, isFiniteNumber } = require("../utils/validators");

const MAX_AMOUNT = 1e13; // 10 nghìn tỷ VND, chặn giá trị phi lý
const MIN_YEAR = 2009;
const MAX_YEAR = 2100;

// "now" có thể truyền vào để kiểm thử.
function parseCalculationBody(body, now = new Date()) {
  assertPlainObject(body);
  const { income, deductions = 0, period, year } = body;

  if (!isFiniteNumber(income) || income < 0 || income > MAX_AMOUNT) {
    throw new HttpError(
      400,
      `income must be a number between 0 and ${MAX_AMOUNT}`,
    );
  }
  if (
    !isFiniteNumber(deductions) ||
    deductions < 0 ||
    deductions > MAX_AMOUNT
  ) {
    throw new HttpError(
      400,
      `deductions must be a number between 0 and ${MAX_AMOUNT}`,
    );
  }
  if (period !== "monthly" && period !== "yearly") {
    throw new HttpError(400, 'period must be "monthly" or "yearly"');
  }

  let taxYear = now.getFullYear();
  if (year !== undefined) {
    if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) {
      throw new HttpError(
        400,
        `year must be an integer between ${MIN_YEAR} and ${MAX_YEAR}`,
      );
    }
    taxYear = year;
  }

  return { income, deductions, period, year: taxYear };
}

module.exports = { parseCalculationBody };
