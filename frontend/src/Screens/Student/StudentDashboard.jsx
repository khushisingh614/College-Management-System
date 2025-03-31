// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { baseApiURL } from "../../baseUrl";
// import { useSelector } from "react-redux";

// const StudentDashboard = () => {
//   const [feedbackForms, setFeedbackForms] = useState([]);
//   const [responses, setResponses] = useState({});
//   const [loading, setLoading] = useState(true);
//   const studentId = useSelector((state) => state.userData?._id) || "";

//   useEffect(() => {
//     if (studentId) fetchFeedbackForms();
//   }, [studentId]);

//   const fetchFeedbackForms = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${baseApiURL()}/student/feedback/getAll/${studentId}`);

//       if (response.data.success && Array.isArray(response.data.feedbackForms)) {
//         setFeedbackForms(response.data.feedbackForms);
//         initializeResponses(response.data.feedbackForms);
//       } else {
//         setFeedbackForms([]);
//         toast.error("No feedback forms found or invalid response");
//       }
//     } catch (error) {
//       setFeedbackForms([]);
//       toast.error("Error fetching feedback forms");
//       console.error("API Fetch Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const initializeResponses = (forms) => {
//     const initialResponses = {};
//     forms.forEach((feedback) => {
//       if (!feedback.isSubmitted) {
//         initialResponses[feedback._id] = {
//           ratings: Array(feedback.questions.length).fill(3),
//           comments: "",
//         };
//       }
//     });
//     setResponses(initialResponses);
//   };

//   const handleRatingChange = (feedbackId, index, value) => {
//     setResponses((prev) => ({
//       ...prev,
//       [feedbackId]: {
//         ...prev[feedbackId],
//         ratings: prev[feedbackId].ratings.map((rating, i) => (i === index ? value : rating)),
//       },
//     }));
//   };

//   const handleCommentChange = (feedbackId, value) => {
//     setResponses((prev) => ({
//       ...prev,
//       [feedbackId]: {
//         ...prev[feedbackId],
//         comments: value,
//       },
//     }));
//   };

//   const handleSubmit = async (feedbackId) => {
//     try {
//       if (!responses[feedbackId]) {
//         toast.error("Please provide responses before submitting.");
//         return;
//       }

//       const feedbackData = {
//         studentId,
//         responses: responses[feedbackId].ratings,
//         comments: responses[feedbackId].comments || "",
//       };

//       const response = await axios.post(`${baseApiURL()}/student/feedback/submit/${feedbackId}`, feedbackData);

//       if (response.data.success) {
//         toast.success("Feedback submitted successfully!");
//         fetchFeedbackForms();
//       } else {
//         toast.error(response.data.message || "Failed to submit feedback.");
//       }
//     } catch (error) {
//       toast.error("Error submitting feedback.");
//       console.error("Submit Error:", error);
//     }
//   };

//   return (
//     <div className="w-[70%] mx-auto mt-10">
//       <h2 className="text-2xl font-semibold mb-4">Student Feedback Forms</h2>

//       {loading ? (
//         <p className="text-center text-gray-600">Loading feedback forms...</p>
//       ) : feedbackForms.length === 0 ? (
//         <p className="text-center text-gray-600">No feedback forms available.</p>
//       ) : (
//         <div className="flex flex-col gap-6">
//           {feedbackForms.map((feedback) => (
//             <div key={feedback._id} className="bg-blue-50 p-6 rounded-lg shadow-md">
//               <h3 className="text-xl font-semibold">
//                 {feedback.professor?.firstName} {feedback.professor?.lastName} - {feedback.subject || "No Subject"}
//               </h3>
//               <p className="text-sm text-gray-600">Semester: {feedback.semester || "N/A"}</p>
//               <p className="text-sm text-gray-600">
//                 Issued by: {feedback.admin?.firstName} {feedback.admin?.lastName}
//               </p>

//               <div className="mt-4">
//                 <h4 className="font-medium">Feedback Status:</h4>
//                 {feedback.isSubmitted ? (
//                   <div className="text-green-600 font-semibold">Feedback Submitted ✅</div>
//                 ) : (
//                   <div className="text-red-600 font-semibold">Pending Submission ❌</div>
//                 )}
//               </div>

//               {/* If feedback is already submitted, show the response along with questions */}
//               {feedback.isSubmitted && feedback.feedbackData ? (
//                 <div className="mt-4 bg-gray-100 p-4 rounded">
//                   <h4 className="font-medium">Your Submitted Feedback:</h4>
//                   <ul className="list-disc ml-6 mt-2">
//                     {feedback.questions.map((question, index) => (
//                       <li key={index} className="mb-2">
//                         <strong>{question}:</strong> {feedback.feedbackData.ratings[index]}/5
//                       </li>
//                     ))}
//                     <li>
//                       <strong>Comments:</strong> {feedback.feedbackData.comments || "No comments provided."}
//                     </li>
//                     <li>
//                       <strong>Submitted On:</strong> {new Date(feedback.feedbackData.createdAt).toLocaleString()}
//                     </li>
//                   </ul>
//                 </div>
//               ) : (
//                 // If not submitted, allow submission
//                 <>
//                   <div className="mt-4">
//                     <h4 className="font-medium">Provide Your Feedback:</h4>
//                     <ul className="list-disc ml-6 mt-2">
//                       {feedback.questions.map((question, index) => (
//                         <li key={index} className="text-gray-700 flex flex-col gap-2">
//                           {question}
//                           <div className="flex gap-2">
//                             <label>Rating:</label>
//                             <select
//                               value={responses[feedback._id]?.ratings[index] || 3}
//                               onChange={(e) => handleRatingChange(feedback._id, index, Number(e.target.value))}
//                               className="border px-2 py-1 rounded"
//                             >
//                               {[1, 2, 3, 4, 5].map((num) => (
//                                 <option key={num} value={num}>
//                                   {num}
//                                 </option>
//                               ))}
//                             </select>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div className="mt-4">
//                     <label className="block font-medium">Comments:</label>
//                     <textarea
//                       value={responses[feedback._id]?.comments || ""}
//                       onChange={(e) => handleCommentChange(feedback._id, e.target.value)}
//                       className="w-full p-2 border rounded mt-1"
//                       rows="3"
//                       placeholder="Write your feedback..."
//                     ></textarea>
//                   </div>

//                   {/* Submit Button */}
//                   <button
//                     onClick={() => handleSubmit(feedback._id)}
//                     className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//                   >
//                     Submit Feedback
//                   </button>
//                 </>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentDashboard;
