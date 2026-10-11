// Lỗi kèm mã HTTP. errorHandler dùng "status" làm mã trả về
// và gửi "message" cho client với lỗi 4xx.
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

module.exports = HttpError;
