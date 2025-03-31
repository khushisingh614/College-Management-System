const express = require("express");
 const router = express.Router();
 const upload = require("../../middlewares/multer.middleware.js");
 const { getAssignments, uploadAssignment , submitAssignment, getAssignmentSubmissions , assignGrade , getGrade} =  require("../../controllers/Other/assignment.controller");
 
 // Get all assignments
 router.get("/", getAssignments);
 
 // Faculty uploads assignments (content + PDF)
 router.post("/upload", upload.single("assignments"), uploadAssignment);
 
 // Students upload answers for assignments
 router.post("/submit", upload.single("submitassignments"), submitAssignment);
 
 // Get submitted answers for an assignment
 router.get("/submit/:assignmentId", getAssignmentSubmissions);
 
 router.post("/assign-grade", assignGrade);
 
 router.post("/get-grade", getGrade);
 
 module.exports = router;