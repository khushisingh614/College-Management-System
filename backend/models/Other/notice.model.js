const mongoose = require("mongoose");

const Notice = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  forwhom: {
    type: String,
  },
  link: {
    type: String,
  },
  branch: {
    type: [String],
    required: true,
  },
  semester: {
    type: [Number],
  }
}, { timestamps: true });

module.exports = mongoose.model("Notice", Notice);