const Feedback =  require('../../models/Students/Feedback.model.js');

// const submitFeedback = async (req, res) => {
//     try {
//         const { feedbackId, studentId, responses } = req.body;
//         if (!feedbackId || !studentId || !responses) {
//             return res
//                 .status(400)
//                 .json({ success: false, message: "All Fields are required." });
//         }
//         const feedback = await Feedback.findById(feedbackId);
//         if (!feedback) {
//             return res.status(400).json({ success: false, message: "Feedback not found." });
//         }
//         if(!responses || responses.length !== feedback.questions.length) {
//             return res.status(400).json({ success: false, message: "All questions are required." });
//         }
//         feedback.feedbackData.push({
//             studentId: studentId,
//             responses: responses,
//         });
//         await feedback.save();
//         res.status(200).json({ success: true, message: "Feedback submitted successfully!" });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Internal Server Error while submitting the feedback." });
//     }
// }


const getAllFeedback = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const feedbacks = await Feedback.find();
        if (!feedbacks) {
            return res.status(400).json({ success: false, message: "Feedback not found." });
        }

        let isSubmitted = false;
        let resultFeedbacks = {};

        feedbacks.forEach(feedback => {
            if (feedbacks.feedbackData && feedback.feedbackData.length > 0) {
                feedback.feedbackData.forEach(data => {
                    if (data.studentId === studentId) {
                        isSubmitted = true;
                        resultFeedbacks.isSubmitted = true;
                        resultFeedbacks = feedback;
                        delete resultFeedbacks.feedbackData;
                        resultFeedbacks.feedbackData.ratings = data.ratings;
                        resultFeedbacks.feedbackData.comments = data.comments;
                        resultFeedbacks.feedbackData.createdAt = data.createdAt;
                    } else {
                        resultFeedbacks.isSubmitted = false;
                        resultFeedbacks = feedback;
                        delete resultFeedbacks.feedbackData;
                        resultFeedbacks.feedbackData = {};
                    }
                });
            }
        });

        res.status(200).json({ success: true, resultFeedbacks });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error while fetching the feedback." });
    }
}

const getFeedbackById = async (req, res) => {
    try {
        const feedbackId = req.params.feedbackId;
        const studentId = req.params.studentId;
        const feedbackExists = await Feedback.findById(feedbackId);
        if (!feedbackExists) {
            return res.status(400).json({ success: false, message: "Feedback not found." });
        }
        const feedback =
            feedbackExists.feedbackData.find((data) => data.studentId === studentId);
        if (!feedback) {
            return res.status(400).json({ success: false, message: "Feedback not found." });
        }
        res.status(200).json({ success: true, feedback });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error while fetching the feedback." });
    }
}

const submitFeedback = async (req, res) => {
    try {
        const { feedbackId, studentId, responses } = req.body;

        if (!feedbackId || !studentId || !responses || !Array.isArray(responses)) {
            return res.status(400).json({ success: false, message: "All Fields are required." });
        }

        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) {
            return res.status(404).json({ success: false, message: "Feedback not found." });
        }

        if (responses.length !== feedback.questions.length) {
            return res.status(400).json({ success: false, message: "All questions must be answered." });
        }

        // Check if student has already submitted feedback
        const alreadySubmitted = feedback.feedbackData.some(data => data.studentId.toString() === studentId);
        if (alreadySubmitted) {
            return res.status(400).json({ success: false, message: "Feedback already submitted by this student." });
        }

        // Push the new feedback response
        feedback.feedbackData.push({
            studentId,
            responses: responses.map(resp => ({
                ratings: resp.ratings,
                comments: resp.comments || "",
                createdAt: new Date()
            }))
        });

        await feedback.save();

        res.status(200).json({ success: true, message: "Feedback submitted successfully!" });
    } catch (error) {
        console.error("Submit Feedback Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error while submitting the feedback." });
    }
};


module.exports = { submitFeedback, getAllFeedback, getFeedbackById };


// module.exports = { submitFeedback };
