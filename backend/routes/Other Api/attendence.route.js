const express = require("express");
const { markAttendance, getStudentAttendance, getSubjectAttendance } = require("../../controllers/Other/attendence.controller.js");

const router = express.Router();

router.post("/mark", markAttendance); // Mark attendance
router.get("/getAttendanceByStudent/:studentId", getStudentAttendance); // Get student's attendance
router.get("/getAttendanceBySubject/:subjectId", getSubjectAttendance); // Get subject-wise attendance


module.exports = router;
