const mongoose = require("mongoose");
 
 const studentAssignments = new mongoose.Schema({
   enrollmentNo: { type: Number, required: true },
   studentName: { type: String, required: true },
   assignmentId: {type: mongoose.Schema.Types.ObjectId, ref: "facultyAssignments", required: true},
   filename: { type: String, required: true },
   filePath: { type: String, required: true },
   deadline: { type: Date, required: true }, 
   submittedAt: { type: Date, default: Date.now }, 
 });
 
 module.exports = mongoose.model("studentAssignment", studentAssignments);