const facultyDetails = require("../../models/Faculty/details.model.js")
const nodemailer = require("nodemailer");

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
        let user = await facultyDetails.find(req.body);
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "No Faculty Found" });
        }
        const data = {
            success: true,
            message: "Faculty Details Found!",
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
        let user = await facultyDetails.findOne({ employeeId: req.body.employeeId });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Faculty With This EmployeeId Already Exists",
            });
        }
        user = await facultyDetails.create({ ...req.body, profile: req.file.filename });
        
        // Send OTP via email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: req.body.email, // Ensure email exists in user model
            subject: "Your Login Credentials",
            text: `Hello ${req.body.firstName} ${req.body.middleName} ${req.body.lastName},\n\nYour account has been created successfully!\n\nHere are your login credentials:\n\nLogin ID: ${req.body.employeeId}\nPassword: ${req.body.employeeId}\n\nPlease change your password after logging in for security reasons.\n\nBest Regards,\nAdmin`,
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Error sending Mail to Faculty" });
            }
            res.json({
                success: true,
                message: "Mail sent to the faculty email with login credentials",
                enrollmentNo: req.body.employeeId,
            });
        });


        const data = {
            success: true,
            message: "Faculty Details Added!",
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
            user = await facultyDetails.findByIdAndUpdate(req.params.id, { ...req.body, profile: req.file.filename });
        } else {
            user = await facultyDetails.findByIdAndUpdate(req.params.id, req.body);
        }
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No Faculty Found",
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
    try {
        let user = await facultyDetails.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No Faculty Found",
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
        let user = await facultyDetails.count(req.body);
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

module.exports = { getDetails, addDetails, updateDetails, deleteDetails, getCount }