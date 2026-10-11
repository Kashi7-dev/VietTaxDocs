const express = require("express");
const healthRoutes = require("./health.routes");
const taxTypesRoutes = require("./taxTypes.routes");
const issuingAgenciesRoutes = require("./issuingAgencies.routes");
const documentsRoutes = require("./documents.routes");
const authRoutes = require("./auth.routes");
const notificationsRoutes = require("./notifications.routes");
const taxCalculationsRoutes = require("./taxCalculations.routes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/tax-types", taxTypesRoutes);
router.use("/issuing-agencies", issuingAgenciesRoutes);
router.use("/documents", documentsRoutes);
router.use("/auth", authRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/tax-calculations", taxCalculationsRoutes);

module.exports = router;
