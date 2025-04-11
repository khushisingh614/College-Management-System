const mongoose = require("mongoose");

const quizPdfSchema = new mongoose.Schema({ 
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty Detail",
    required: true,
  },
  title: { type: String, required: true },
  branch: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("QuizPdf", quizPdfSchema);
