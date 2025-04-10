const mongoose = require('mongoose');

const branchSemForumSchema = new mongoose.Schema({
  branch: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String
}, { timestamps: true });

module.exports = mongoose.model('BranchSemForum', branchSemForumSchema);


