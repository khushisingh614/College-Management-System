const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/multer.middleware.js");
const {
uploadPdf,
getUpcomingQuizzes,
getCompletedQuizzes,
getQuizPdfById,
getMcqsByQuizId,
getSubjectivesByQuizId,
evaluateQuiz,
getQuizResults,
} = require("../../controllers/Other/quiz.controller");

// Faculty uploads assignments (content + PDF)
router.post("/upload", upload.single("quiz"), uploadPdf);
router.get("/upcoming/:branch/:semester/:enrollmentNo", express.json(), getUpcomingQuizzes);
router.get("/completed/:branch/:semester/:enrollmentNo", express.json(), getCompletedQuizzes);
router.get("/pdf/:quizId",express.json(), getQuizPdfById);
router.get("/mcq/:quizId",express.json(), getMcqsByQuizId);
router.get("/subjective/:quizId",express.json(), getSubjectivesByQuizId);
router.post("/submit-quiz", express.json(), evaluateQuiz);
router.get("/results/:quizId/:studentId", getQuizResults);

 
module.exports = router;