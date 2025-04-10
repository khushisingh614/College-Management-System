const express = require("express");
 const router = express.Router();
 const upload = require("../../middlewares/multer.middleware.js");
 const { getAssignments, getUpcomingAssignments, getCompletedAssignments, getPastDueAssignments, uploadAssignment , submitAssignment, getAssignmentSubmissions , assignGrade , getGrade} =  require("../../controllers/Other/assignment.controller");
 
 router.post("/assign-grade", express.json(), assignGrade);
 
 router.post("/get-grade", express.json(), getGrade);
 // Get all assignments
 router.get("/prof/:professorId", getAssignments);
 //router.get("/:branch/:semester", getAssignmentsfiltered);

 router.get("/upcoming/:branch/:semester/:enrollmentNo", getUpcomingAssignments);
 router.get("/completed/:enrollmentNo", getCompletedAssignments);
 router.get("/pastdue/:branch/:semester/:enrollmentNo", getPastDueAssignments);
 
 // Faculty uploads assignments (content + PDF)
 router.post("/upload", upload.single("assignments"), uploadAssignment);
 
 // Students upload answers for assignments
 router.post("/submit", upload.single("submitassignments"), submitAssignment);
 
 // Get submitted answers for an assignment
 router.get("/submit/:assignmentId", getAssignmentSubmissions);
 

 
 module.exports = router;