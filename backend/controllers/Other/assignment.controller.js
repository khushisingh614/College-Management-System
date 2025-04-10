const FacultyAssignment = require("../../models/Other/facultyAssignments.model");
 const StudentAssignment = require("../../models/Other/studentAssignments.model");
 const Grade = require("../../models/Other/grade.model");
 const mongoose = require("mongoose"); 
 
 // Get all assignments (for faculty)
 const getAssignments = async (req, res) => {
    const professorId = req.params.professorId;
    console.log(professorId);
     try {
         const assignments = await FacultyAssignment.find({"professorId": Number(professorId)}).sort({ branch: 1, semester: 1 });
         res.status(200).json(assignments);
     } catch (error) {
         res.status(500).json({ message: "Error fetching assignments", error });
     }
 };



 /*const getAssignmentsfiltered = async (req, res) => {
  const { branch, semester } = req.params;

  try {
    const assignments = await FacultyAssignment.find({
      branch,
      semester: Number(semester)
    }).sort({ deadline: 1 }); 

    res.status(200).json(assignments);
  } catch (err) {
    console.error("Error fetching assignments:", err);
    res.status(500).json({ error: "Server error while fetching assignments" });
  }
};*/

const getUpcomingAssignments = async (req, res) => {
    const { branch, semester, enrollmentNo } = req.params;
    try {
      const allAssignments = await FacultyAssignment.find({
        branch,
        semester: Number(semester),
        deadline: { $gte: new Date() }, // Deadline not passed
      });
  
      const submitted = await StudentAssignment.find({ enrollmentNo });

      const submittedIds = submitted.length > 0
        ? new Set(submitted.map(s => s.assignmentId.toString()))
        : new Set();  
  
      const upcomingAssignments = allAssignments.filter(
        (assignment) => !submittedIds.has(assignment._id.toString())
      );
  
      res.status(200).json(upcomingAssignments);
    } catch (err) {
      console.error("Error fetching upcoming assignments:", err);
      res.status(500).json({ error: "Server error while fetching upcoming assignments" });
    }
  };
  
  const getCompletedAssignments = async (req, res) => {
    const { enrollmentNo } = req.params;
  
    try {
      const submissions = await StudentAssignment.find({ "enrollmentNo" : Number(enrollmentNo) }).populate("assignmentId");
      //console.log("Submissions found:", submissions);

      const completed = submissions.map(s => s.assignmentId);
  
      res.status(200).json(completed);
    } catch (err) {
      console.error("Error fetching completed assignments:", err);
      res.status(500).json({ error: "Server error while fetching completed assignments" });
    }
  };
    
  const getPastDueAssignments = async (req, res) => {
    const { branch, semester, enrollmentNo } = req.params;
    //console.log(enrollmentNo)
    try {
      const expiredAssignments = await FacultyAssignment.find({
        branch,
        semester: Number(semester),
        deadline: { $lt: new Date() }
      });
  
      const submissions = await StudentAssignment.find({ enrollmentNo });
  
      const submittedIds = new Set(submissions.map(s => s.assignmentId.toString()));
      
      const pastDue = expiredAssignments.filter(
        assignment => !submittedIds.has(assignment._id.toString())
      );
  
      res.status(200).json(pastDue);
    } catch (err) {
      console.error("Error fetching past due assignments:", err);
      res.status(500).json({ error: "Server error while fetching past due assignments" });
    }
  };
  
  
  
 
 // Faculty uploads an assignment
 const uploadAssignment = async (req, res) => {
     try {
         //console.log("Received FormData:", req.body);
 
         const {
             professorId,
             title,
             branch,
             semester,
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
         const parsedBranch = String(branch || "").trim();
         const parsedSem = String(semester|| "").trim();
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

        if (!parsedBranch) {
            return res.status(400).json({ message: "Branch is required." });
        }
        if (!parsedSem) {
            return res.status(400).json({ message: "Semester is required." });
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
             branch: parsedBranch,
             semester: parsedSem,
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
         const existingSubmission = await StudentAssignment.findOne({
            enrollmentNo: Number(enrollmentNo),
            assignmentId: assignmentId
        });
        let assignment =  new mongoose.Types.ObjectId(assignmentId); // check if it throws
        //console.log(assignment);
        if (existingSubmission) {
            return res.status(201).json({ message: "Assignment already submitted. You can submit only once." });
        }
        const newSubmission = new StudentAssignment({
            enrollmentNo: Number(enrollmentNo) || null, // Default to null if missing
            studentName: studentName || null,
            assignmentId:  assignment || null,
            filename: req.file ? req.file.filename : null, // Ensure file exists
            filePath: req.file ? `${req.file.filename}` : null, // Ensure file path exists
            deadline: deadline ? new Date(deadline) : null, // Convert to Date
        });

        await newSubmission.save();
        res.status(201).json({ message: "Assignment submitted successfully" });
    } 
    catch (error) {
         res.status(500).json({ message: "Error submitting assignment", error });
    }
 };
 
 
 // Get all submissions for a particular assignment
 const getAssignmentSubmissions = async (req, res) => {
     try {
         const { assignmentId } = req.params
         // Fetch all grades with the same assignmentId
        const gradedEntries = await Grade.find({ assignmentId });
        //console.log(gradedEntries)
        // Extract the studentIds that already have grades
        const gradedStudentIds = gradedEntries.map(entry => entry.studentId);
        //console.log(gradedStudentIds)
        // Fetch submissions that are NOT graded
        const submissions = await StudentAssignment.find({
            assignmentId,
            enrollmentNo: { $nin: gradedStudentIds }
        });
        //console.log(submissions)
        res.json(submissions);
     } catch (error) {
         res.status(500).json({ message: "Error fetching submissions", error });
     }
 };
 
 const assignGrade = async (req, res) => {
     try {
            //console.log(req.body);
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
        //console.log(req.body)
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


 module.exports = { getAssignments, getUpcomingAssignments, getCompletedAssignments, getPastDueAssignments, uploadAssignment , submitAssignment, getAssignmentSubmissions , assignGrade , getGrade};