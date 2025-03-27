const express = require("express");
const { createNotice, updateNotice, deleteNotice, getNotices, getNotifications,getAllNotices } = require("../../controllers/Other/notice.controller.js");

const router = express.Router();

router.post("/add", createNotice); // Create notice & notify students
router.put("/update/:id", updateNotice); // Update notice
router.delete("/delete/:id", deleteNotice); // Delete notice
router.get("/getAllNotices/:adminId/:facultyId", getNotices); // Fetch all notices
router.get("/getAll", getAllNotices); // Fetch all notices for students
router.get("/notifications/:studentId", getNotifications); // Fetch notifications for a user

module.exports = router;
