const mongoose = require("mongoose");

const facultyCredential = new mongoose.Schema({
  loginid: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  dynamic_salt: { 
    type: String, 
    required: true 
  },
  temporary_password: {
    type: String,
    default: null,
  },
  temporary_password_expires_at: {
    type: Date,
    default: null,
    expires: 3600,
  }

}, { timestamps: true });

module.exports = mongoose.model("Faculty Credential", facultyCredential);