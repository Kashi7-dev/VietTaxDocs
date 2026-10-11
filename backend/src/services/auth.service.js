const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const HttpError = require("../utils/httpError");
const { jwtSecret, expiresInSeconds, bcryptRounds } = require("../config/auth");

const PUBLIC_COLUMNS = ["id", "email", "full_name", "role", "created_at"];

// Băm sẵn một mật khẩu giả: khi email không tồn tại vẫn phải so sánh một lần,
// để thời gian phản hồi giống khi email tồn tại, kẻ tấn công không dò được email nào đã đăng ký.
const DUMMY_HASH = bcrypt.hashSync("dummy-password-for-timing", bcryptRounds);

// Không bao giờ trả password_hash ra ngoài.
function toPublicUser(user) {
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    created_at: user.created_at,
  };
}

async function register({ email, password, fullName }) {
  const passwordHash = await bcrypt.hash(password, bcryptRounds);

  try {
    const [user] = await db("users")
      .insert({ email, password_hash: passwordHash, full_name: fullName })
      .returning(PUBLIC_COLUMNS);
    return user;
  } catch (err) {
    // 23505 = vi phạm ràng buộc UNIQUE (email đã tồn tại)
    if (err.code === "23505") {
      throw new HttpError(409, "Email already registered");
    }
    throw err;
  }
}

async function login({ email, password }) {
  const user = await db("users").whereRaw("lower(email) = ?", [email]).first();

  const passwordMatches = await bcrypt.compare(
    password,
    user ? user.password_hash : DUMMY_HASH,
  );

  // Cùng một thông báo cho cả "sai email" và "sai mật khẩu".
  if (!user || !passwordMatches) {
    throw new HttpError(401, "Invalid email or password");
  }

  const accessToken = jwt.sign({ role: user.role }, jwtSecret, {
    algorithm: "HS256",
    subject: String(user.id),
    expiresIn: expiresInSeconds,
  });

  return {
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: expiresInSeconds,
    user_information: toPublicUser(user),
  };
}

module.exports = { register, login };
