require("dotenv").config();
const nodemailer = require("nodemailer");

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Sender email
    pass: process.env.EMAIL_PASS, // App password
  },
});


const notifysecurity = async (req, res) => {

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.body.email,
        subject: "Security Alert: Multiple Failed Login Attempts",
        text: `Dear User,

    We detected multiple failed login attempts to your account. If this wasn't you, please reset your password immediately.

    If you recognize these attempts, no action is needed.

    Stay safe,
    Your Security Team`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "Security alert email sent successfully." });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, message: "Failed to send email" });
    }
}

module.exports = { notifysecurity }