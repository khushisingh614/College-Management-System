const { default: mongoose } = require("mongoose");
const studentDetails = require("../../models/Students/details.model.js")
const fs = require("fs");

const getDetails = async (req, res) => {
    try {
        let user = await studentDetails.find(req.body);
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "No Student Found" });
        }
        const data = {
            success: true,
            message: "Student Details Found!",
            user,
        };
        res.json(data);
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const addDetails = async (req, res) => {
    try {
        let user = await studentDetails.findOne({
            enrollmentNo: req.body.enrollmentNo,
        });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Student With This Enrollment Already Exists",
            });
        }
        user = await studentDetails.create({ ...req.body, profile: req.file.filename });
        const data = {
            success: true,
            message: "Student Details Added!",
            user,
        };
        res.json(data);
        fs.unlink("./media/" + req.file.filename, (err) => {
            if (err) {
                console.error(err)
                return
            }
            console.log("File removed successfully")
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


const updateDetails = async (req, res) => {
    try {
        let user;
        if (req.file) {
            user = await studentDetails.findByIdAndUpdate(req.params.id, { ...req.body, profile: req.file.filename });
        } else {
            user = await studentDetails.findByIdAndUpdate(req.params.id, req.body);
        }
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No Student Found",
            });
        }
        const data = {
            success: true,
            message: "Updated Successfull!",
        };
        res.json(data);
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deleteDetails = async (req, res) => {
    let { id } = req.body;
    try {
        let user = await studentDetails.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No Student Found",
            });
        }
        const data = {
            success: true,
            message: "Deleted Successfull!",
        };
        res.json(data);
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getCount = async (req, res) => {
    try {
        let user = await studentDetails.count(req.body);
        const data = {
            success: true,
            message: "Count Successfull!",
            user,
        };
        res.json(data);
    } catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Internal Server Error", error });
    }
}

const getStudentsBySubject = async (req, res) => {
    try {
      const { subjectId } = req.params;
 
      const subjectObjectId = new mongoose.Types.ObjectId(subjectId);

    // Find students who have this subjectId in their subjects array
    const students = await studentDetails.find({ subjects: subjectObjectId }).select("firstName middleName lastName enrollmentNo");

      res.json({ success: true, students, message: "Students fetched successfully" });
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ success: false, message: "Failed to fetch students." });
    }
  };
  

const addSubjectToStudent = async (req, res) => {
    const { studentId, subjectId } = req.body;
    if (!studentId || !subjectId) {
        return res.status(400).json({ success: false, message: "Student ID and Subject ID are required" });
    }
    try {
        const student = await studentDetails.findByIdAndUpdate(studentId, { $push: { subjects: subjectId } }, { new: true });
        res.json({ success: true, message: "Subject Added to Student", student });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
}

module.exports = { getDetails, addDetails, updateDetails, deleteDetails, getCount, getStudentsBySubject, addSubjectToStudent }