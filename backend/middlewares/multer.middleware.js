const multer = require("multer");

const path = require("path");
const fs = require("fs");

// Ensure media directory exists at project root
const mediaPath = path.join(__dirname, "../media");  // Change path to be relative to backend root

if (!fs.existsSync(mediaPath)) {
    fs.mkdirSync(mediaPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //console.log("Saving to:", mediaPath);
        cb(null, mediaPath); // Saves files in `media/` at the project root
    },
    filename: function (req, file, cb) {
        let filename = "";
        const extension = path.extname(file.originalname) || ".png"; // Default to PNG if unknown

        if (req.body?.type === "timetable") {
            filename = `Timetable_${req.body.semester}_Semester_${req.body.branch}${extension}`;
        } else if (req.body?.type === "profile") {
            filename = req.body.enrollmentNo 
                ? `Student_Profile_${req.body.enrollmentNo}_Semester_${req.body.branch}${extension}`
                : `Faculty_Profile_${req.body.employeeId}${extension}`;
        } else if (req.body?.type === "material") {
            filename = `${req.body.title}_Subject_${req.body.subject}${extension}`;
        } else if (req.body?.type === "assignment") {
            if (req.body.enrollmentNo && req.body.title) {
                filename = `Assignment_${req.body.title}_Student_${req.body.enrollmentNo}${extension}`;
            } else {
                return cb(new Error("Missing required fields for assignment upload"), null);
            }
        } else {
            filename = `upload_${Date.now()}${extension}`; 
        }

        cb(null, filename);
    }
});

// Store only relative paths in the database
const upload = multer({ storage });

module.exports = upload;


