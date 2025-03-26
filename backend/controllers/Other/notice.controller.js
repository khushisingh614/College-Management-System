const { Notice, Notification } = require("../../models/Other/notice.model");
const User = require("../../models/Students/details.model");
const mongoose = require("mongoose");

// Function to send real-time notifications via Socket.IO
const sendRealtimeNotification = (io, students, message) => {
  students.forEach(student => {
    io.to(student._id.toString()).emit("newNotification", message);
  });
};

// Create Notice & Notify Students
const createNotice = async (req, res) => {
  try {
    const { title, content, issuedBy } = req.body;
    const io = req.app.get("socketio"); // Get Socket.IO instance

    // Create the notice
    const newNotice = new Notice({ title, content, issuedBy });
    await newNotice.save();

    // Find all students
    const students = await User.find().select("_id");

    // Create notifications for each student
    const notifications = students.map(student => ({
      userId: student._id,
      noticeId: newNotice._id,
      message: `New Notice: ${title}`,
    }));

    // Insert all notifications at once
    await Notification.insertMany(notifications);

    // Send real-time notifications to students
    sendRealtimeNotification(io, students, { title, content });

    res.status(201).json({ message: "Notice created and students notified", notice: newNotice });
  } catch (error) {
    res.status(500).json({ error: "Failed to create notice" });
  }
};

// Update Notice
const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const io = req.app.get("socketio");

    // Update notice
    const updatedNotice = await Notice.findByIdAndUpdate(id, { title, content }, { new: true });

    if (!updatedNotice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    // Notify students about the update
    const students = await User.find().select("_id");
    sendRealtimeNotification(io, students, { title, content });

    res.json({ message: "Notice updated", notice: updatedNotice });
  } catch (error) {
    res.status(500).json({ error: "Failed to update notice" });
  }
};

// Delete Notice
const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const io = req.app.get("socketio");

    // Delete the notice
    const deletedNotice = await Notice.findByIdAndDelete(id);

    if (!deletedNotice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    // Remove related notifications
    await Notification.deleteMany({ noticeId: id });

    // Notify students about deletion
    // const students = await User.find().select("_id");
    // sendRealtimeNotification(io, students, { message: "A notice has been deleted" });

    res.json({ message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete notice" });
  }
};

// Get All Notices
const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().populate("issuedBy", "name");
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notices" });
  }
};

// Get Notifications for a User
const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const notifications = await Notification.find({ userId })
      .populate("noticeId", "title content issuedBy createdAt")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

module.exports = { createNotice, updateNotice, deleteNotice, getNotices, getNotifications };
