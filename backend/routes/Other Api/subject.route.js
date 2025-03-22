const express = require("express");
const { getSubject,getSUbjectbranchandsem, addSubject, deleteSubject } = require("../../controllers/Other/subject.controller");
const router = express.Router();

router.get("/getSubject", getSubject);
router.get("/getSubjectbranchandsem" , getSUbjectbranchandsem)
router.post("/addSubject", addSubject);
router.delete("/deleteSubject/:id", deleteSubject);

module.exports = router;
