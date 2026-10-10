const express = require("express");
const healthRoutes = require("./health.routes");

const router = express.Router();

// Mỗi nhóm endpoint mới chỉ cần thêm một dòng require và một dòng router.use ở đây.
router.use("/health", healthRoutes);

module.exports = router;
