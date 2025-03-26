const express = require("express");
const { createNotice, updateNotice, deleteNotice, getNotices, getNotifications } = require("../../controllers/Other/notice.controller.js");

const router = express.Router();

router.post("/notices", createNotice); // Create notice & notify students
router.put("/notices/:id", updateNotice); // Update notice
router.delete("/notices/:id", deleteNotice); // Delete notice
router.get("/notices", getNotices); // Fetch all notices
router.get("/notifications/:userId", getNotifications); // Fetch notifications for a user

module.exports = router;
