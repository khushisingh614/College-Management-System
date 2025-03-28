import { useState, useEffect } from "react";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";
import SubmitAssignment from "./SubmitAssignment";
import { use } from "react";

export default function Dashboard({id}) {
    const studentId = id;
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [showUpload, setShowUpload] = useState(false);
    const [showGrades, setShowGrades] = useState(false);
    const [grades, setGrades] = useState(null);
    //const [button,setButton] = useState("");
   
    const storedSubmissionId = localStorage.getItem("submissionId");  // Retrieve from localStorage
    
    
    // Fetch assignments on load
    useEffect(() => {
        axios.get(`${baseApiURL()}/assignments`)
            .then(res => setAssignments(res.data))
            .catch(err => console.error("Error fetching assignments:", err));
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
