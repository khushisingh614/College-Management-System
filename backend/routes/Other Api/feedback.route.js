const router = require("express").Router();
const { submitFeedback,
    getAllFeedback,
    getFeedbackById,
    createFeedback,
    deleteFeedback,
    getAllAdminFeedback } = require("../../controllers/Other/feedback.controller");



// for student
router.post("/submit", submitFeedback);
router.get("/getAll/:studentId", getAllFeedback);
// router.get("/getById/:feedbackId/:studentId", getFeedbackById);

// for admin
router.post("/create", createFeedback);
router.delete("/delete/:id", deleteFeedback);
router.get("/getAll/:adminId", getAllAdminFeedback);


module.exports = router;

