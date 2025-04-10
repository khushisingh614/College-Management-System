const mongoose = require("mongoose");

const subjectForumSchema = new mongoose.Schema({
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      unique: true
    },
    description: String
  }, { timestamps: true });
  
  module.exports = mongoose.model('SubjectForum', subjectForumSchema);
  