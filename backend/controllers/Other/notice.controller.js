const { Notice, Notification } = require("../../models/Other/notice.model");
const Student = require("../../models/Students/details.model");
const mongoose = require("mongoose");

// Function to send real-time notifications via Socket.IO
const sendRealtimeNotification = (io, students, message) => {
  students.forEach(student => {
    if (student && student._id) {
      io.to(student._id.toString()).emit("newNotification", message);
    } else {
      console.error("Invalid student object:", student);
    }
  });
};

// Create Notice & Notify Students
const createNotice = async (req, res) => {
  try {
    const { title, content, issuedByAdmin, issuedByFaculty } = req.body;

    // Create the notice with Admin or Faculty reference
    const newNotice = await Notice.create({ title, content, issuedByAdmin, issuedByFaculty });

    // Fetch students and ensure `_id` exists
    // const students = await Student.find({}, "_id").lean();
    // if (!students || students.length === 0) {
    //   return res.status(404).json({ success: false, error: "No students found" });
    // }

    // Create notifications
    // const notifications = students.map(student => ({
    //   studentId: student._id.toString(),
    //   noticeId: newNotice._id.toString(),
    //   message: `New Notice: ${title}`,
    // }));
    // await Notification.insertMany(notifications);

    res.status(201).json({ success: true, message: "Notice created and students notified", notice: newNotice });
  } catch (error) {
    console.error("Error creating notice:", error);
    res.status(500).json({ success: false, error: "Failed to create notice" });
  }
};

// Update Notice
const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Update notice
    const updatedNotice = await Notice.findByIdAndUpdate(id, { title, content }, { new: true });

    if (!updatedNotice) {
      return res.status(404).json({ success: false, error: "Notice not found" });
    }

    res.json({ success: true, message: "Notice updated", notice: updatedNotice });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update notice" });
  }
};

// Delete Notice
const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the notice
    const deletedNotice = await Notice.findByIdAndDelete(id);
    if (!deletedNotice) {
      return res.status(404).json({ success: false, error: "Notice not found" });
    }

    // Remove related notifications
    await Notification.deleteMany({ noticeId: id });

    res.json({ success: true, message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete notice" });
  }
};

// Get All Notices (Admin or Faculty)
const getNotices = async (req, res) => {
  try {
    const { adminId, facultyId } = req.params;
    if (!adminId && !facultyId) {
      return res.status(400).json({ success: false, error: "Admin or Faculty ID is required" });
    }

    // Find notices by either Admin or Faculty
    const notices = await Notice.find({
      $or: [{ issuedByAdmin: adminId }, { issuedByFaculty: facultyId }],
    }).populate("issuedByAdmin", "firstName lastName email employeeId")
      .populate("issuedByFaculty", "firstName lastName email facultyId");

    res.status(200).json({ success: true, message: "Notices fetched successfully", notices });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch notices" });
  }
};

const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find({}).populate("issuedByAdmin", "firstName lastName email employeeId")
      .populate("issuedByFaculty", "firstName lastName email employeeId");

    res.status(200).json({ success: true, message: "Notices fetched successfully", notices });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch notices" });
  }
};
// Get Notifications for a Student
const getNotifications = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, error: "Invalid Student ID" });
    }

    const notifications = await Notification.find({ studentId })
      .populate("noticeId", "title content issuedByAdmin issuedByFaculty createdAt")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch notifications" });
  }
};

module.exports = { createNotice, updateNotice, deleteNotice, getNotices, getNotifications, getAllNotices };
