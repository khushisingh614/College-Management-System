const FacultyAssignment = require("../../models/Other/facultyAssignments.model");
 const StudentAssignment = require("../../models/Other/studentAssignments.model");
 const Grade = require("../../models/Other/grade.model");
 const Marks = require("../../models/Other/marks.model");
 const mongoose = require("mongoose");

const getGrade = async (req, res) => {
     try {
        //console.log(req.body)
         const { studentId } = req.body;
         //console.log(req.body)
         if(!studentId) return res.json("null value");
         const submissions = await Grade.find({studentId});
         //console.log(submissions)
         if (submissions.length === 0) return res.json("Grades not available yet!");

         // Build array of { percentage, gradedAt } objects
         const gradeData = await Promise.all(
           submissions.map(async (submission) => {
             const assignment = await FacultyAssignment.findById(submission.assignmentId);
     
             if (!assignment || !assignment.totalPoints) return null;
     
             const percentage = (submission.grade / assignment.totalPoints) * 100;
     
             return {
               percentage: Number(percentage.toFixed(2)),
               gradedAt: submission.gradedAt,
               assignmentTitle: assignment.title || '',
             };
           })
         );
     
         // Filter out any nulls (failed lookups)
         const cleanedData = gradeData.filter((entry) => entry !== null);
         //console.log(cleanedData);
         return res.json(cleanedData);
     } catch (error) {
         res.status(500).json({ message: "Error fetching submissions", error });
     }
 };


const getMarksDistribution = async (req, res) => {
  try {
    const { enrollmentNo } = req.body;
    if (!enrollmentNo) return res.status(400).json({ message: "Student ID is required" });

    const latestEntry = await Marks.findOne({ enrollmentNo }).sort({ updatedAt: -1 }); // get latest update

    if (!latestEntry) return res.status(405).json({ message: "No marks found" });

    res.json({
      internal: latestEntry.internal || {},
      external: latestEntry.external || {}
    });
  } catch (err) {
    console.error("Error fetching marks distribution:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

 module.exports = {getGrade, getMarksDistribution };