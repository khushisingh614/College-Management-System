import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";
import Dashboard from "./AssignmentDashboard";

const SubmitAssignment = (id) => {
  const assignmentId = id.id;
  //console.log(assignmentId)
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

  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 5);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: "_id", autoIncrement: true });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject("Error opening IndexedDB");
    });
  };

  // Store submissions in IndexedDB (Offline)
  const saveSubmissionToDB = async (submission) => {
    if (!submission) return;
    const submissionobj = {};
    submission.forEach((value, key) => {
      submissionobj[key] = value;
    });
    const db = await openDB();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.put(submissionobj); //saves file,studentName,enrollmentNo,assignmentId,deadline
  };

  // Retrieve submissions from IndexedDB
  const getSubmissionsFromDB = async () => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject("Error retrieving submissions");
    });
  };

  // Delete a submission from IndexedDB after syncing
  const deleteSubmissionFromDB = async (submissionId) => {
    const db = await openDB();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.delete(submissionId);
  };

  // Sync offline submissions when back online
  const syncSubmissionsToBackend = async () => {
    const submissions = await getSubmissionsFromDB();

    for (let submission of submissions) {
      const formData = new FormData();
      Object.entries(submission).forEach(([key, value]) => {
        formData.append(key, value);
      });
      try {
        const response = await axios.post(`${baseApiURL()}/assignments/submit`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.status === 200) {
          console.log(`Submission ${submission._id} synced successfully`);
          await deleteSubmissionFromDB(submission._id);
        }
      } catch (error) {
        console.error(`Failed to sync submission ${submission.submissionId}:`, error);
      }
    }
  };

  // Listen for the online event to trigger syncing
  useEffect(() => {
    window.addEventListener("online", syncSubmissionsToBackend);
    return () => window.removeEventListener("online", syncSubmissionsToBackend);
  }, []);

  // Handle file submission
  const handleUpload = async () => {
    if (!file) return setMessage("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("studentName", studentName);
    formData.append("enrollmentNo", enrollmentNo);
    formData.append("assignmentId", assignmentId);
    formData.append("deadline", deadline);

    if (navigator.onLine) {
      // Online submission
      try {
        const response = await axios.post(`${baseApiURL()}/assignments/submit`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setMessage(response.data.message);
        localStorage.setItem("submissionId", response.data.submissionId);
        setTimeout(() => setShowDashboard(true), 1000);
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
      <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600" onClick={handleUpload}>Submit</button>
      {message && <p className="text-green-600 mt-2">{message}</p>}
    </div>
  );
};

export default SubmitAssignment;

  /*const handleUpload = async () => {
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
      localStorage.setItem("submissionId", response.data.submissionId);

  
        setTimeout(() => setShowDashboard(true), 1000);
      
    } catch (error) {
      setMessage("Error submitting assignment");
    }
  };*/
