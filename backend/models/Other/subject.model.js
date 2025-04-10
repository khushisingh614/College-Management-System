const mongoose = require("mongoose");

const Subject = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  offering_branch: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty Detail'
  }
}, { timestamps: true });

module.exports = mongoose.model("Subject", Subject);