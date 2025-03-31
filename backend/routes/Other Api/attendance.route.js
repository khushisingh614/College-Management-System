const express = require("express");
const { markAttendance, getAttendanceByStudent, getAttendanceBySubject } = require("../../controllers/Other/attendance.controller.js");

const router = express.Router();

router.post("/mark", markAttendance); // Mark attendance
router.get("/getAttendanceByStudent/:studentId", getAttendanceByStudent); // Get student's attendance
router.get("/getAttendanceBySubject/:subjectId", getAttendanceBySubject); // Get subject-wise attendance


module.exports = router;