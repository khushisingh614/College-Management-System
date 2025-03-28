const mongoose = require("mongoose");

const facultyAssignment = new mongoose.Schema({
  professorId: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  totalPoints: { type: Number, required: true },
  deadline: { type: Date, required: true },
  file: { type: String }, // Filename
  filePath: { type: String }, // Path to file storage
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FacultyAssignment", facultyAssignment, "facultyAssignments");
