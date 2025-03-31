const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/multer.middleware.js");
const { 
  getCurriculum, 
  addCurriculum, 
  updateCurriculum, 
  deleteCurriculum 
} = require("../../controllers/Other/curriculum.controller.js");

router.post("/getCurriculum", getCurriculum);
router.post("/addCurriculum",  upload.single("curriculum"), addCurriculum);
router.put("/updateCurriculum/:id", updateCurriculum);
router.delete("/deleteCurriculum/:id", deleteCurriculum);

module.exports = router;