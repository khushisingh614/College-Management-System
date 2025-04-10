import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";
import SubmitAssignment from "./SubmitAssignment";
import { use } from "react";

const AssignmentDashboard = () => {
  const studentId = localStorage.getItem("studentId")
  const enrollmentNo=studentId
  const branch= localStorage.getItem("branch");
  //const branch = b.replace(/ /g, "-");
  const semester = localStorage.getItem("semester")

  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [pastdue, setPastdue] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showGrades, setShowGrades] = useState(false);
  const [grades, setGrades] = useState(null);

  // Inline IndexedDB setup
  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("AssignmentDB", 1);
      request.onerror = () => reject("Error opening DB");
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("assignments")) {
          db.createObjectStore("assignments", { keyPath: "_id" });
        }
      };
    });
  };

  const saveToDB = async (data, status) => {
    if (!data || data.length === 0) return;
    const db = await openDB();
    const tx = db.transaction("assignments", "readwrite");
    const store = tx.objectStore("assignments");
    data.forEach(item => store.put({ ...item, status }));
    return tx.complete;
  };

  const getAllFromDB = async () => {
    const db = await openDB();
    const tx = db.transaction("assignments", "readonly");
    const store = tx.objectStore("assignments");
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject("Error reading from DB");
    });
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const [upRes, compRes, pastRes] = await Promise.all([
          axios.get(`${baseApiURL()}/assignments/upcoming/${branch}/${semester}/${enrollmentNo}`),
          axios.get(`${baseApiURL()}/assignments/completed/${enrollmentNo}`),
          axios.get(`${baseApiURL()}/assignments/pastdue/${branch}/${semester}/${enrollmentNo}`)
        ]);
  
        const upcomingWithStatus = upRes.data.map(a => ({ ...a, status: "upcoming" }));
        const completedWithStatus = compRes.data.map(a => ({ ...a, status: "completed" }));
        const pastdueWithStatus = pastRes.data.map(a => ({ ...a, status: "pastdue" }));
  
        setUpcoming(upcomingWithStatus);
        setCompleted(completedWithStatus);
        setPastdue(pastdueWithStatus);
  
        await saveToDB(upcomingWithStatus, "upcoming");
        await saveToDB(completedWithStatus, "completed");
        await saveToDB(pastdueWithStatus, "pastdue");
  
      } catch (err) {
        const offlineData = await getAllFromDB();
        setUpcoming(offlineData.filter(a => a.status === "upcoming"));
        setCompleted(offlineData.filter(a => a.status === "completed"));
        setPastdue(offlineData.filter(a => a.status === "pastdue"));
      }
    };
  
    fetchAssignments();
  }, [studentId, branch, semester]);
  

    const getGrades = async () => {
        try {
            const gradeEntries = {
                studentId: studentId,
                assignmentId: selectedAssignment._id
            };
            console.log(gradeEntries);
            const res = await axios.post(`${baseApiURL()}/assignments/get-grade`, gradeEntries);
            if (res.data === "null value") {
                setGrades({ message: "Grades not available yet!" });
            } else if (res.data === "Grades not available yet!") {
                setGrades({ message: "Grades not available yet!" });
            } else {
                console.log(res.data);
                setGrades(res.data);
            }
        } catch (error) {
            console.error("Error fetching grades:", error);
            setGrades({ message: "Grades not available yet." });
        }
    };
    useEffect(() => {
        console.log("showGrades:", showGrades);
        console.log("grades:", grades);
      }, [showGrades, grades]);
      
  const renderAssignmentTile = (assignment, setSelectedAssignment) => (
    <div
      key={assignment._id}
      className="p-4 border rounded-lg mb-4 cursor-pointer hover:bg-gray-100 flex justify-between items-start"
      onClick={() => setSelectedAssignment(assignment)}
    >
      {/* Left Side - Title & Deadline */}
      <div>
        <h3 className="text-xl font-semibold">{assignment.title}</h3>
        <p className="text-red-600">
          Deadline: {new Date(assignment.deadline).toLocaleDateString()}
        </p>
      </div>
  
      {/* Right Side - Tags and Points */}
      <div className="text-right space-y-1">
        <p className="text-gray-700 font-semibold">{assignment.totalPoints} pts</p>
        <div className="flex flex-wrap justify-end gap-2">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
            {assignment.subject}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-md">
      <h2 className="text-2xl font-bold mb-6 ">Assignments</h2>
  
      {/* Sections */}
      <div className="space-y-10 ">
        {/* Past Due Assignments */}
        {pastdue.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Past Due</h3>
            <div className="space-y-4">
              {pastdue.map(a => renderAssignmentTile(a, setSelectedAssignment))}
            </div>
          </div>
        )}
  
        {/* Upcoming Assignments */}
        {upcoming.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Upcoming</h3>
            <div className="space-y-4">
              {upcoming.map(a => renderAssignmentTile(a, setSelectedAssignment))}
            </div>
          </div>
        )}
  
        {/* Completed Assignments */}
        {completed.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Completed</h3>
            <div className="space-y-4">
              {completed.map(a => renderAssignmentTile(a, setSelectedAssignment))}
            </div>
          </div>
        )}
      </div>
  
      {/* Assignment Details Modal */}
      {selectedAssignment && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-xl relative">
  
            <h3 className="text-xl font-bold mb-2">{selectedAssignment.title}</h3>
            <p className="text-gray-700 mb-2">{selectedAssignment.description}</p>
            <p className="text-sm text-red-500 mb-4">
              Deadline: {new Date(selectedAssignment.deadline).toLocaleString()}
            </p>
  
            <div className="flex justify-between mt-6">
            <button
                onClick={() => setSelectedAssignment(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
                Close
            </button>

            {(selectedAssignment.status === "upcoming" || selectedAssignment.status === "pastdue") && (
                <button
                onClick={() => {
                    setShowUpload(true);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                Submit
                </button>
            )}

            {selectedAssignment.status === "completed" && (
                <button
                onClick={async () => {
                    try {
                      const gradeEntries = {
                        studentId: studentId,
                        assignmentId: selectedAssignment._id
                      };
                      console.log("Fetching grades with:", gradeEntries);
                
                      const res = await axios.post(`${baseApiURL()}/assignments/get-grade`, gradeEntries);
                      const data = res.data;
                
                      if (data === "null value" || data === "Grades not available yet!") {
                        setGrades({ message: "Grades not available yet!" });
                      } else {
                        setGrades(data);
                      }
                
                      setShowGrades(true); // Show modal after grades are set
                    } catch (error) {
                      console.error("Error fetching grades:", error);
                      setGrades({ message: "Failed to retrieve grades." });
                      setShowGrades(true); // Still show modal with error message
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                See Grades
                </button>
                )}
                </div>

          </div>
        </div>
      )}
  
      {/* Grades Popup */}
      {showGrades && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full h-[200px] relative">
      <button 
        onClick={() => setShowGrades(false)} 
        className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
      >
        &times;
      </button>

      <h3 className="text-2xl font-bold mb-4 text-center">Grades</h3>

      {!grades || grades.message === "Failed to retrieve grades." || grades.message === "Grades not available yet!" ? (
        <p className="text-red-600 text-[20px] text-center">
          {grades?.message || "Grades not available yet."}
        </p>
      ) : (
        <div>
          <p className="text-gray-800 text-[22px]">
            <strong className="text-green-800">Grade:</strong> {grades.grade}
          </p>
          {grades.feedback && (
            <p className="text-gray-800 text-[22px]">
              <strong className="text-green-800">Feedback:</strong> {grades.feedback}
            </p>
          )}
        </div>
      )}
    </div>
  </div>
)}


  
      {/* Submit Assignment Popup */}
        {showUpload && selectedAssignment && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-md bg-black/50 z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-[500px] relative">
            <SubmitAssignment
                id={{
                id: selectedAssignment._id,
                deadline: selectedAssignment.deadline,
                }}
                onClose={() => setShowUpload(false)}
            />
            </div>
        </div>
        )}

    </div>
  );  
};

export default AssignmentDashboard;
