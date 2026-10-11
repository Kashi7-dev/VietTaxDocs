// Chạy bằng: npm test  (dùng bộ kiểm thử có sẵn của Node, không cần cài thêm gì)
const test = require("node:test");
const assert = require("node:assert/strict");

const HttpError = require("../src/utils/httpError");
const {
  calculateProgressiveTax,
  scaleBrackets,
} = require("../src/utils/progressiveTax");
const {
  parseListQuery,
  parseDocumentId,
} = require("../src/validators/documents.validator");
const {
  parseRegisterBody,
  parseLoginBody,
} = require("../src/validators/auth.validator");
const {
  parseCalculationBody,
} = require("../src/validators/taxCalculation.validator");

const M = 1000000;

// Biểu 5 bậc theo tháng (kỳ tính thuế từ 2026)
const NEW_SCALE = [
  { bracket_order: 1, income_from: 0, income_to: 10 * M, tax_rate: 5 },
  { bracket_order: 2, income_from: 10 * M, income_to: 30 * M, tax_rate: 10 },
  { bracket_order: 3, income_from: 30 * M, income_to: 60 * M, tax_rate: 20 },
  { bracket_order: 4, income_from: 60 * M, income_to: 100 * M, tax_rate: 30 },
  { bracket_order: 5, income_from: 100 * M, income_to: null, tax_rate: 35 },
];

// Biểu 7 bậc cũ theo tháng (đến hết kỳ tính thuế 2025)
const OLD_SCALE = [
  { bracket_order: 1, income_from: 0, income_to: 5 * M, tax_rate: 5 },
  { bracket_order: 2, income_from: 5 * M, income_to: 10 * M, tax_rate: 10 },
  { bracket_order: 3, income_from: 10 * M, income_to: 18 * M, tax_rate: 15 },
  { bracket_order: 4, income_from: 18 * M, income_to: 32 * M, tax_rate: 20 },
  { bracket_order: 5, income_from: 32 * M, income_to: 52 * M, tax_rate: 25 },
  { bracket_order: 6, income_from: 52 * M, income_to: 80 * M, tax_rate: 30 },
  { bracket_order: 7, income_from: 80 * M, income_to: null, tax_rate: 35 },
];

const isBadRequest = (err) => err instanceof HttpError && err.status === 400;

test("thu nhập tính thuế 25 triệu/tháng (biểu 5 bậc): 0,5 + 1,5 = 2 triệu", () => {
  const result = calculateProgressiveTax(25 * M, NEW_SCALE);
  assert.equal(result.total_tax, 2 * M);
  assert.equal(result.breakdown.length, 2);
  assert.deepEqual(result.breakdown[0], {
    bracket_order: 1,
    income_in_bracket: 10 * M,
    tax_rate: 5,
    tax_amount: 0.5 * M,
  });
});

test("đúng ngưỡng 100 triệu: tổng thuế 20,5 triệu; 120 triệu: 27,5 triệu", () => {
  assert.equal(calculateProgressiveTax(100 * M, NEW_SCALE).total_tax, 20.5 * M);
  assert.equal(calculateProgressiveTax(120 * M, NEW_SCALE).total_tax, 27.5 * M);
});

test("biểu 7 bậc cũ: 12 triệu/tháng = 0,25 + 0,5 + 0,3 = 1,05 triệu", () => {
  assert.equal(calculateProgressiveTax(12 * M, OLD_SCALE).total_tax, 1.05 * M);
});

test("biểu theo năm = biểu theo tháng x 12", () => {
  const yearly = scaleBrackets(NEW_SCALE, 12);
  assert.equal(calculateProgressiveTax(300 * M, yearly).total_tax, 12 * 2 * M);
  assert.equal(yearly[4].income_to, null);
});

test("thu nhập tính thuế bằng 0 thì không có thuế và không có bậc nào", () => {
  const result = calculateProgressiveTax(0, NEW_SCALE);
  assert.equal(result.total_tax, 0);
  assert.deepEqual(result.breakdown, []);
});

test("parseListQuery: giá trị mặc định", () => {
  assert.deepEqual(parseListQuery({}), {
    search: undefined,
    taxType: undefined,
    status: undefined,
    page: 1,
    pageSize: 10,
  });
});

