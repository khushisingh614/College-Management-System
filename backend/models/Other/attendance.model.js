const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student Detail", required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["present", "absent"], required: true },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty Detail", required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Attendance", attendanceSchema);