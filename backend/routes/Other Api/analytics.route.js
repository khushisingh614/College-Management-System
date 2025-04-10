const express = require("express");
const router = express.Router();
const {getGrade, getMarksDistribution} = require("../../controllers/Other/analytics.controller");

router.post("/get-marks", getMarksDistribution)
router.post("/get-grade", getGrade);

module.exports = router;