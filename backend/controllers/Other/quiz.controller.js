const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const { OpenAI } = require("openai");
const quizObj = require("../../models/Other/quizObj.model");
const quizSubj = require("../../models/Other/quizSubj.model");
const FacultyDetail = require("../../models/Faculty/details.model");
const StudentDetail = require("../../models/Students/details.model");
const UploadedQuizPdf = require("../../models/Other/quizPdf.model");
const StudentQuizResponse = require("../../models/Other/StudentQuizResponses.model")

const api = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.aimlapi.com/v1",
});

const systemPrompt = "You are a quiz generator. Given academic text, generate clean and useful quiz questions.";

// Split text into 2–3 chunks max
function chunkText(text, chunkSize = 5000, maxChunks = 2) {
  const chunks = [];
  for (let i = 0; i < Math.min(maxChunks, Math.ceil(text.length / chunkSize)); i++) {
    chunks.push(text.slice(i * chunkSize, (i + 1) * chunkSize));
  }
  return chunks;
}

// VERY BASIC parser (Can improve this with regex or fine-tuned format)
function parseText(responseText) {
    const subjQns = [];
    const objQns = [];
  
    const subjectivePart = responseText.split("Objective:")[0].trim();
    const objectivePart = responseText.split("Objective:")[1]?.trim();
    // Subjective questions
    const subjMatches = Array.from(subjectivePart.matchAll(
      /(\d+)\.\s(.+?)\(Points:\s*(\d+)\)\s*Answer:\s([\s\S]*?)(?=\n\d+\.|\n?$)/g
    ));
    //console.log("Subjective part:\n", subjectivePart);
    //console.log("Objective part:\n", objectivePart);
    
    //console.log("Subjective matches:");
    for (const match of subjMatches) {
      //console.log(match);
    }
    
    for (const match of subjMatches) {
      subjQns.push({
        question: match[2].trim(),
        answer: match[4].trim(),
        points: Number(match[3])
      });
    }
  
    // Objective questions
    const objMatches = Array.from(objectivePart.matchAll(
      /(\d+)\.\s(.+?)\(Points:\s*(\d+)\)\s*Options:\s*A\.\s(.+?)\s*B\.\s(.+?)\s*C\.\s(.+?)\s*D\.\s(.+?)\s*Answer:\s*([A-D])\.\s(.+?)(?=\n\d+\.|\n?$)/gs
    ));
    
    //console.log("Objective matches:");
    for (const match of objMatches) {
      //console.log(match);
    }
    for (const match of objMatches) {
      const correctOption = match[8].trim();
      const correctText = match[9].trim();
  
      objQns.push({
        question: match[2].trim(),
        options: {
          A: match[4].trim(),
          B: match[5].trim(),
          C: match[6].trim(),
          D: match[7].trim()
        },
        answer: {
          [correctOption]: correctText
        },
        points: Number(match[3])
      });
    }
  
    return { subjQns, objQns };
  }
  
  

