// Cấu hình xác thực. Yêu cầu dotenv đã được nạp trước (server.js làm việc này ở dòng đầu).
const secret = process.env.JWT_SECRET;

// Thiếu khóa bí mật thì dừng ngay lúc khởi động, không chạy với cấu hình yếu.
if (!secret || secret.length < 32) {
  throw new Error(
    "JWT_SECRET chưa được đặt hoặc quá ngắn (cần ít nhất 32 ký tự). Hãy đặt trong .env hoặc biến môi trường.",
  );
}

module.exports = {
  jwtSecret: secret,
  expiresInSeconds: Number(process.env.JWT_EXPIRES_IN) || 3600,
  bcryptRounds: 10,
};
