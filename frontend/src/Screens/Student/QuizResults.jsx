import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import QuizList from "./QuizList";


const ResultsPage = ({ quizId, studentId }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [back,setBack] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(
          `${baseApiURL()}/quiz/results/${quizId}/${studentId}`
        );
        setResults(res.data);
      } catch (err) {
        console.error("Failed to fetch results", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId, studentId]);

  if (loading) return <div>Loading results...</div>;
  if (!results) return <div>No results found.</div>;
  if(back){
    return <QuizList/>
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="flex">
        <button
            onClick={() => setBack(true)}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back
          </button>
          <h2 className="text-3xl ml-56 font-semibold mb-6 text-center">Quiz Results</h2>
          </div>
      {results.responses.map((response, idx) => (
        <div
        key={idx}
        className="bg-white shadow-lg p-6 rounded-xl mb-6 border-l-8 border-blue-500"
      >
        <div className="mb-4">
          <p className="text-gray-700 text-lg font-semibold mb-1">Question</p>
          <p className="text-gray-800">{response.question}</p>
        </div>
      
        <div className="mb-4">
          <p className="text-green-700 font-semibold">Correct Answer:</p>
          <p className="text-gray-800 whitespace-pre-line">{response.correctAnswer}</p>
        </div>
      
        <div className="mb-4">
          <p className="text-blue-600 font-semibold">Your Answer:</p>
          <p className="text-gray-800 whitespace-pre-line">{response.selectedOption || response.answer}</p>
        </div>
      
        <div className="mt-4 text-sm text-gray-600">
          <span className="font-medium text-gray-900">Points Scored:</span>{" "}
          {response.pointsAwarded} / {response.totalPoints}
        </div>
      </div>
      
      ))}

<div className="bg-gray-50 shadow-lg flex justify-between p-2 rounded-xl border-l-8 border-green-500 mt-6 text-center">
  <p className="text-gray-700 text-lg font-semibold mb-1 ml-16">Total Score</p>
  <p className="text-2xl font-bold text-green-700 mr-16">
    {results.totalScore} / {results.totalPossibleScore}
  </p>
</div>

    </div>
  );
};

export default ResultsPage;
