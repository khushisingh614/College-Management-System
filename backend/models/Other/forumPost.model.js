// models/ForumPost.js
const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
  forumType: {
    type: String,
    enum: ['SubjectForum', 'BranchSemForum'], // should match model names
    required: true
  },
  forumId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'forumType'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'authorModel',
    required: true
  },
  authorModel: {
    type: String,
    enum: ['Student Detail', 'Faculty Detail'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  isPinned: {
    type: Boolean,
    default: false
  }  
}, { timestamps: true });

module.exports = mongoose.model('ForumPost', forumPostSchema);

