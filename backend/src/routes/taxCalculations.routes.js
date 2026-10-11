const express = require("express");
const controller = require("../controllers/taxCalculations.controller");

const router = express.Router();

router.post("/", controller.calculate);

module.exports = router;
