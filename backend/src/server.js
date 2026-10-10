// Điểm khởi động: nạp biến môi trường TRƯỚC, rồi mới nạp app và mở cổng.
require("dotenv").config();

const app = require("./app");
const db = require("./config/db");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});

// Tắt gọn gàng: ngừng nhận request mới, đóng kết nối DB rồi mới thoát.
function shutdown(signal) {
  console.log(`Nhận tín hiệu ${signal}, đang tắt server...`);
  server.close(async () => {
    await db.destroy();
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
