// Express nhận ra middleware xử lý lỗi nhờ có ĐÚNG 4 tham số, dù không dùng "next".
module.exports = (err, req, res, next) => {
  // Response đã bắt đầu gửi thì không thể gửi lại, giao cho handler mặc định.
  if (res.headersSent) {
    return next(err);
  }

  console.error(err);

  const status = err.status || err.statusCode || 500;

  // Lỗi 5xx: che nội dung thật. Lỗi 4xx: thông báo mang tính hướng dẫn nên trả về.
  const message = status >= 500 ? "Internal server error" : err.message;

  res.status(status).json({ message });
};
