const nodemailer = require('nodemailer');

const sendReminderMail = async (toEmail, studentName, assignmentTitle, deadline) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or your email provider
        auth: {
            user: process.env.EMAIL_USER,  // your email
            pass: process.env.EMAIL_PASS   // your app password
        }
    });

    const mailOptions = {
        from: `"Assignment Portal" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `Reminder: ${assignmentTitle} is due tomorrow!`,
        html: `
            <h2>Hello ${studentName},</h2>
            <p>This is a gentle reminder that your assignment <strong>"${assignmentTitle}"</strong> is due on <strong>${new Date(deadline).toLocaleString()}</strong>.</p>
            <p>Please make sure to submit it on time.</p>
            <br/>
            <p>Good luck!</p>
            <p>— Assignment Portal Team</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendReminderMail;