test("parseListQuery: đọc đúng và chuẩn hóa tham số", () => {
  const result = parseListQuery({
    search: "  cá nhân quý 4  ",
    tax_type: "tncn",
    status: "con_hieu_luc",
    page: "3",
    page_size: "20",
  });
  assert.equal(result.search, "cá nhân quý 4");
  assert.equal(result.taxType, "TNCN");
  assert.equal(result.page, 3);
  assert.equal(result.pageSize, 20);
});

test("parseListQuery: từ chối tham số sai", () => {
  assert.throws(() => parseListQuery({ status: "abc" }), isBadRequest);
  assert.throws(() => parseListQuery({ page: "0" }), isBadRequest);
  assert.throws(() => parseListQuery({ page: "abc" }), isBadRequest);
  assert.throws(() => parseListQuery({ page_size: "999" }), isBadRequest);
  assert.throws(() => parseListQuery({ search: ["a", "b"] }), isBadRequest);
  assert.throws(() => parseListQuery({ tax_type: "TN CN;" }), isBadRequest);
});

test("parseDocumentId", () => {
  assert.equal(parseDocumentId("12"), 12);
  assert.throws(() => parseDocumentId("abc"), isBadRequest);
  assert.throws(() => parseDocumentId("-1"), isBadRequest);
  assert.throws(() => parseDocumentId("99999999999"), isBadRequest);
});

test("parseRegisterBody: dữ liệu hợp lệ được chuẩn hóa email", () => {
  const result = parseRegisterBody({
    email: "  User@Example.COM ",
    password: "matkhau123",
    full_name: " Nguyễn Văn A ",
  });
  assert.deepEqual(result, {
    email: "user@example.com",
    password: "matkhau123",
    fullName: "Nguyễn Văn A",
  });
});

test("parseRegisterBody: từ chối dữ liệu sai", () => {
  const ok = { email: "a@b.com", password: "matkhau123", full_name: "A" };
  assert.throws(() => parseRegisterBody(undefined), isBadRequest);
  assert.throws(
    () => parseRegisterBody({ ...ok, email: "khong-phai-email" }),
    isBadRequest,
  );
  assert.throws(
    () => parseRegisterBody({ ...ok, password: "ngan" }),
    isBadRequest,
  );
  assert.throws(
    () => parseRegisterBody({ ...ok, password: "a".repeat(73) }),
    isBadRequest,
  );
  assert.throws(
    () => parseRegisterBody({ ...ok, full_name: "   " }),
    isBadRequest,
  );
  assert.throws(
    () => parseRegisterBody({ ...ok, full_name: undefined }),
    isBadRequest,
  );
});

test("parseLoginBody", () => {
  assert.deepEqual(parseLoginBody({ email: "A@b.com", password: "x" }), {
    email: "a@b.com",
    password: "x",
  });
  assert.throws(() => parseLoginBody({ email: "A@b.com" }), isBadRequest);
  assert.throws(
    () => parseLoginBody({ email: "sai", password: "x" }),
    isBadRequest,
  );
});

test("parseCalculationBody: mặc định deductions = 0 và năm hiện tại", () => {
  const now = new Date("2026-10-11T00:00:00Z");
  assert.deepEqual(
    parseCalculationBody({ income: 25000000, period: "monthly" }, now),
    {
      income: 25000000,
      deductions: 0,
      period: "monthly",
      year: 2026,
    },
  );
  assert.equal(
    parseCalculationBody({ income: 1, period: "yearly", year: 2025 }, now).year,
    2025,
  );
});

test("parseCalculationBody: từ chối dữ liệu sai", () => {
  assert.throws(
    () => parseCalculationBody({ income: "25000000", period: "monthly" }),
    isBadRequest,
  );
  assert.throws(
    () => parseCalculationBody({ income: -1, period: "monthly" }),
    isBadRequest,
  );
  assert.throws(
    () => parseCalculationBody({ income: 1, period: "weekly" }),
    isBadRequest,
  );
  assert.throws(
    () =>
      parseCalculationBody({ income: 1, deductions: null, period: "monthly" }),
    isBadRequest,
  );
  assert.throws(
    () => parseCalculationBody({ income: 1, period: "monthly", year: 1999 }),
    isBadRequest,
  );
  assert.throws(
    () => parseCalculationBody({ income: 1, period: "monthly", year: 2026.5 }),
    isBadRequest,
  );
  assert.throws(() => parseCalculationBody(null), isBadRequest);
});
