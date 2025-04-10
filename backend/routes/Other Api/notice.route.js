const express = require("express");
const { getNotice,getNoticeforfaculty,getNoticebybranchandsem, addNotice, updateNotice, deleteNotice } = require("../../controllers/Other/notice.controller");
const router = express.Router();
const upload = require("../../middlewares/multer.middleware.js");

router.get("/getNotice", getNotice);
router.post("/getNoticeforfaculty", getNotice);
router.post("/getNoticebybranchandsem", getNoticebybranchandsem);
router.post("/addNotice",upload.single("notice") , addNotice);
router.put("/updateNotice/:id", updateNotice);
router.delete("/deleteNotice/:id", deleteNotice);

module.exports = router;