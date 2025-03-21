const express = require("express");
const router = express.Router();
const { loginHandler, verifyOtpHandler, registerHandler, updateHandler, deleteHandler } = require("../../controllers/Admin/credential.controller.js");

router.post("/login", loginHandler);

router.post("/verify-otp", verifyOtpHandler);

router.post("/register", registerHandler);

router.put("/update/:id", updateHandler);

router.delete("/delete/:id", deleteHandler);

module.exports = router;
