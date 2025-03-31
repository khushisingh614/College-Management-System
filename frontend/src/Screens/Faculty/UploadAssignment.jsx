import React, { useState } from "react";
 import axios from "axios";
 import { baseApiURL } from "../../baseUrl";
 import Dashboard from "./AssignmentDashboard";
 
 const UploadAssignment = () => {
   const [file, setFile] = useState(null);
   const [title, setTitle] = useState("");
   const [subject, setSubject] = useState("");
   const [description, setDescription] = useState(""); // Optional
   const [totalPoints, setTotalPoints] = useState(""); // New Field
   const [professorId, setProfessorId] = useState(""); // New Field
   const [deadline, setDeadline] = useState(new Date().toISOString().split("T")[0]); // Default: Today
   const [message, setMessage] = useState("");
   const [loading, setLoading] = useState(false); // Prevent multiple clicks
   const [goback, setGoBack] = useState(false);
 
   const handleUpload = async () => {
     if (!title || !subject || !deadline || !professorId || !totalPoints || !file) {
       return setMessage("All fields except description and file are required.");
     }
 
     const formData = new FormData();
     formData.append("title", title);
     formData.append("subject", subject);
     formData.append("deadline", deadline);
     formData.append("totalPoints", totalPoints);
     formData.append("professorId", professorId);
     formData.append("type", "assignments");
     if (description) formData.append("description", description); // ✅ Add only if provided
     if (file) formData.append("assignments", file); // ✅ Add only if provided
 
     setLoading(true);
     setMessage("");
     console.log("FormData:", Object.fromEntries(formData.entries()));
 
     try {
       const response = await axios.post(`${baseApiURL()}/assignments/upload`, formData, {
         headers: { "Content-Type": "multipart/form-data" },
       });
 
       setMessage(response.data.message);
       setTitle("");
       setSubject("");
       setDescription(""); // Reset description
       setTotalPoints("");
       setProfessorId("");
       setDeadline(new Date().toISOString().split("T")[0]); // Reset deadline
       setFile(null);
     } catch (error) {
       setMessage(error.response?.data?.message || "Error uploading assignment");
     } finally {
       setLoading(false);
       setGoBack(true);
     }
   };
 
   return goback ? < Dashboard/> : (
     <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
       <h2 className="text-xl font-bold mb-4 text-gray-800">Upload Assignment</h2>
 
       <input 
         className="w-full p-2 border rounded mb-3" 
         type="text" placeholder="Professor ID (Required)" 
         value={professorId} 
         onChange={(e) => setProfessorId(e.target.value)} 
       />
 
       <input 
         className="w-full p-2 border rounded mb-3" 
         type="text" placeholder="Title (Required)" 
         value={title} 
         onChange={(e) => setTitle(e.target.value)} 
       />
       
       <input 
         className="w-full p-2 border rounded mb-3" 
         type="text" placeholder="Subject (Required)" 
         value={subject} 
         onChange={(e) => setSubject(e.target.value)} 
       />
 
       <textarea 
         className="w-full p-2 border rounded mb-3" 
         placeholder="Description (Optional)" 
         value={description} 
         onChange={(e) => setDescription(e.target.value)} 
       />
 
       <input 
         className="w-full p-2 border rounded mb-3" 
         type="number" placeholder="Total Points (Required)" 
         value={totalPoints} 
         onChange={(e) => setTotalPoints(e.target.value)} 
       />
 
       <input 
         className="w-full p-2 border rounded mb-3" 
         type="date" 
         value={deadline} 
         onChange={(e) => setDeadline(e.target.value)} 
       />
 
       <input 
         className="w-full p-2 border rounded mb-3" 
         type="file" 
         onChange={(e) => setFile(e.target.files[0])} 
       />
 
       <button 
         className={`w-full p-2 rounded ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white`} 
         onClick={handleUpload} 
         disabled={loading}
       >
         {loading ? "Uploading..." : "Upload"}
       </button>
 
       {message && <p className="mt-2 text-center text-green-600">{message}</p>}
     </div>
   );
 };
 
 export default UploadAssignment;