import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { baseApiURL } from "../../../baseUrl";
import { useSelector } from "react-redux";

const FacultyViewAttendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [studentsAttendance, setStudentsAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  const facultyId = useSelector((state) => state.userData?._id) || "";

  useEffect(() => {
    if (facultyId) fetchSubjects();
  }, [facultyId]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${baseApiURL()}/subject/getSubject`);
      if (response.data.success) {
        setSubjects(response.data.subject);
      } else {
        toast.error("Failed to fetch subjects");
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Error fetching subjects");
    }
  };

  const fetchAttendance = async (subjectId) => {
    if (!subjectId) {
      setStudentsAttendance([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${baseApiURL()}/attendance/getAttendanceBySubject/${subjectId}`);

      if (response.data.success) {
        setStudentsAttendance(response.data.attendanceRecords);
      } else {
        toast.error("No attendance records found");
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Error fetching attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[70%] mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">View Attendance</h2>

      {/* Subject Selection */}
      <select
        className="w-full p-2 border rounded"
        value={selectedSubject}
        onChange={(e) => {
          setSelectedSubject(e.target.value);
          fetchAttendance(e.target.value);
        }}
      >
        <option value="">Select Subject</option>
        {subjects.map((subject) => (
          <option key={subject._id} value={subject._id}>
            {subject.name}
          </option>
        ))}
      </select>

      {loading ? (
        <p className="text-center text-gray-600">Loading attendance records...</p>
      ) : studentsAttendance.length === 0 ? (
        <p className="text-center text-gray-600">No attendance data found.</p>
      ) : (
        <div className="mt-4 bg-blue-50 p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-3 gap-4 font-semibold border-b pb-2">
            <span>Student</span>
            <span>Attendance %</span>
            <span>Status</span>
          </div>

          {studentsAttendance.map((student) => (
            <div key={student.studentId} className="grid grid-cols-3 gap-4 items-center py-2 border-b">
              <span className="text-lg">{`${student.enrollmentNo} | ${student.firstName} ${student.lastName}`}</span>
              
              {/* Attendance Bar */}
              <div className="w-full bg-gray-300 rounded-full h-4 relative">
                <div
                  className={`h-4 rounded-full ${student.attendancePercentage >= 75 ? "bg-green-500" : "bg-red-500"}`}
                  style={{ width: `${student.attendancePercentage.toFixed(1)}%` }}
                ></div>
                <span className="absolute inset-0 flex justify-center items-center text-sm font-bold text-white">
                  {student.attendancePercentage ? student.attendancePercentage.toFixed(1) : "0.0"}%
                </span>
              </div>

              {/* Status */}
              <span
                className={`px-2 py-1 rounded text-white ${
                  student.attendancePercentage >= 75 ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {student.attendancePercentage >= 75 ? "Eligible" : "Not Eligible"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyViewAttendance;
