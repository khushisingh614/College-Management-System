import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";
import Dashboard from "./AssignmentDashboard";
import {
  openDB,
  getSubmissionsFromDB,
  deleteSubmissionFromDB,
  syncSubmissionsToBackend,
} from "../../utils/sync"; // Adjust the path accordingly


const SubmitAssignment = ({id, onClose}) => {
  const assignmentId = id.id;
  const deadline = id.deadline;
  
  const [file, setFile] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [message, setMessage] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);

    //Offline storage
    const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

  const dbName = "SubmissionsDatabase";
  const storeName = "submissions";


  // Store submissions in IndexedDB (Offline)
  const saveSubmissionToDB = async (submission) => {
    if (!submission) return;
    const submissionobj = {};
    submission.forEach((value, key) => {
      submissionobj[key] = value;
    });
    const db = await openDB(dbName,storeName);
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.put(submissionobj); //saves file,studentName,enrollmentNo,assignmentId,deadline
  };

  // Listen for the online event to trigger syncing
  useEffect(() => {
    const handleOnline = () => {
      console.log("Back online, syncing submissions...");
      syncSubmissionsToBackend();
    };
  
    // Always check once on component mount
    if (navigator.onLine) {
      handleOnline();
    }
  
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);
  

  // Handle file submission
  const handleUpload = async () => {
    if (!file) return setMessage("Please select a file");

    const formData = new FormData();
    formData.append("studentName", studentName);
    formData.append("enrollmentNo", enrollmentNo);
    formData.append("assignmentId", assignmentId);
    formData.append("deadline", deadline);
    formData.append("type", "submitassignments");
    formData.append("submitassignments", file);

    if (navigator.onLine) {
      // Online submission
      try {
        const response = await axios.post(`${baseApiURL()}/assignments/submit`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setMessage(response.data.message);
        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
      } catch (error) {
        setMessage("Error submitting assignment");
      }
    } else {
      await saveSubmissionToDB(formData);
      setMessage("Submission saved offline! It will sync automatically when online.");
    }
  };

  if (showDashboard) {
    return <Dashboard />;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Submit Assignment</h2>
      <input className="w-full p-2 border rounded mb-3" type="text" placeholder="Your Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
      <input className="w-full p-2 border rounded mb-3" type="text" placeholder="Enrollment No." value={enrollmentNo} onChange={(e) => setEnrollmentNo(e.target.value)} />
      <input className="w-full p-2 border rounded mb-3" type="file" onChange={(e) => setFile(e.target.files[0])} />
      <div className="mt-6 flex justify-between items-center gap-4">
      <button
        onClick={onClose}
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 w-1/2"
      >
        Close
      </button>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-1/2"
        onClick={handleUpload}
      >
        Submit
      </button>
      </div>


      {message && <p className="text-green-600 mt-2">{message}</p>}
    </div>
  );
};

export default SubmitAssignment;

  