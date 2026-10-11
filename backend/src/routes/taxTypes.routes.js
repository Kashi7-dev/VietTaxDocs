const express = require("express");
const controller = require("../controllers/taxTypes.controller");

const router = express.Router();

// GET /api/tax-types
router.get("/", controller.list);

module.exports = router;
