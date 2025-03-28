const router = require("express").Router();
const { submitFeedback, getAllFeedback, getFeedbackById } = require("../../controllers/Student/feedback.controller");

router.post("/submit", submitFeedback);
router.get("/getAll/:studentId", getAllFeedback);
// router.get("/getById/:feedbackId/:studentId", getFeedbackById);

module.exports = router;

