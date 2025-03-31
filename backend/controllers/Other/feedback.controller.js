// const Feedback = require('../../models/Other/feedback.model.js');

// // for admin
// const createFeedback = async (req, res) => {
//     try {
//         const { adminId, professorId, semester, subject, questions } = req.body;
//         // console.log(adminId, professorId, semester, subject, questions)
//         if (!adminId || !professorId || !semester || !subject || !questions) {
//             return res
//                 .status(400)
//                 .json({ success: false, message: "All Fields are required." });
//         }
        
//         const feedback = await Feedback.create({
//             adminId: adminId,
//             professorId: professorId,
//             semester: parseInt(semester) || 0,
//             subject: subject,
//             questions: questions,
//             feedbackData: []
//         });

//         if (!feedback) {
//             return res.status(400).json({ success: false, message: "Feedback not created." });
//         }
//         res.status(200).json({ success: true, message: "Feedback created successfully!" });
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ success: false, message: "Internal Server Error while creating the feedback." });
//     }
// }

// const getAllAdminFeedback = async (req, res) => {
//     try {
//         const adminId = req.params.adminId;
       
//         if (!adminId) {
//             return res.status(400).json({ success: false, message: "Admin ID is required." });
//         }
//         const feedbacks = await Feedback.find({ adminId });
//         // if (!feedbacks) {
//         //     return res.status(400).json({ success: false, message: "Feedback not found." });
//         // }
//         res.status(200).json({ success: true, feedbacks });
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ success: false, message: "Internal Server Error while fetching the feedback." });
//     }
// }

// const deleteFeedback = async (req, res) => {
//     try {
//         const feedbackId = req.params.feedbackId;
//         const feedback = await Feedback.findByIdAndDelete(feedbackId);
//         if (!feedback) {
//             return res.status(400).json({ success: false, message: "Feedback not found." });
//         }
//         res.status(200).json({ success: true, message: "Feedback deleted successfully!" });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Internal Server Error while deleting the feedback." });
//     }
// }

// // for students
// const getAllFeedback = async (req, res) => {
//     try {
//         const studentId = req.params.studentId;
        
//         // Fetch all feedback forms and populate professor & admin details
//         const feedbacks = await Feedback.find()
//             .populate("professorId", "firstName lastName")
//             .populate("adminId", "firstName lastName");

//         if (!feedbacks || feedbacks.length === 0) {
//             return res.status(404).json({ success: false, message: "No feedback forms found." });
//         }

//         // Process feedback forms for the student
//         const feedbackForms = feedbacks.map(feedback => {
//             const studentFeedbackData = feedback.feedbackData?.find(data => data.studentId.toString() === studentId);
            
//             return {
//                 _id: feedback._id,
//                 subject: feedback.subject,
//                 semester: feedback.semester,
//                 isSubmitted: !!studentFeedbackData, // True if student has responded
//                 professor: feedback.professorId ? {
//                     firstName: feedback.professorId.firstName,
//                     lastName: feedback.professorId.lastName
//                 } : null,
//                 questions: feedback.questions || [], // Ensure questions are always sent
//                 admin: feedback.adminId ? {
//                     firstName: feedback.adminId.firstName,
//                     lastName: feedback.adminId.lastName
//                 } : null,
//                 feedbackData: studentFeedbackData
//                     ? {
//                         ratings: studentFeedbackData.ratings,
//                         comments: studentFeedbackData.comments,
//                         createdAt: studentFeedbackData.createdAt,
//                     }
//                     : null, // If not submitted, keep feedbackData null
//             };
//         });

//         res.status(200).json({ 
//             success: true, 
//             feedbackForms 
//         });
//     } catch (error) {
//         console.error("Error fetching feedback:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error while fetching feedback." });
//     }
// };



// const getFeedbackById = async (req, res) => {
//     try {
//         const feedbackId = req.params.feedbackId;
//         const studentId = req.params.studentId;
//         const feedbackExists = await Feedback.findById(feedbackId);
//         if (!feedbackExists) {
//             return res.status(400).json({ success: false, message: "Feedback not found." });
//         }
//         const feedback =
//             feedbackExists.feedbackData.find((data) => data.studentId === studentId);
//         if (!feedback) {
//             return res.status(400).json({ success: false, message: "Feedback not found." });
//         }
//         res.status(200).json({ success: true, feedback });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Internal Server Error while fetching the feedback." });
//     }
// }

// const submitFeedback = async (req, res) => {
//     try {
//         const { feedbackId } = req.params;
//         const { studentId, responses, comments } = req.body;

//         if (!feedbackId || !studentId || !responses || !Array.isArray(responses)) {
//             return res.status(400).json({ success: false, message: "All Fields are required." });
//         }

//         const feedback = await Feedback.findById(feedbackId);
//         if (!feedback) {
//             return res.status(404).json({ success: false, message: "Feedback not found." });
//         }

//         if (responses.length !== feedback.questions.length) {
//             return res.status(400).json({ success: false, message: "All questions must be answered." });
//         }

//         // Check if student already submitted feedback
//         const existingFeedback = feedback.feedbackData.find(data => data.studentId.toString() === studentId);
//         if (existingFeedback) {
//             return res.status(400).json({ success: false, message: "Feedback already submitted by this student." });
//         }

//         // Store feedback properly
//         feedback.feedbackData.push({
//             studentId,
//             ratings: responses, // Now correctly stored as an array
//             comments: comments || "", // Store comments separately
//             createdAt: new Date()
//         });

//         await feedback.save();

//         res.status(200).json({ success: true, message: "Feedback submitted successfully!" });
//     } catch (error) {
//         console.error("Submit Feedback Error:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error while submitting the feedback." });
//     }
// };



// module.exports = { createFeedback, getAllAdminFeedback, deleteFeedback, submitFeedback, getAllFeedback, getFeedbackById };