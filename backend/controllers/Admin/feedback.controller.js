const Feedback = require('../../models/Students/Feedback.model.js');

const createFeedback = async (req, res) => {
    try {
        const { adminId, professorId, semester, subject, questions } = req.body;
        // console.log(adminId, professorId, semester, subject, questions)
        if (!adminId || !professorId || !semester || !subject || !questions) {
            return res
                .status(400)
                .json({ success: false, message: "All Fields are required." });
        }
        
        const feedback = await Feedback.create({
            adminId: adminId,
            professorId: professorId,
            semester: parseInt(semester) || 0,
            subject: subject,
            questions: questions,
            feedbackData: []
        });

        if (!feedback) {
            return res.status(400).json({ success: false, message: "Feedback not created." });
        }
        res.status(200).json({ success: true, message: "Feedback created successfully!" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error while creating the feedback." });
    }
}

const getAllAdminFeedback = async (req, res) => {
    try {
        const adminId = req.params.adminId;
        const feedback = await Feedback.find({ adminId: adminId });
        if (!feedback) {
            return res.status(400).json({ success: false, message: "Feedback not found." });
        }
        res.status(200).json({ success: true, feedback });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error while fetching the feedback." });
    }
}

const deleteFeedback = async (req, res) => {
    try {
        const feedbackId = req.params.feedbackId;
        const feedback = await Feedback.findByIdAndDelete(feedbackId);
        if (!feedback) {
            return res.status(400).json({ success: false, message: "Feedback not found." });
        }
        res.status(200).json({ success: true, message: "Feedback deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error while deleting the feedback." });
    }
}

module.exports = { createFeedback, getAllAdminFeedback, deleteFeedback };