const facultyCredential = require("../../models/Faculty/credential.model.js");
const facultyData = require("../../models/Faculty/details.model.js");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const otpStore = {}; // Temporary OTP storage (use Redis for production)

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Sender email
    pass: process.env.EMAIL_PASS, // App password
  },
});


const loginHandler = async (req, res) => {
  let { loginid, password } = req.body;
  try {
    let user = await facultyCredential.findOne({ loginid });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong Credentials" });
    }


    const staticSalt = process.env.STATIC_SALT || "mySecretStaticSalt";
    const isMatch = await bcrypt.compare(
      user.dynamic_salt + password + staticSalt,
      user.password
    );

    if (!isMatch && password == user.temporary_password) {
      if (new Date() > user.temporary_password_expires_at) {
        // Remove expired temporary password
        await facultyCredential.findOneAndUpdate(
          { loginid },
          {
            temporary_password: null,
            temporary_password_expires_at: null,
          }
        );
        return res
        .status(400)
        .json({ success: false, message: "Temporary access not possible" });
      }

      return res.json({
        success: true,
        message: "Temporary",
        loginid: user.loginid,
        id: user.id,
      });
    }

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong Credentials" });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore[loginid] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // OTP expires in 5 minutes

    let faculty = await facultyData.findOne({ employeeId: loginid }).exec();

    // Send OTP via email
    const mailOptions = {
    from: process.env.EMAIL_USER,
    to: faculty.email, // Ensure email exists in user model
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
          console.log(error);
          return res.status(500).json({ success: false, message: "Error sending OTP" });
      }
      res.json({
          success: true,
          message: "OTP sent to your email",
          loginid: user.loginid,
      });
    });

    const data = {
      success: true,
      message: "OTP sent to your email",
      loginid: user.loginid,
      id: user.id,
    };
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const verifyOtpHandler = async (req, res) => {
  let { loginid, otp } = req.body;

  if (!otpStore[loginid]) {
    return res.status(400).json({ success: false, message: "OTP expired or not found" });
  }

  if (otpStore[loginid].otp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  // OTP verification success, remove OTP from store
  delete otpStore[loginid];

  res.json({ success: true, message: "Login successful!", loginid });
};

const registerHandler = async (req, res) => {
  let { loginid, password } = req.body;
  try {
    let user = await facultyCredential.findOne({ loginid });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User With This LoginId Already Exists",
      });
    }

    const staticSalt = process.env.STATIC_SALT || "mySecretStaticSalt";
    const dynamicSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      dynamicSalt + password + staticSalt,
      10
    );

    user = await facultyCredential.create({
      loginid,
      password: hashedPassword,
      dynamic_salt: dynamicSalt,
    });

    const data = {
      success: true,
      message: "Register Successfull!",
      loginid: user.loginid,
      id: user.id,
    };
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateTemporaryHandler = async (req, res) => {
  try {
    let user = await facultyCredential.findOne({loginid: req.body.id});
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No User Exists!",
      });
    }
    
    const tempPassword = crypto.randomBytes(8).toString("hex").slice(0, 8);
    await facultyCredential.findOneAndUpdate({loginid: req.body.id}, {
        temporary_password: tempPassword,
        temporary_password_expires_at: new Date(Date.now() + 60 * 60 * 1000),
    });
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: "Your login id and password for temporary access ",
      text: `Hello, You are provided temporary access as a faculty. Your login credentials are: \n\n Login ID: ${req.body.id} \n Password: ${tempPassword}\n \n Kindy login. \n\nBest Regards`,
    };

    transporter.sendMail(mailOptions, (error) => {
    if (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error sending Mail to the User" });
    }
    res.json({
        success: true,
        message: "Mail send to the temporary User",
        loginid: user.loginid,
    });
    });

    const data = {
      success: true,
      message: "Updated Successfull!",
    };
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateHandler = async (req, res) => {
  try {
    let user = await facultyCredential.findById(req.params.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No User Exists!",
      });
    }
     // If updating password, hash the new password
    if (req.body.password) {
        const staticSalt = process.env.STATIC_SALT || "mySecretStaticSalt";
        const dynamicSalt = await bcrypt.genSalt(10);
        req.body.dynamic_salt = dynamicSalt;
        req.body.password = await bcrypt.hash(dynamicSalt + req.body.password + staticSalt, 10);
    }

    await facultyCredential.findByIdAndUpdate(req.params.id, req.body);
    
    const data = {
      success: true,
      message: "Updated Successfull!",
    };
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteHandler = async (req, res) => {
  try {
    let user = await facultyCredential.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No User Exists!",
      });
    }
    const data = {
      success: true,
      message: "Deleted Successfull!",
    };
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { loginHandler,verifyOtpHandler,updateTemporaryHandler, registerHandler, updateHandler,deleteHandler};