import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";
import Dashboard from "./Dashboard";

const SubmitAssignment = (id) => {
  //console.log(id)
  const assignmentId = id.id
  const deadline = id.deadline
  //const [submissionId, setSubmissionId] = useState(0);
  const [file, setFile] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [message, setMessage] = useState("");
  const [success,setSuccess] = useState(false);


  const handleUpload = async () => {
    if (!file) return setMessage("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("studentName", studentName);
    formData.append("enrollmentNo", enrollmentNo);
    formData.append("assignmentId", assignmentId);
    formData.append("deadline", deadline);

    try {
      const response = await axios.post(`${baseApiURL()}/assignments/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message);
      //setSubmissionId(response.data.submissionId);
      localStorage.setItem("submissionId", response.data.submissionId);
      setSuccess(true)
    } catch (error) {
      setMessage("Error submitting assignment");
    }
  };

  return success ? <Dashboard /> : (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Submit Assignment</h2>
      <input className="w-full p-2 border rounded mb-3" type="text" placeholder="Your Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
      <input className="w-full p-2 border rounded mb-3" type="text" placeholder="Enrollment No." value={enrollmentNo} onChange={(e) => setEnrollmentNo(e.target.value)} />
      <input className="w-full p-2 border rounded mb-3" type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600" onClick={handleUpload}>Submit</button>
      {message && <p className="text-green-600 mt-2">{message}</p>}
    </div>
  );
};

export default SubmitAssignment;

