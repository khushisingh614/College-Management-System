const mongoose = require("mongoose");
 
 const gradeSchema = new mongoose.Schema({
   studentId: { type: Number, required: true }, // Enrollment Number
   assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
   grade: { type: Number, required: true },
   feedback: { type: String, default: "" },
   gradedAt: { type: Date, default: Date.now }
 });
 
 module.exports = mongoose.model("Grade", gradeSchema);