const uploadPdf = async (req, res) => {
  try {
    console.log(req.body);
    const { facultyId, title, branch, semester, subject, numSubj, numObj } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No PDF file uploaded" });
    const parsedfacId = facultyId ? Number(facultyId) : null;
         if (!parsedfacId || isNaN(parsedfacId)) {
             return res.status(400).json({ message: "Invalid professorId. Must be a number." });
    }
    facId = await FacultyDetail.find({employeeId:parsedfacId}).select("_id");
    console.log(facId)
    // 1. Save PDF metadata
    const savedPdf = new UploadedQuizPdf({
      facultyId:facId[0],
      title,
      branch,
      semester,
      subject,
      filename: file.originalname,
      path: file.path,
    });
    await savedPdf.save();
    console.log(savedPdf);

    // 2. Parse PDF
    const pdfBuffer = fs.readFileSync(file.path);
    const pdfData = await pdfParse(pdfBuffer);
    const text = pdfData.text.trim();
    //console.log(text);
    if (!text) return res.status(400).json({ error: "PDF is empty or unreadable" });

    const chunks = chunkText(text, 5000, 2); //CHUNKS
    let allSubj = [], allObj = [];
    const totalChunks = chunks.length;

// Distribute questions accurately
const distributeCounts = (total, chunks) => {
  const base = Math.floor(total / chunks);
  const remainder = total % chunks;
  const counts = Array(chunks).fill(base);
  for (let i = 0; i < remainder; i++) {
    counts[i] += 1;
  }
  return counts;
};

const objCounts = distributeCounts(numObj, totalChunks);
const subjCounts = distributeCounts(numSubj, totalChunks);

let totalPoints = 0;

    // 3. Generate quiz from chunks
    for (let i = 0; i < totalChunks; i++) {
        const chunk = chunks[i];
        const objThisChunk = objCounts[i];
        const subjThisChunk = subjCounts[i];
      
        const completion = await api.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `From this text:\n\n${chunk}\n\nGenerate exactly ${subjThisChunk} subjective and exactly ${objThisChunk} objective questions with answers. Do not generate more than the requested number. Assign points to each question. \n\nFormat:\n\nSubjective:\n1. Question (Points: X)\nAnswer: ...\n\nObjective:\n1. Question (Points: X)\nOptions:\nA. ...\nB. ...\nC. ...\nD. ...\nAnswer: B. <correct option text>`

            },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        });

      const output = completion.choices[0].message.content;
      //console.log("=== GPT Output ===\n", output);
      const { subjQns, objQns } = parseText(output);
      subjQns.forEach(q => {
        totalPoints += q.points;
      });
      
      objQns.forEach(q => {
        totalPoints += q.points;
      });
      console.log(totalPoints);
      allSubj.push(...subjQns);
      allObj.push(...objQns);
    }

    // 4. Save to DB
    await quizSubj.insertMany(allSubj.map(q => ({
      facultyId:facId[0],
      title,
      branch,
      semester,
      subject,
      question: q.question,
      answer: q.answer,
      quizId: savedPdf._id,
      points: q.points
    })));

    await quizObj.insertMany(allObj.map(q => ({
      facultyId:facId[0],
      title,
      branch,
      semester,
      subject,
      question: q.question,
      options: q.options,
      answer: q.answer,
      quizId: savedPdf._id,
      points: q.points
    })));

    res.status(201).json({
      message: "Quiz generated and saved successfully",
      subjectiveCount: allSubj.length,
      objectiveCount: allObj.length,
      pdfId: savedPdf._id,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate quiz", details: err.message });
  }
};

