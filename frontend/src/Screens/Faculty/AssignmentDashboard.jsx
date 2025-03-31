import { useState, useEffect } from "react";
 import axios from "axios";
 import { baseApiURL } from "../../baseUrl";
 import UploadAssignment from "./UploadAssignment";
 
 export default function Dashboard() {
     const [assignments, setAssignments] = useState([]);
     const [selectedAssignment, setSelectedAssignment] = useState(null);
     const [submissions, setSubmissions] = useState([]);
     const [gradingData, setGradingData] = useState({});
     const [feedbackData, setFeedbackData] = useState({}); // Stores feedback per student
     const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
     const [showUpload, setShowUpload] = useState(false);
     const [showGrades, setShowGrades] = useState(false);
     const [gradeMessage, setGradeMessage] = useState("");
 
     // Fetch assignments on load
     useEffect(() => {
         axios.get(`${baseApiURL()}/assignments`)
             .then(res => setAssignments(res.data))
             .catch(err => console.error("Error fetching assignments:", err));
     }, []);
 
     // Fetch student submissions for the selected assignment
     const fetchSubmissions = async (assignmentId) => {
         try {
             const response = await axios.get(`${baseApiURL()}/assignments/submit/${assignmentId}`);
             console.log(response)
             setSubmissions(response.data);
             setShowSubmissionsModal(true);
         } catch (error) {
             console.error("Error fetching submissions:", error);
         }
     };
 
     // Handle grade input
     const handleGradeChange = (studentId, grade) => {
         setGradingData((prev) => ({ ...prev, [studentId]: grade }));
     };
 
     // Handle feedback input
     const handleFeedbackChange = (studentId, feedback) => {
         setFeedbackData((prev) => ({ ...prev, [studentId]: feedback }));
     };
 
     // Submit grades & feedback to backend
     const submitGrades = async () => {
         const grades = submissions.map((submission) => ({
             studentId: submission.enrollmentNo,  // Use enrollmentNo as studentId
             assignmentId: submission.assignmentId,
             grade: gradingData[submission.enrollmentNo] || null,  //  Send stored grade
             feedback: feedbackData[submission.enrollmentNo] || "", // Send stored feedback
         }));
         console.log(grades)
         try {
             await axios.post(`${baseApiURL()}/assignments/assign-grade`, { grades });
             setGradeMessage("Grades submitted successfully!");
             setShowGrades(false);  // 
         } catch (error) {
             console.error("Error submitting grades:", error);
         }
     };
 
 
     return showUpload ? <UploadAssignment /> : (
         <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg flex flex-col">
             <h2 className="text-3xl font-bold mb-6 text-center">Uploaded Assignments</h2>
     
             {/* Assignment List */}
             {assignments.length === 0 ? (
                 <p className="text-gray-500 flex-grow text-center">No assignments available.</p>
             ) : (
                 <div className="flex-grow">
                     {assignments.map(assignment => (
                     <div 
                         key={assignment._id} 
                         className="p-4 border rounded-lg mb-4 cursor-pointer hover:bg-gray-100 flex justify-between items-start"
                         onClick={() => setSelectedAssignment(assignment)}
                     >
                         {/* Left Side - Title & Deadline */}
                         <div>
                             <h3 className="text-xl font-semibold">{assignment.title}</h3>
                             <p className="text-gray-600">Deadline: {new Date(assignment.deadline).toLocaleDateString()}</p>
                         </div>
     
                         {/* Right Side - Subject & Points */}
                         <div className="text-right">
                             <p className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                                 {assignment.subject}
                             </p>
                             <p className="text-gray-700 font-semibold mt-1">{assignment.totalPoints} pts</p>
                         </div>
                     </div>
                 ))}
             </div>
     
             )}
             <div className="mt-auto flex justify-center">
                 <button 
                     onClick={() => setShowUpload(true)}
                     className="bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-800 transition duration-300"
                 >
                     + Add Assignment  
                 </button>
             </div>
     
             {/* Selected Assignment Details */}
             {selectedAssignment && (
                 <div className="p-8 border rounded-lg shadow-lg bg-white max-w-4xl mt-8">
                     <h3 className="text-3xl font-bold text-gray-900 mb-6">{selectedAssignment.title}</h3>
                     <p className="text-gray-700 mt-2"><strong>Description:</strong> {selectedAssignment.description}</p>
                     <p className="text-gray-700"><strong>Deadline:</strong> {new Date(selectedAssignment.deadline).toLocaleDateString()}</p>
                     
                     <div className="mt-4">
                         <a 
                             href={`http://localhost:5000/media/${selectedAssignment.filePath}`} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className=" text-blue-600 underline"
                         >
                             Download Assignment
                         </a>
                     </div>
     
                     <div className="mt-6 flex justify-between">
                         <button 
                             onClick={() => setSelectedAssignment(null)}
                             className="bg-gray-600 text-white px-4 py-2 w-[150px] rounded-lg hover:bg-gray-700"
                         >
                             Back
                         </button>
                         <button 
                             onClick={() => fetchSubmissions(selectedAssignment._id)}
                             className="bg-green-600 text-white px-6 py-3 w-[150px] rounded-lg hover:bg-green-700 transition"
                         >
                             Grade
                         </button>
                     </div>
                 </div>
             )}
     
             {/* Submissions Modal */}
             {showSubmissionsModal && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                     <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
                         <h3 className="text-xl font-bold mb-4">Student Submissions</h3>
                         
                         <table className="w-full border-collapse border">
                             <thead>
                                 <tr className="bg-gray-100">
                                     <th className="border p-2">Student ID</th>
                                     <th className="border p-2">Student Name</th>
                                     <th className="border p-2">Submission</th>
                                     <th className="border p-2">Grade</th>
                                     <th className="border p-2">Feedback</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {submissions.map((submission) => (
                                     <tr key={submission.enrollmentNo} className="border">
                                         <td className="border p-2 text-center">{submission.enrollmentNo}</td>
                                         <td className="border p-2 text-center">{submission.studentName}</td>
                                         <td className="border p-2 text-center">
                                         {submission.filePath && (
                                             <a 
                                                 href={`http://localhost:5000/media/${submission.filePath}`} 
                                                 target="_blank" 
                                                 rel="noopener noreferrer" 
                                                 className="text-blue-600 underline"
                                             >
                                                 Download
                                             </a>
                                         )}
                                         </td>
                                         <td className="border p-2 text-center">
                                             <input 
                                                 type="number"
                                                 value={gradingData[submission.enrollmentNo] || ""}
                                                 onChange={(e) => handleGradeChange(submission.enrollmentNo, e.target.value)}
                                                 className="border p-1 w-16 text-center rounded"
                                             />
                                         </td>
                                         <td className="border p-2 text-center">
                                         <textarea
                                             value={feedbackData[submission.enrollmentNo] || ""}
                                             onChange={(e) => handleFeedbackChange(submission.enrollmentNo, e.target.value)}
                                             className="border p-1 w-full text-center rounded"
                                             rows="2"
                                             placeholder="Enter feedback"
                                         />
                                         </td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
     
                         <div className="flex justify-end space-x-4 mt-4">
                             <button 
                                 onClick={() => setShowSubmissionsModal(false)}
                                 className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                             >
                                 Cancel
                             </button>
                             <button 
                                 onClick={submitGrades}
                                 className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                             >
                                 Submit Grades
                             </button>
                         </div>
                         {gradeMessage && <p className="text-green-600 mt-2">{gradeMessage}</p>}
                     </div>
                 </div>
             )}
         </div>
     );
 }    