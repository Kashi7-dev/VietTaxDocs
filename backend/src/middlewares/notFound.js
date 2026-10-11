// Chạy khi không route nào khớp. Phải được gắn SAU tất cả routes.
module.exports = (req, res, next) => {
  res
    .status(404)
    .json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};
