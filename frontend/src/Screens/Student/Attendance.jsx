import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { baseApiURL } from "../../baseUrl";
import { useSelector } from "react-redux";
import Heading from "../../components/Heading";

const StudentAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const studentId = useSelector((state) => state.userData?._id) || "";

  useEffect(() => {
    if (studentId) fetchAttendance();
  }, [studentId]);

  const fetchAttendance = async () => {
    console.log(1);
    try {
      setLoading(true);
      const response = await axios.get(`${baseApiURL()}/attendance/getAttendanceByStudent/${studentId}`);
      
      if (response.data.success) {
        const formattedData = response.data.attendanceSummary.map(record => ({
          ...record,
          attendancePercentage: Number(record.attendancePercentage) || 0, // ✅ Fix applied
        }));
        setAttendanceRecords(formattedData);
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
      <Heading title="My Attendance" />
      {loading ? (
        <p className="text-center text-gray-600">Loading attendance records...</p>
      ) : attendanceRecords.length === 0 ? (
        <p className="text-center text-gray-600">No attendance data found.</p>
      ) : (
        <div className="mt-4 bg-blue-50 p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-3 gap-4 font-semibold border-b pb-2">
            <span>Subject</span>
            <span>Attendance %</span>
            <span>Status</span>
          </div>
          {attendanceRecords.map((record) => (
            <div key={record.subjectId} className="grid grid-cols-3 gap-4 items-center py-2 border-b">
              <span className="text-lg">{record.subjectName}</span>
              
              {/* Attendance Bar */}
              <div className="w-full bg-gray-300 rounded-full h-4 relative">
                <div
                  className={`h-4 rounded-full ${record.attendancePercentage >= 75 ? "bg-green-500" : "bg-red-500"}`}
                  style={{ width: `${record.attendancePercentage}%` }}
                ></div>
                <span className="absolute inset-0 flex justify-center items-center text-sm font-bold text-white">
                  {record.attendancePercentage.toFixed(1)}%
                </span>
              </div>

              {/* Status */}
              <span className={`px-2 py-1 rounded text-white ${record.attendancePercentage >= 75 ? "bg-green-600" : "bg-red-600"}`}>
                {record.attendancePercentage >= 75 ? "Eligible" : "Not Eligible"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;