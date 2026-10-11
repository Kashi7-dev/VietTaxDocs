const jwt = require("jsonwebtoken");
const HttpError = require("../utils/httpError");
const { jwtSecret } = require("../config/auth");

// Yêu cầu header "Authorization: Bearer <token>". Token hợp lệ thì gắn req.user = { id, role }.
module.exports = function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (!scheme || scheme.toLowerCase() !== "bearer" || !token) {
    return next(new HttpError(401, "Missing or malformed Authorization header"));
  }

  try {
    const payload = jwt.verify(token, jwtSecret, { algorithms: ["HS256"] });
    req.user = { id: Number(payload.sub), role: payload.role };
    return next();
  } catch (err) {
    return next(new HttpError(401, "Invalid or expired token"));
  }
};