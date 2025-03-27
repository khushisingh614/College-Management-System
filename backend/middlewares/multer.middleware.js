const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const mediaPath = "./media"; // Ensure it's a directory
        
        if (!fs.existsSync(mediaPath)) {
            fs.mkdirSync(mediaPath, { recursive: true });
        }

        cb(null, mediaPath);
    },
    filename: function (req, file, cb) {
        let filename = "default_file.png"; // Ensure a default filename exists

        if (req.body?.type === "timetable") {
            filename = `Timetable_${req.body.semester}_Semester_${req.body.branch}.png`;
        } else if (req.body?.type === "profile") {
            if (req.body.enrollmentNo) {
                filename = `Student_Profile_${req.body.enrollmentNo}_Semester_${req.body.branch}.png`;
            } else if (req.body.employeeId) {
                filename = `Faculty_Profile_${req.body.employeeId}.png`;
            }
        } else if (req.body?.type === "material") {
            filename = `${req.body.title}_Subject_${req.body.subject}.pdf`;
        }

        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
