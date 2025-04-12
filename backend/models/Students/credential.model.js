const mongoose = require("mongoose");

const studentCredential = new mongoose.Schema({
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
  primaryDeviceId: { 
    type: String, 
    default: null 
  }
}, { timestamps: true });

module.exports = mongoose.model("Student Credential", studentCredential);