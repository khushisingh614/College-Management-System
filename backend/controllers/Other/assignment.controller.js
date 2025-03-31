const FacultyAssignment = require("../../models/Other/facultyAssignments.model");
 const StudentAssignment = require("../../models/Other/studentAssignments.model");
 const Grade = require("../../models/Other/grade.model");
 const mongoose = require("mongoose"); 
 
 // Get all assignments (for students & faculty)
 const getAssignments = async (req, res) => {
     try {
         const assignments = await FacultyAssignment.find();
         //console.log(assignments)
         res.status(200).json(assignments);
     } catch (error) {
         res.status(500).json({ message: "Error fetching assignments", error });
     }
 };
 
 // Faculty uploads an assignment
 const uploadAssignment = async (req, res) => {
     try {
         console.log("Received FormData:", req.body);
 
         const {
             professorId,
             title,
             description,
             subject,
             totalPoints,
             deadline
         } = req.body;
         
         // Explicitly convert professorId to a number
         const parsedProfessorId = professorId ? Number(professorId) : null;
         if (!parsedProfessorId || isNaN(parsedProfessorId)) {
             return res.status(400).json({ message: "Invalid professorId. Must be a number." });
         }
         // Explicit typecasting
         //const parsedProfessorId = professorId ? new mongoose.Types.ObjectId(professorId) : null;
         const parsedTitle = String(title || "").trim();
         const parsedDescription = String(description || "").trim();
         const parsedSubject = String(subject || "").trim();
         const parsedTotalPoints = totalPoints ? Number(totalPoints) : null;
         const parsedDeadline = deadline ? new Date(deadline) : null;
 
         // Validation checks
         if (!parsedProfessorId) {
             return res.status(400).json({ message: "Invalid professorId format." });
         }
 
         if (!parsedTitle) {
             return res.status(400).json({ message: "Title is required." });
         }
 
         if (!parsedSubject) {
             return res.status(400).json({ message: "Subject is required." });
         }
 
         if (!parsedTotalPoints || isNaN(parsedTotalPoints)) {
             return res.status(400).json({ message: "totalPoints must be a valid number." });
         }
 
         if (!parsedDeadline || isNaN(parsedDeadline.getTime())) {
             return res.status(400).json({ message: "Invalid date format for deadline." });
         }
 
         // Create assignment object
         const newAssignment = new FacultyAssignment({
             professorId: parsedProfessorId,
             title: parsedTitle,
             description: parsedDescription,
             subject: parsedSubject,
             totalPoints: parsedTotalPoints,
             deadline: parsedDeadline,
             file: req.file?.filename || null,
             filePath: req.file ? `${req.file.filename}` : null 
         });
 
         // Save to DB
         await newAssignment.save();
 
         res.status(201).json({
             message: "Assignment uploaded successfully",
             assignment: newAssignment
         });
 
     } catch (error) {
         console.error("Error uploading assignment:", error);
         res.status(500).json({ message: "Error uploading assignment", error });
     }
 };
 
 
 // Student submits an assignment
 const submitAssignment = async (req, res) => {
     try {
         //console.log(req.body)
         const { studentName, enrollmentNo, assignmentId, deadline} = req.body;
         const newSubmission = new StudentAssignment({
             enrollmentNo: Number(enrollmentNo) || null, // Default to null if missing
             studentName: studentName || null,
             assignmentId: assignmentId || null,
             filename: req.file ? req.file.filename : null, // Ensure file exists
             filePath: req.file ? `${req.file.filename}` : null, // Ensure file path exists
             deadline: deadline ? new Date(deadline) : null, // Convert to Date
         });
 
         await newSubmission.save();
         res.status(201).json({ message: "Assignment submitted successfully", submissionId: newSubmission.enrollmentNo });
     } catch (error) {
         res.status(500).json({ message: "Error submitting assignment", error });
     }
 };
 
 
 // Get all submissions for a particular assignment
 const getAssignmentSubmissions = async (req, res) => {
     try {
         const { assignmentId } = req.params
         const submissions = await StudentAssignment.find({ assignmentId });
         //console.log(submissions)
         res.json(submissions);
     } catch (error) {
         res.status(500).json({ message: "Error fetching submissions", error });
     }
 };
 
 const assignGrade = async (req, res) => {
     try {
         const { grades } = req.body;
 
         if (!grades || grades.length === 0) {
             return res.status(400).json({ message: "No grades provided" });
         }
 
         const insertedGrades = await Grade.insertMany(grades);
         res.status(201).json({ message: "Grades submitted successfully", insertedGrades });
     } catch (error) {
         console.error("Error submitting grades:", error);
         res.status(500).json({ message: "Error submitting grades", error });
     }
 };
 
 // Get all submissions for a particular assignment
 const getGrade = async (req, res) => {
     try {
         const { studentId, assignmentId} = req.body;
         //console.log(req.body)
         if(!studentId || !assignmentId) return res.json("null value");
         const submissions = await Grade.find({studentId, assignmentId });
         //console.log(submissions)
         if (submissions.length === 0) return res.json("Grades not available yet!");
         return res.json(submissions[0]);
     } catch (error) {
         res.status(500).json({ message: "Error fetching submissions", error });
     }
 };


 module.exports = { getAssignments, uploadAssignment , submitAssignment, getAssignmentSubmissions , assignGrade , getGrade};