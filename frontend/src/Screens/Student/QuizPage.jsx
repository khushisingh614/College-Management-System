import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import QuizList from "./QuizList";

const QuizPage = ({ quizId, studentId }) => {
  const [back,setBack] = useState(false);
  const [mcqs, setMcqs] = useState([]);
  const [subjectives, setSubjectives] = useState([]);
  const [quizInfo, setQuizInfo] = useState(null);
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const [quiz, mcqRes, subjRes] = await Promise.all([
          axios.get(`${baseApiURL()}/quiz/pdf/${quizId}`),
          axios.get(`${baseApiURL()}/quiz/mcq/${quizId}`),
          axios.get(`${baseApiURL()}/quiz/subjective/${quizId}`),
        ]);
        setQuizInfo(quiz.data[0]);
        setMcqs(mcqRes.data);
        setSubjectives(subjRes.data);
      } catch (err) {
        console.error("Failed to fetch quiz data", err);
      }
    };

    fetchQuizData();
  }, [quizId]);

  const handleChange = (questionId, questionModel, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: { questionModel, answer: value }
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage("");

    try {
      const formattedResponses = Object.entries(responses).map(([questionId, { questionModel, answer }]) => ({
        questionId,
        questionModel,
        answer
      }));

      const payload = {
        studentId,
        quizId,
        responses: formattedResponses
      };

      const res = await axios.post(`${baseApiURL()}/quiz/submit-quiz`, payload);

      setMessage(`Quiz submitted! Total Score: ${res.data.totalScore}`);
    } catch (err) {
      console.error(err);
      setMessage("Submission failed. Please try again.");
    }

    setSubmitting(false);
  };
  
  if(back){
      return <QuizList/>
    }

  return (
    <div className="p-6">
      {quizInfo && (
        <> 
          <button
        onClick={() => setBack(true)}
        className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-1" />
        Back
      </button>
          <h1 className="text-3xl mt-4 font-bold mb-2">{quizInfo.title}</h1>
          <h2 className="text-gray-600 text-2xl mb-6">{quizInfo.subject}</h2>
        </>
      )}

      <div className="space-y-10">
  <h2 className="text-2xl font-bold text-gray-800 border-l-[5px] border-blue-500 pl-3">Objective Questions</h2>

  {mcqs.map((q, idx) => (
    <div
      key={q._id}
      className="bg-white shadow-lg p-6 rounded-xl border-l-8 border-indigo-400"
    >
      <div className="flex justify-between items-start mb-4">
        <p className="text-gray-800 font-semibold text-base">
          {idx + 1}. {q.question}
        </p>
        <span className="text-sm text-gray-500 italic">{q.points} pts</span>
      </div>

      <div className="space-y-2 pl-2">
        {Object.entries(q.options).map(([optKey, optValue]) => (
          <label key={optKey} className="flex items-start gap-2 cursor-pointer">
            <input
              type="radio"
              name={`mcq-${q._id}`}
              value={optValue}
              onChange={(e) => handleChange(q._id, "QuizObj", e.target.value)}
              className="mt-1 accent-blue-600"
            />
            <span>
              <span className="font-medium">{optKey}.</span> {optValue}
            </span>
          </label>
        ))}
      </div>
    </div>
  ))}

  <h2 className="text-2xl font-bold text-gray-800 border-l-[5px] border-blue-500 pl-3">Subjective Questions</h2>

  {subjectives.map((q, idx) => (
    <div
      key={q._id}
      className="bg-white shadow-lg p-6 rounded-xl border-l-8 border-indigo-400"
    >
      <div className="flex justify-between items-start mb-4">
        <p className="text-gray-800 font-semibold text-base">
          {idx + 1}. {q.question}
        </p>
        <span className="text-sm text-gray-500 italic">{q.points} pts</span>
      </div>
      <textarea
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        rows="5"
        placeholder="Your answer here..."
        onChange={(e) => handleChange(q._id, "QuizSubj", e.target.value)}
      />
    </div>
  ))}

  <div className="text-center">
    <button
      className="mt-4 px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-xl shadow hover:bg-blue-700 transition duration-200 disabled:opacity-50"
      onClick={handleSubmit}
      disabled={submitting}
    >
      {submitting ? "Submitting..." : "Submit Quiz"}
    </button>


    {message && (
    <div className="text-center text-lg font-medium text-green-600">
      {message}
    </div>
  )}
      </div>
    </div>
    </div>
  );
};

export default QuizPage;

