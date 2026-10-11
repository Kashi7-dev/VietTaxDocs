// Biểu thuế TNCN cho thu nhập từ tiền lương, tiền công của cá nhân cư trú.
// Lưu theo THÁNG, đơn vị VND. Biểu theo NĂM = biểu theo tháng x 12 (tính trong code, không lưu riêng).
// Hãy đối chiếu lại với văn bản gốc trước khi dùng cho mục đích thật.
exports.seed = async function (knex) {
  const tncn = await knex("tax_types").where({ code: "TNCN" }).first("id");
  if (!tncn) {
    throw new Error(
      "Chưa có loại thuế TNCN. Hãy chạy seed 01_tax_types.js trước.",
    );
  }

  const M = 1000000;

  const newBasis =
    "Luật Thuế thu nhập cá nhân số 109/2025/QH15, Điều 9 (biểu thuế 5 bậc, áp dụng từ kỳ tính thuế năm 2026)";
  const oldBasis =
    "Luật Thuế thu nhập cá nhân số 04/2007/QH12 (biểu thuế 7 bậc, hướng dẫn tại Thông tư 111/2013/TT-BTC), áp dụng đến hết kỳ tính thuế năm 2025";

  // [bậc, từ, đến (null = không giới hạn), thuế suất %]
  const newScale = [
    [1, 0, 10 * M, 5],
    [2, 10 * M, 30 * M, 10],
    [3, 30 * M, 60 * M, 20],
    [4, 60 * M, 100 * M, 30],
    [5, 100 * M, null, 35],
  ];
  const oldScale = [
    [1, 0, 5 * M, 5],
    [2, 5 * M, 10 * M, 10],
    [3, 10 * M, 18 * M, 15],
    [4, 18 * M, 32 * M, 20],
    [5, 32 * M, 52 * M, 25],
    [6, 52 * M, 80 * M, 30],
    [7, 80 * M, null, 35],
  ];

  const toRows = (scale, basis, effectiveFrom, effectiveTo) =>
    scale.map(([order, from, to, rate]) => ({
      tax_type_id: tncn.id,
      bracket_order: order,
      income_from: from,
      income_to: to,
      tax_rate: rate,
      legal_basis: basis,
      effective_from: effectiveFrom,
      effective_to: effectiveTo,
    }));

  const rows = [
    ...toRows(newScale, newBasis, "2026-01-01", null),
    ...toRows(oldScale, oldBasis, "2009-01-01", "2025-12-31"),
  ];

  // Khóa (tax_type_id, bracket_order, effective_from) là UNIQUE nên chạy lại seed an toàn.
  await knex("tax_brackets")
    .insert(rows)
    .onConflict(["tax_type_id", "bracket_order", "effective_from"])
    .merge();
};
