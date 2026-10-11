const express = require("express");
const healthRoutes = require("./health.routes");

const router = express.Router();

const taxTypesRoutes = require("./taxTypes.routes");
router.use("/tax-types", taxTypesRoutes);

const issuingAgenciesRoutes = require("./issuingAgencies.routes");
router.use("/issuing-agencies", issuingAgenciesRoutes);

// Mỗi nhóm endpoint mới chỉ cần thêm một dòng require và một dòng router.use ở đây.
router.use("/health", healthRoutes);

module.exports = router;
