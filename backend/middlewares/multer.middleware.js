const multer = require("multer");
const path = require("path");   

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./media");
    },
    filename: function (req, file, cb) {
        console.log(req.body);
        let filename = "";


        if (req.body?.type === "timetable") {
            filename = `Timetable_${req.body.semester}_Semester_${req.body.branch}.png`
        } else if (req.body?.type === "profile") {
            if (req.body.enrollmentNo) {
                filename = `Student_Profile_${req.body.enrollmentNo}_Semester_${req.body.branch}.png`
            } else {
                filename = `Faculty_Profile_${req.body.employeeId}.png`
            }
        } else if (req.body?.type === "material") {
            filename = `${req.body.title}_Subject_${req.body.subject}.pdf`
        }else if (req.body?.type === "curriculum") {
            filename = `Curriculum_${req.body.subject}.pdf`
        }else if (req.body?.type === "assignments") {
            filename = `Assignment_${req.body.title}_Subject_${req.body.subject}_${Date.now()}.pdf`;
        } 
        else if (req.body?.type === "submitassignments") {
            filename = `Submit_Assignment_by_${req.body.studentName}_${Date.now()}${path.extname(file.originalname)}`;
        }
        else if (req.body?.type === "quiz") {
            filename = `Quiz_Material_for_${req.body.subject}_by_${req.body.facultyId}_${Date.now()}${path.extname(file.originalname)}`;
        } 
        if (!filename) {
            filename = `upload_${Date.now()}${path.extname(file.originalname)}`;
        }

        console.log(filename);

        cb(null, `${filename}`);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;