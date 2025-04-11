const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "questionModel"  // this tells Mongoose where to look for the model name
  },
  questionModel: {
    type: String,
    required: true,
    enum: ["QuizObj", "QuizSubj"]  // only allow these two models
  },
  selectedOption: String,        // For MCQs
  subjAnswer: String,      // For Subjective
  pointsAwarded: {
    type: Number,
    default: 0,
  }
});

const studentQuizResponseSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student Detail",
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizPdf",
      required: true,
    },
    responses: [responseSchema],
    totalScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentQuizResponse", studentQuizResponseSchema);
