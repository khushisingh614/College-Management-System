const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin Detail', required: true },
    professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty Detail', required: true },
    semester: { type: Number, required: true },
    subject: { type: String, required: true },
    questions: [{ type: String, required: true }], // Array of questions
    feedbackData: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student Detail', required: true },
        ratings: [{ type: Number, min: 1, max: 5, required: true }], // Array of ratings for each question
        comments: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now }
      }
    ],
  },
  { timestamps: true }
);

const Feedback = mongoose.model('Feedback Detail', feedbackSchema);
module.exports = Feedback;
