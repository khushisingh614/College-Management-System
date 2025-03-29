const express = require("express");
const { notifysecurity } = require("../../controllers/Other/notifysecurity.controller");
const router = express.Router();

router.post("/", notifysecurity);

module.exports = router;