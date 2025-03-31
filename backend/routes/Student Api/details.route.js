const express = require("express");
const router = express.Router();
const { getDetails, getStudentsBySubject,addDetails, updateDetails, deleteDetails, getCount } = require("../../controllers/Student/details.controller.js");
const upload = require("../../middlewares/multer.middleware.js")

router.post("/getDetails", getDetails);

router.get("/getStudentsBySubject/:subjectId", getStudentsBySubject);

router.post("/addDetails", upload.single("profile"), addDetails);

router.put("/updateDetails/:id", upload.single("profile"), updateDetails);

router.delete("/deleteDetails/:id", deleteDetails);

router.get("/count", getCount);

module.exports = router;