const getUpcomingQuizzes = async (req, res) => {
    const { branch, semester, enrollmentNo } = req.params;
    try {
      const allQuizzes = await UploadedQuizPdf.find({ branch, semester: Number(semester) });
      const studId = await StudentDetail.findOne({enrollmentNo:Number(enrollmentNo)}).select("_id");
      const attempted = await StudentQuizResponse.find({ studentId: studId});
      const attemptedIds = attempted.length > 0
        ? new Set(attempted.map(q => q.quizId.toString()))
        : new Set();
  
      const unattemptedQuizzes = allQuizzes.filter(
        (quiz) => !attemptedIds.has(quiz._id.toString())
      );
  
      res.status(200).json(unattemptedQuizzes);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      res.status(500).json({ error: "Server error while fetching quizzes" });
    }
  };

  const getCompletedQuizzes = async (req, res) => {
    const { branch, semester, enrollmentNo } = req.params;
    try {
      const allQuizzes = await UploadedQuizPdf.find({ branch, semester: Number(semester) });
      const studId = await StudentDetail.findOne({enrollmentNo:Number(enrollmentNo)}).select("_id");
      const attempted = await StudentQuizResponse.find({ studentId: studId});
      const attemptedIds = new Set(attempted.map(q => q.quizId.toString()));

    // Filter quizzes that the student HAS attempted
    const completedQuizzes = allQuizzes.filter(
      (quiz) => attemptedIds.has(quiz._id.toString())
    );
  
      res.status(200).json(completedQuizzes);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      res.status(500).json({ error: "Server error while fetching quizzes" });
    }
  };
  
  const getQuizPdfById = async (req, res) => {
    const { quizId } = req.params;
    try {
      const quiz = await UploadedQuizPdf.find({_id: quizId});
      if (!quiz) return res.status(404).json({ error: "Quiz not found" });
  
      res.status(200).json(quiz);
    } catch (err) {
      console.error("Error fetching quiz PDF:", err);
      res.status(500).json({ error: "Server error while fetching quiz" });
    }
  };

  const getMcqsByQuizId = async (req, res) => {
    const { quizId } = req.params;
    try {
      const mcqs = await quizObj.find({ quizId });
      res.status(200).json(mcqs);
    } catch (err) {
      console.error("Error fetching MCQs:", err);
      res.status(500).json({ error: "Server error while fetching MCQs" });
    }
  };
  const getSubjectivesByQuizId = async (req, res) => {
    const { quizId } = req.params;
    try {
      const subjectives = await quizSubj.find({ quizId });
      res.status(200).json(subjectives);
    } catch (err) {
      console.error("Error fetching subjective questions:", err);
      res.status(500).json({ error: "Server error while fetching subjectives" });
    }
  };
  const evaluateQuiz = async (req, res) => {
   try {
    const { studentId, quizId, responses } = req.body;

    if (!studentId || !quizId || !Array.isArray(responses)) {
      return res.status(400).json({ error: "Missing or invalid data" });
    }
    //console.log(req.body);
    let totalScore = 0;
    const evaluatedResponses = [];

    for (const r of responses) {
      const { questionId, questionModel, answer } = r;
        console.log(r);
        let objQuestion, subjQuestion;

        if (questionModel == "QuizObj") {
          objQuestion = await quizObj.findOne({ _id: questionId });
          if (!objQuestion) continue;
          //console.log("r in loop", r)
          const options = objQuestion.options;
          const answer = objQuestion.answer;
          const [correctKey, correctText] = Object.entries(answer)[0];
          const selectedText = r.answer?.trim();
          console.log(selectedText,correctText.trim());
          const isCorrect = selectedText == correctText.trim();

          const pointsAwarded = isCorrect ? objQuestion.points : 0;
          totalScore += pointsAwarded;
        
          evaluatedResponses.push({
            questionId: objQuestion._id,
            questionModel,
            selectedOption: r.answer,
            pointsAwarded,
          });
        
        } 
        else if (questionModel == "QuizSubj") {
          subjQuestion = await quizSubj.findOne({ _id: questionId });
          if (!subjQuestion) continue;
        
          const systemPrompt = `You are a strict evaluator for subjective quiz answers. Award marks out of ${subjQuestion.points} based on relevance, correctness, and clarity. Give partial marks if needed. Return only the number.`;
          const userPrompt = `Question: ${subjQuestion.question}\n\nCorrect Answer: ${subjQuestion.answer}\n\nStudent's Answer: ${r.answer}`;
        
          const completion = await api.chat.completions.create({
            model: "gpt-4o",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.2,
            max_tokens: 10,
          });
        
          const pointsAwarded = Math.min(
            subjQuestion.points,
            parseFloat(completion.choices[0].message.content) || 0
          );
          totalScore += pointsAwarded;
        
          evaluatedResponses.push({
            questionId: subjQuestion._id,
            questionModel,
            subjAnswer: r.answer,
            pointsAwarded,
          });
        }
    }
        
    //console.log(evaluatedResponses);
    studId = await StudentDetail.find({enrollmentNo:Number(studentId)}).select("_id");
    const result = new StudentQuizResponse({
      studentId:studId[0],
      quizId,
      responses: evaluatedResponses,
      totalScore,
    });
    //console.log(result);
    await result.save();

    res.status(201).json({
      message: "Quiz submitted successfully",
      totalScore,
    });
  } catch (err) {
    console.error("Error submitting quiz:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getQuizResults = async (req, res) => {
    try {
      const { quizId, studentId } = req.params;
      const studId = await StudentDetail.find({enrollmentNo:Number(studentId)}).select("_id");
      const responseDoc = await StudentQuizResponse.findOne({
        quizId,
        studentId: studId,
      });
  
      if (!responseDoc) {
        return res.status(404).json({ message: "Result not found." });
      }
  
      const responses = await Promise.all(
        responseDoc.responses.map(async (resp) => {
          let objquestionData, subjquestionData;
  
          if (resp.questionModel === "QuizObj") {
            objquestionData = await quizObj.findOne({_id: resp.questionId});
            if (!objquestionData) return null;
  
            return {
              question: objquestionData.question,
              correctAnswer: Object.values(objquestionData.answer)[0],
              selectedOption: resp.selectedOption,
              pointsAwarded: resp.pointsAwarded,
              totalPoints: objquestionData.points,
            };
          }
  
          else if (resp.questionModel === "QuizSubj") {
            subjquestionData = await quizSubj.findOne({_id: resp.questionId});
            if (!subjquestionData) return null;
  
            return {
              question: subjquestionData.question,
              answer: resp.subjAnswer,
              correctAnswer: subjquestionData.answer,
              pointsAwarded: resp.pointsAwarded,
              totalPoints: subjquestionData.points,
            };
          }
  
          return null;
        })
      );
      console.log(responses)
      const filteredResponses = responses.filter(Boolean);
      const totalScore = filteredResponses.reduce((sum, r) => sum + r.pointsAwarded, 0);
      const totalPossibleScore = filteredResponses.reduce((sum, r) => sum + r.totalPoints, 0);
  
      res.json({
        responses: filteredResponses,
        totalScore,
        totalPossibleScore,
      });
    } catch (err) {
      console.error("Error fetching quiz results:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

module.exports = {
  uploadPdf,
  getUpcomingQuizzes,
  getCompletedQuizzes,
  getQuizPdfById,
  getMcqsByQuizId,
  getSubjectivesByQuizId,
  evaluateQuiz,
  getQuizResults,
};

