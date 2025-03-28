import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { baseApiURL } from "../../../baseUrl";
import { useSelector } from "react-redux";

const AdminFeedbackList = () => {
  const [feedbackForms, setFeedbackForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const adminId = useSelector((state) => state.userData?._id) || "";

  useEffect(() => {
    if (adminId) fetchFeedbackForms();
  }, [adminId]);

  const fetchFeedbackForms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseApiURL()}/admin/feedback/getAllAdmin/${adminId}`);

      if (response.data.success && Array.isArray(response.data.feedbacks)) {
        setFeedbackForms(response.data.feedbacks);
      } else {
        setFeedbackForms([]);
        toast.error("No feedbacks found or invalid response");
      }
    } catch (error) {
      setFeedbackForms([]);
      toast.error("Error fetching feedback forms");
      console.error("API Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (feedbackId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this feedback?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${baseApiURL()}/admin/feedback/delete/${feedbackId}`);
      if (response.data.success) {
        toast.success("Feedback deleted successfully!");
        setFeedbackForms(feedbackForms.filter((item) => item._id !== feedbackId));
      } else {
        toast.error("Failed to delete feedback");
      }
    } catch (error) {
      toast.error("Error deleting feedback");
      console.error("Delete Error:", error);
    }
  };

  // Function to calculate question-wise average ratings
  const calculateQuestionWiseAverages = (feedback) => {
    if (!feedback.feedbackData || feedback.feedbackData.length === 0) return [];

    const numQuestions = feedback.questions.length;
    const questionAverages = new Array(numQuestions).fill(0);
    let responsesCount = new Array(numQuestions).fill(0);

    feedback.feedbackData.forEach((feedbackEntry) => {
      feedbackEntry.ratings.forEach((rating, index) => {
        questionAverages[index] += rating;
        responsesCount[index] += 1;
      });
    });

    return questionAverages.map((total, index) =>
      responsesCount[index] > 0 ? (total / responsesCount[index]).toFixed(1) : "No feedback"
    );
  };

  // Function to calculate overall average rating
  const calculateOverallAverage = (feedback) => {
    if (!feedback.feedbackData || feedback.feedbackData.length === 0) return "No feedback yet";

    let totalRatings = 0;
    let count = 0;

    feedback.feedbackData.forEach((feedbackEntry) => {
      feedbackEntry.ratings.forEach((rating) => {
        totalRatings += rating;
        count += 1;
      });
    });

    return count > 0 ? (totalRatings / count).toFixed(1) : "No feedback yet";
  };

  return (
    <div className="w-[80%] mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">All Feedback Forms</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading feedback forms...</p>
      ) : feedbackForms.length === 0 ? (
        <p className="text-center text-gray-600">No feedback forms found.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {feedbackForms.map((feedback) => {
            const questionAverages = calculateQuestionWiseAverages(feedback);
            const overallAverage = calculateOverallAverage(feedback);

            return (
              <div key={feedback?._id} className="bg-blue-50 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold">
                  {feedback.professor?.firstName} {feedback.professor?.lastName} - {feedback.subject || "No Subject"}
                </h3>
                <p className="text-sm text-gray-600">Semester: {feedback.semester || "N/A"}</p>

                {/* Overall Average Rating */}
                <div className="mt-4 bg-gray-100 p-3 rounded-lg">
                  <h4 className="font-medium">Overall Average Rating:</h4>
                  <p className="text-lg font-bold text-blue-600">
                    {overallAverage} / 5 ⭐
                  </p>
                </div>

                {/* Question-wise Average Ratings */}
                <div className="mt-4 bg-white p-3 rounded-lg shadow-sm">
                  <h4 className="font-medium">Question-wise Average Ratings:</h4>
                  <ul className="list-disc ml-6 mt-2">
                    {Array.isArray(feedback.questions) && feedback.questions.length > 0 ? (
                      feedback.questions.map((question, index) => (
                        <li key={index} className="text-gray-700">
                          {question} - <span className="font-bold text-blue-600">{questionAverages[index]} / 5 ⭐</span>
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-500">No questions available.</p>
                    )}
                  </ul>
                </div>

                {/* Delete Feedback Button */}
                <button
                  onClick={() => handleDelete(feedback._id)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete Feedback
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackList;
