import React, { useEffect, useState } from "react";
import axios from "axios";
import QuizPage from "./QuizPage";
import QuizResults from "./QuizResults"
import { baseApiURL } from "../../baseUrl";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [completedquizzes, setCompletedQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [selectedCompletedQuizId, setSelectedCompletedQuizId] = useState(null);
  const studentId = localStorage.getItem("studentId");
  const branch = localStorage.getItem("branch");
  const semester = localStorage.getItem("semester");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(
          `${baseApiURL()}/quiz/upcoming/${branch}/${semester}/${studentId}`
        );
        setQuizzes(res.data);
      } catch (err) {
        console.error("Failed to fetch quizzes", err);
      }
    };
    fetchQuizzes();
  }, []);
  useEffect(() => {
    const fetchCompleteQuizzes = async () => {
      try {
        const res = await axios.get(
          `${baseApiURL()}/quiz/completed/${branch}/${semester}/${studentId}`
        );
        setCompletedQuizzes(res.data);
      } catch (err) {
        console.error("Failed to fetch quizzes", err);
      }
    };
    fetchCompleteQuizzes();
  }, []);

  if (selectedQuizId) {
    return <QuizPage quizId={selectedQuizId} studentId={studentId} />;
  }
  if(selectedCompletedQuizId){
    return <QuizResults quizId={selectedCompletedQuizId} studentId={studentId} />;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Upcoming Quizzes</h2>
      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="border p-4 rounded bg-yellow-300 shadow hover:bg-gray-100 cursor-pointer"
            onClick={() => setSelectedQuizId(quiz._id)}
          >
            <h3 className="text-lg font-semibold">{quiz.title}</h3>
            <p className="text-gray-600">{quiz.subject}</p>
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-bold mb-4 mt-4">Completed Quizzes</h2>
      <div className="space-y-4">
        {completedquizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="border p-4 rounded bg-green-300  shadow hover:bg-gray-100 cursor-pointer"
            onClick={() => setSelectedCompletedQuizId(quiz._id)}
          >
            <h3 className="text-lg font-semibold">{quiz.title}</h3>
            <p className="text-gray-600">{quiz.subject}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
