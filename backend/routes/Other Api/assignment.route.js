const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/multer.middleware");
const assignmentController = require("../../controllers/Other/assignment.controller");

// Get all assignments
router.get("/", assignmentController.getAssignments);

// Faculty uploads assignments (content + PDF)
router.post("/upload", upload.single("file"), assignmentController.uploadAssignment);

// Students upload answers for assignments
router.post("/submit", upload.single("file"), assignmentController.submitAssignment);

// Get submitted answers for an assignment
router.get("/submit/:assignmentId", assignmentController.getAssignmentSubmissions);

router.post("/assign-grade", assignmentController.assignGrade);

router.post("/get-grade", assignmentController.getGrade);

module.exports = router;

