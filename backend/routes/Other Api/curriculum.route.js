const express = require("express");
const router = express.Router();
const { 
  getCurriculum, 
  addCurriculum, 
  updateCurriculum, 
  deleteCurriculum 
} = require("../../controllers/Other/curriculum.controller.js");

router.post("/getCurriculum", getCurriculum);
router.post("/addCurriculum", addCurriculum);
router.put("/updateCurriculum/:id", updateCurriculum);
router.delete("/deleteCurriculum/:id", deleteCurriculum);

module.exports = router;