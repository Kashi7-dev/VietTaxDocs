const db = require("../config/db");
const HttpError = require("../utils/httpError");
const {
  calculateProgressiveTax,
  scaleBrackets,
} = require("../utils/progressiveTax");

const MONTHS_PER_YEAR = 12;

// Lấy biểu thuế TNCN có hiệu lực trong năm tính thuế (lưu theo tháng).
// Dùng ngày cuối năm làm mốc: biểu nào có effective_from <= mốc và chưa hết hạn tại mốc đó.
async function loadTncnBrackets(year) {
  const referenceDate = `${year}-12-31`;

  const rows = await db("tax_brackets as b")
    .join("tax_types as t", "t.id", "b.tax_type_id")
    .where("t.code", "TNCN")
    .where("b.effective_from", "<=", referenceDate)
    .andWhere(function () {
      this.whereNull("b.effective_to").orWhere(
        "b.effective_to",
        ">=",
        referenceDate,
      );
    })
    .orderBy("b.bracket_order")
    .select(
      "b.bracket_order",
      "b.income_from",
      "b.income_to",
      "b.tax_rate",
      "b.legal_basis",
    );

  // NUMERIC của PostgreSQL trả về dạng chuỗi nên đổi sang số.
  return rows.map((row) => ({
    bracket_order: row.bracket_order,
    income_from: Number(row.income_from),
    income_to: row.income_to === null ? null : Number(row.income_to),
    tax_rate: Number(row.tax_rate),
    legal_basis: row.legal_basis,
  }));
}

async function calculateTncn({ income, deductions, period, year }) {
  const monthlyBrackets = await loadTncnBrackets(year);
  if (monthlyBrackets.length === 0) {
    throw new HttpError(400, `No tax brackets available for year ${year}`);
  }

  const brackets =
    period === "yearly"
      ? scaleBrackets(monthlyBrackets, MONTHS_PER_YEAR)
      : monthlyBrackets;

  const taxableIncome = Math.max(0, income - deductions);
  const { total_tax, breakdown } = calculateProgressiveTax(
    taxableIncome,
    brackets,
  );

  return {
    year,
    period,
    taxable_income: taxableIncome,
    total_tax,
    breakdown,
    legal_basis: monthlyBrackets[0].legal_basis,
  };
}

module.exports = { calculateTncn };
