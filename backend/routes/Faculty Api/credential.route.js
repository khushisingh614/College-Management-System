const express = require("express");
const { loginHandler, verifyOtpHandler, registerHandler, updateHandler, deleteHandler } = require("../../controllers/Faculty/credential.controller.js");
const router = express.Router();

router.post("/login", loginHandler);

router.post("/verify-otp", verifyOtpHandler);

router.post("/register", registerHandler);

router.put("/update/:id", updateHandler);

router.delete("/delete/:id", deleteHandler);

module.exports = router;
