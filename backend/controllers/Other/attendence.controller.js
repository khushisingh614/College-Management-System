const Attendance = require("../../models/Other/attendence.model.js");
const Student = require("../../models/Students/details.model.js");

const mongoose = require("mongoose");

// Mark Attendance
const markAttendance = async (req, res) => {
  try {
    const { studentId, subjectId, date, status, recordedBy } = req.body.attendanceData;

    // ✅ Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(studentId) ||
      !mongoose.Types.ObjectId.isValid(subjectId) ||
      !mongoose.Types.ObjectId.isValid(recordedBy)) {
      return res.status(400).json({ success: false, message: "Invalid ObjectId format." });
    }

    // ✅ Check if attendance is already marked
    let existingRecord = await Attendance.findOne({ studentId, subjectId, date });

    if (existingRecord) {
      // ✅ Toggle attendance status (if already marked)
      existingRecord.status = existingRecord.status === "present" ? "absent" : "present";
      await existingRecord.save();
      return res.status(200).json({ success: true, message: "Attendance toggled successfully", attendance: existingRecord });
    }

    // ✅ Mark new attendance if not already recorded
    const attendance = new Attendance({ studentId, subjectId, date, status, recordedBy });
    await attendance.save();

    res.status(201).json({ success: true, message: "Attendance marked successfully", attendance });
  } catch (error) {
    console.error("Mark Attendance Error:", error);
    res.status(500).json({ success: false, message: "Failed to mark attendance." });
  }
};

// Fetch Attendance for a Student

const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Validate studentId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }

    // Fetch attendance records for the student
    const attendanceRecords = await Attendance.find({ studentId })
      .populate("subjectId", "name") // Fetch subject details
      .sort({ date: -1 });
    if (!attendanceRecords.length) {
      return res.status(404).json({ success: false, message: "No attendance records found" });
    }

    // Calculate attendance percentage subject-wise
    const subjectWiseAttendance = {};
    attendanceRecords.forEach((record) => {
      const subjectId = record.subjectId._id.toString();
    
      if (!subjectWiseAttendance[subjectId]) {
        subjectWiseAttendance[subjectId] = { present: 0, total: 0, subjectName: record.subjectId.name };
      }

      subjectWiseAttendance[subjectId].total++;
      if (record.status === "present") {
        subjectWiseAttendance[subjectId].present++;
      }
    });
    
    // Convert into response format
    const attendanceSummary = Object.keys(subjectWiseAttendance).map((subjectId) => {
      const data = subjectWiseAttendance[subjectId];
      return {
        subjectId,
        subjectName: data.subjectName,
        totalClasses: data.total,
        presentCount: data.present,
        attendancePercentage: ((data.present / data.total) * 100).toFixed(2),
      };
    });

    // Sort by attendance percentage (highest first)
    attendanceSummary.sort((a, b) => b.attendancePercentage - a.attendancePercentage);
    
    res.status(200).json({ success: true, attendanceSummary, message: "Attendance records fetched successfully" });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ success: false, message: "Failed to fetch attendance records" });
  }
};


const getSubjectAttendance = async (req, res) => {
  try {
    const { subjectId } = req.params;

    // Fetch all attendance records for the subject
    const attendanceRecords = await Attendance.find({ subjectId });

    // Group by studentId
    const studentAttendance = {};
    attendanceRecords.forEach((record) => {
      const { studentId, status } = record;

      if (!studentAttendance[studentId]) {
        studentAttendance[studentId] = { present: 0, total: 0 };
      }

      studentAttendance[studentId].total += 1;
      if (status === "present") {
        studentAttendance[studentId].present += 1;
      }
    });

    // Fetch student details and calculate percentage
    const students = await Student.find({ _id: { $in: Object.keys(studentAttendance) } }).select("enrollmentNo firstName middleName lastName");

    const formattedData = students.map((student) => {
      const attendance = studentAttendance[student._id] || { present: 0, total: 1 };
      const attendancePercentage = (attendance.present / attendance.total) * 100;

      return {
        studentId: student._id,
        enrollmentNo: student.enrollmentNo,
        firstName: student.firstName,
        lastName: student.lastName,
        attendancePercentage: attendancePercentage || 0,
      };
    });

    formattedData.sort((a, b) => b.attendancePercentage - a.attendancePercentage);

    res.json({ success: true, attendanceRecords: formattedData });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ success: false, message: "Failed to fetch attendance." });
  }
};



module.exports = { markAttendance, getStudentAttendance, getSubjectAttendance };
