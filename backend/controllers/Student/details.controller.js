const studentDetails = require("../../models/Students/details.model.js")
const nodemailer = require("nodemailer");
const Subject = require("../../models/Other/subject.model");

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Sender email
    pass: process.env.EMAIL_PASS, // App password
  },
});

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
        // Send OTP via email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: req.body.email, // Ensure email exists in user model
            subject: "Your Login Credentials",
            text: `Hello ${req.body.firstName} ${req.body.middleName} ${req.body.lastName},\n\nYour account has been created successfully!\n\nHere are your login credentials:\n\nLogin ID: ${req.body.enrollmentNo}\nPassword: ${req.body.enrollmentNo}\n\nPlease change your password after logging in for security reasons.\n\nBest Regards,\nAdmin`,
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Error sending Mail to student" });
            }
            res.json({
                success: true,
                message: "Mail sent to the student email with login credentials",
                enrollmentNo: req.body.enrollmentNo,
            });
        });


        const data = {
            success: true,
            message: "Student Details Added!",
            user,
        };
        res.json(data);
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

const getStudentsBySubject = async (req, res) => {
    try {
      const { subjectId } = req.params;
      let subject = await Subject.findOne({ _id : subjectId });
 
    // Find students who have this subjectId in their subjects array
    const students = await studentDetails.find({ branch: subject.offering_branch , semester : subject.semester }).select("firstName middleName lastName enrollmentNo");

      res.json({ success: true, students, message: "Students fetched successfully" });
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ success: false, message: "Failed to fetch students." });
    }
  };

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

module.exports = { getDetails,getStudentsBySubject, addDetails, updateDetails, deleteDetails, getCount }