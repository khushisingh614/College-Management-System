const express = require("express");
const { markAttendance, getStudentAttendance, getSubjectAttendance, correctAttendance } = require("../../controllers/Other/attendence.controller.js");

const router = express.Router();

router.post("/mark", markAttendance); // Mark attendance
router.get("/attendance/:studentId", getStudentAttendance); // Get student's attendance
router.get("/attendance/:studentId/:subjectId", getSubjectAttendance); // Get subject-wise attendance
router.put("/attendance/correct", correctAttendance); // Correct Attendence

module.exports = router;
