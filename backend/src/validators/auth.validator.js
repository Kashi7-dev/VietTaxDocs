const HttpError = require("../utils/httpError");
const { assertPlainObject, isEmail } = require("../utils/validators");

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function parseEmail(email) {
  if (typeof email !== "string" || !isEmail(email.trim())) {
    throw new HttpError(400, "email must be a valid email address");
  }
  return normalizeEmail(email);
}

function parseRegisterBody(body) {
  assertPlainObject(body);
  const { email, password, full_name: fullName } = body;

  const normalizedEmail = parseEmail(email);

  // bcrypt chỉ dùng tối đa 72 byte đầu của mật khẩu nên giới hạn ở đây.
  if (
    typeof password !== "string" ||
    password.length < 8 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    throw new HttpError(
      400,
      "password must be at least 8 characters and at most 72 bytes",
    );
  }

  if (
    typeof fullName !== "string" ||
    fullName.trim() === "" ||
    fullName.trim().length > 255
  ) {
    throw new HttpError(
      400,
      "full_name is required and must be at most 255 characters",
    );
  }

  return { email: normalizedEmail, password, fullName: fullName.trim() };
}

function parseLoginBody(body) {
  assertPlainObject(body);
  const { email, password } = body;

  const normalizedEmail = parseEmail(email);

  if (
    typeof password !== "string" ||
    password === "" ||
    password.length > 200
  ) {
    throw new HttpError(400, "password is required");
  }

  return { email: normalizedEmail, password };
}

module.exports = { parseRegisterBody, parseLoginBody };
