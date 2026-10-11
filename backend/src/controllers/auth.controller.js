const authService = require("../services/auth.service");
const {
  parseRegisterBody,
  parseLoginBody,
} = require("../validators/auth.validator");

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const input = parseRegisterBody(req.body);
    const user = await authService.register(input);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const input = parseLoginBody(req.body);
    const result = await authService.login(input);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
