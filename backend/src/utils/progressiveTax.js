// Tính thuế theo biểu thuế lũy tiến từng phần. Đây là hàm thuần: không đụng DB, dễ kiểm thử.
//
// brackets: mảng đã sắp xếp tăng dần theo income_from, mỗi phần tử có dạng
//   { bracket_order, income_from, income_to (null = không giới hạn), tax_rate (%) }
// Tiền tính bằng VND. Thuế của từng bậc được làm tròn tới 1 VND, tổng thuế là tổng các bậc.
function calculateProgressiveTax(taxableIncome, brackets) {
  const breakdown = [];
  let totalTax = 0;

  for (const bracket of brackets) {
    const upper = bracket.income_to === null ? Infinity : bracket.income_to;
    const incomeInBracket =
      Math.min(taxableIncome, upper) - bracket.income_from;

    // Các bậc sau còn cao hơn nữa, nên có thể dừng ngay.
    if (incomeInBracket <= 0) break;

    const taxAmount = Math.round((incomeInBracket * bracket.tax_rate) / 100);
    totalTax += taxAmount;

    breakdown.push({
      bracket_order: bracket.bracket_order,
      income_in_bracket: incomeInBracket,
      tax_rate: bracket.tax_rate,
      tax_amount: taxAmount,
    });
  }

  return { total_tax: totalTax, breakdown };
}

// Đổi biểu thuế theo tháng thành biểu theo năm (nhân các ngưỡng thu nhập với 12).
function scaleBrackets(brackets, factor) {
  return brackets.map((bracket) => ({
    ...bracket,
    income_from: bracket.income_from * factor,
    income_to: bracket.income_to === null ? null : bracket.income_to * factor,
  }));
}

module.exports = { calculateProgressiveTax, scaleBrackets };
