const express = require("express");
const authenticate = require("../middlewares/authenticate");
const controller = require("../controllers/notifications.controller");

const router = express.Router();

// authenticate chạy trước: không có token hợp lệ thì dừng ở 401, controller không được gọi.
router.get("/", authenticate, controller.list);

module.exports = router;
