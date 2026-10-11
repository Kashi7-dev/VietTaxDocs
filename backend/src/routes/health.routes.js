const express = require("express");
const db = require("../config/db");

const router = express.Router();

// GET /api/health: server sống và nối được DB thì 200, ngược lại 503.
router.get("/", async (req, res) => {
  try {
    await db.raw("select 1");
    res.status(200).json({ status: "ok" });
  } catch (err) {
    // Chi tiết lỗi chỉ ghi vào log phía server, không gửi cho client.
    console.error("Health check thất bại:", err);
    res.status(503).json({ message: "Database unavailable" });
  }
});

module.exports = router;
