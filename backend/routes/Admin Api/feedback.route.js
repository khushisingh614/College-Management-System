const router = require("express").Router();
const { createFeedback,  deleteFeedback, getAllAdminFeedback } = require("../../controllers/Admin/feedback.controller.js");


router.post("/createFeedback", createFeedback);
router.delete("/deleteFeedback/:id", deleteFeedback);
router.get("/getFeedback/:adminId", getAllAdminFeedback);

module.exports = router;