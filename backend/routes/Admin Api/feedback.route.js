const router = require("express").Router();
const { createFeedback,  deleteFeedback, getAllAdminFeedback } = require("../../controllers/Admin/feedback.controller.js");


router.post("/create", createFeedback);
router.delete("/delete/:id", deleteFeedback);
router.get("/getAll/:adminId", getAllAdminFeedback);

module.exports = router;