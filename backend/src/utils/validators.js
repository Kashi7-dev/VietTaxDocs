const HttpError = require("./httpError");

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertPlainObject(
  value,
  message = "Request body must be a JSON object",
) {
  if (!isPlainObject(value)) {
    throw new HttpError(400, message);
  }
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function isEmail(value) {
  return (
    typeof value === "string" &&
    value.length <= 255 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

// Số nguyên dương lấy từ URL hoặc query string (luôn là chuỗi).
function parseIntParam(
  value,
  name,
  { min = 1, max = 2147483647, defaultValue } = {},
) {
  if (value === undefined || value === "") {
    if (defaultValue !== undefined) return defaultValue;
    throw new HttpError(400, `${name} is required`);
  }
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    throw new HttpError(400, `${name} must be an integer`);
  }
  const number = Number(value);
  if (number < min || number > max) {
    throw new HttpError(400, `${name} must be between ${min} and ${max}`);
  }
  return number;
}

// Chuỗi tùy chọn trong query string: không có hoặc rỗng thì trả undefined.
function parseOptionalString(value, name, maxLength) {
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    throw new HttpError(400, `${name} must be a string`);
  }
  const trimmed = value.trim();
  if (trimmed === "") return undefined;
  if (trimmed.length > maxLength) {
    throw new HttpError(400, `${name} must be at most ${maxLength} characters`);
  }
  return trimmed;
}

module.exports = {
  isPlainObject,
  assertPlainObject,
  isFiniteNumber,
  isEmail,
  parseIntParam,
  parseOptionalString,
};
