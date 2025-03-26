const mongoose = require("mongoose");

const CurriculumSchema  = new mongoose.Schema({
  faculty: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("Curriculum", CurriculumSchema);