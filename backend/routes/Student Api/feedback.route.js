const router = require("express").Router();
const { submitFeedback, getAllFeedback, getFeedbackById } = require("../../controllers/Student/feedback.controller");

router.post("/submitFeedback", submitFeedback);
router.get("/getAllFeedback/:studentId", getAllFeedback);
router.get("/getFeedbackById/:feedbackId/:studentId", getFeedbackById);

module.exports = router;

