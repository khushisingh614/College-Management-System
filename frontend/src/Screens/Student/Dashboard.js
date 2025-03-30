import { useState, useEffect } from "react";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";
import SubmitAssignment from "./SubmitAssignment";
import { use } from "react";

function Dashboard({id}) {
    const studentId = id;
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [showUpload, setShowUpload] = useState(false);
    const [showGrades, setShowGrades] = useState(false);
    const [grades, setGrades] = useState(null);
    //Offline storage
    const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

if (!indexedDB) {
  console.log("IndexedDB could not be found in this browser.");
}
const dbName = "AssignmentsDatabase";
const storeName = "assignments";



const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 3);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: "_id" });
                    console.log("Object store 'assignments' created.");
                }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Error opening IndexedDB");
    });
};

// Store assignments in IndexedDB
const saveAssignmentsToDB = async (data) => {
    if (!data || data.length === 0) return; // Avoid saving empty data

        const db = await openDB();
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        
        data.forEach(assignment => {
            if (assignment._id) store.put(assignment);
        });

        return new Promise((resolve) => {
            tx.oncomplete = () => resolve();
        });
};

// Retrieve assignments from IndexedDB
const getAssignmentsFromDB = async () => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Error retrieving assignments");
    });
};

const deleteAssignmentsFromDB = async () => {
    try {
        const db = await openDB();
        const tx = db.transaction(storeName, "readwrite"); // Open in readwrite mode
        const store = tx.objectStore(storeName);
        
        await store.clear(); // Clear all stored assignments
        console.log("Offline assignments deleted from IndexedDB.");
    } catch (error) {
        console.error("Error deleting assignments from IndexedDB:", error);
    }
};

// Listen for online event and delete IndexedDB data
useEffect(() => {
    window.addEventListener("online", deleteAssignmentsFromDB);
    return () => window.removeEventListener("online", deleteAssignmentsFromDB);
}, []);

   
    const storedSubmissionId = localStorage.getItem("submissionId");  // Retrieve from localStorage
    
    
    // Fetch assignments on load
    useEffect(() => {
        axios.get(`${baseApiURL()}/assignments`)
            .then(res => {
                setAssignments(res.data);
                saveAssignmentsToDB(res.data);
            })
            .catch(async () => {
                console.log("Offline! Retrieving from IndexedDB...");
                const offlineData = await getAssignmentsFromDB();
                setAssignments(offlineData);
            });
    }, []);

    // Fetch grades when showGrades is true
    useEffect(() => {
        if (showGrades && selectedAssignment) {
            getGrades();
        }
    }, [showGrades]);

    const getGrades = async () => {
        try {
            const gradeEntries = {
                studentId: storedSubmissionId,
                assignmentId: selectedAssignment._id
            };

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
            setGrades({ message: "Failed to retrieve grades." });
        }
    };

    return showUpload ? (
        <SubmitAssignment id={selectedAssignment._id} deadline={selectedAssignment.deadline} />
    ) : (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg flex flex-col">
            <h2 className="text-3xl font-bold mb-6 text-center">My Assignments</h2>

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
                            <div>
                                <h3 className="text-xl font-semibold">{assignment.title}</h3>
                                <p className="text-gray-600">Deadline: {new Date(assignment.deadline).toLocaleDateString()}</p>
                            </div>
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

            {selectedAssignment && (
                <div className="p-8 border rounded-lg shadow-lg bg-white max-w-4xl mt-8">
                    <div className="flex justify-between">
                        <h3 className="text-3xl font-bold text-gray-900 mb-6">{selectedAssignment.title}</h3> 
                        <button onClick={()=>setShowGrades(true)}
                        className="bg-blue-700 text-white px-6 py-2 w-[150px] mt--7 rounded-md h-[45px] hover:bg-blue-800 transition">See Grades</button>
                    </div>
                    <p className="text-gray-700 mt-2"><strong>Description:</strong> {selectedAssignment.description}</p>
                    <p className="text-gray-700"><strong>Deadline:</strong> {new Date(selectedAssignment.deadline).toLocaleDateString()}</p>
                    {selectedAssignment.filePath && (
                        <div className="mt-4">
                            <a 
                                href={`http://localhost:5000/media/${selectedAssignment.filePath}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 underline"
                            >
                                Download Assignment
                            </a>
                        </div>
                    )}
                    <div className="mt-6 flex justify-between">
                        <button 
                            onClick={() => setSelectedAssignment(null)}
                            className="bg-gray-600 text-white px-4 py-2 w-[150px] rounded-lg hover:bg-gray-700"
                        >
                            Back
                        </button>
                        <button 
                            onClick={() => { setShowUpload(true)} 
                        }
                            className="bg-green-600 text-white px-6 py-3 w-[150px] rounded-lg hover:bg-green-700 transition"
                        >
                         Submit
                        </button> 
                    </div>
                </div>
            )}

            {showGrades && grades && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full h-[200px] relative">
                        <button 
                            onClick={() => setShowGrades(false)} 
                            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
                        >
                            &times;
                        </button>

                        <h3 className="text-2xl font-bold mb-4 text-center">Grades</h3>
                        {grades.message == "Failed to retrieve grades." || grades.message == "Grades not available yet!" ? (
                            <p className="text-red-600 text-[20px] text-center">{grades.message}</p>
                        ) : (
                            <div>
                                <p className=" text-gray-800 text-[22px] "><strong className="text-green-800">Grade:</strong> {grades.grade}</p>
                                {grades.feedback && <p className=" text-gray-800 text-[22px] "><strong className="text-green-800">Feedback:</strong> {grades.feedback}</p>}
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}

export default Dashboard;