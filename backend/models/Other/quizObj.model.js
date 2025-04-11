const mongoose = require("mongoose");

const quizObjSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuizPdf",
    required: true
  },  
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
  question: {
    type: String,
    required: true,
  },
  options: {
    type: Object,
    of: String,
    required: true
  },
  answer: {
    type: Object,
    of: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  }
}, { timestamps: true });


module.exports = mongoose.model("QuizObj", quizObjSchema);
