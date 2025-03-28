const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  issuedByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin Detail" },
  issuedByFaculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty Detail" },

  createdAt: { type: Date, default: Date.now },
});

const notificationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student Detail", required: true },
  noticeId: { type: mongoose.Schema.Types.ObjectId, ref: "Notice", required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notice = mongoose.model("Notice", noticeSchema);
const Notification = mongoose.model("Notification", notificationSchema);

module.exports = { Notice, Notification };
