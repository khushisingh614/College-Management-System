const Attendance = require("../../models/Other/attendence.model.js");
const Student = require("../../models/Students/details.model.js");
const mongoose = require("mongoose");

// Function to send real-time updates via Socket.IO
const sendRealtimeAttendanceUpdate = (io, studentId, message) => {
  io.to(studentId.toString()).emit("attendanceUpdate", message);
};

// Mark Attendance
const markAttendance = async (req, res) => {
  try {
    const { studentId, subjectId, date, status, recordedBy } = req.body;
    const io = req.app.get("socketio");

    // Check if attendance already exists for the date
    const existingRecord = await Attendance.findOne({ studentId, subjectId, date });
    if (existingRecord) {
      return res.status(400).json({ error: "Attendance already marked for this date." });
    }

    const attendance = new Attendance({ studentId, subjectId, date, status, recordedBy });
    await attendance.save();

    // Send real-time attendance update to the student
    sendRealtimeAttendanceUpdate(io, studentId, { message: `Attendance marked as ${status}` });

    res.status(201).json({ message: "Attendance marked successfully", attendance });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark attendance" });
  }
};

// Fetch Attendance for a Student
const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    const attendanceRecords = await Attendance.find({ studentId })
      .populate("subjectId", "name")
      .sort({ date: -1 });

    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
};

// Fetch Subject-wise Attendance
const getSubjectAttendance = async (req, res) => {
  try {
    const { studentId, subjectId } = req.params;

    const attendanceRecords = await Attendance.find({ studentId, subjectId })
      .sort({ date: -1 });

    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subject attendance" });
  }
};

const correctAttendance = async (req, res) => {
    try {
      const { studentId, subjectId, date, newStatus } = req.body;
  
      const attendanceRecord = await Attendance.findOneAndUpdate(
        { studentId, subjectId, date },
        { status: newStatus },
        { new: true }
      );
  
      if (!attendanceRecord) {
        return res.status(404).json({ error: "Attendance record not found" });
      }
  
      res.json({ message: "Attendance updated", attendance: attendanceRecord });
    } catch (error) {
      res.status(500).json({ error: "Failed to update attendance" });
    }
  };
  

module.exports = { markAttendance, getStudentAttendance, getSubjectAttendance, correctAttendance };
