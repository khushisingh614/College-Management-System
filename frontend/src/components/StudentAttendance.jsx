
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Pie } from "react-chartjs-2";

// const StudentAttendance = ({ studentId }) => {
//     const [attendanceData, setAttendanceData] = useState([]);

//     useEffect(() => {
//         axios.get(`http://localhost:5001/api/student/attendance/${studentId}`)
//             .then(response => setAttendanceData(response.data))
//             .catch(error => console.error("Error fetching attendance:", error));
//     }, [studentId]);

//     return (
//         <div>
//             <h2 className="text-2xl font-bold mb-4">📊 Attendance Overview</h2>
//             {attendanceData.map((subjectData, index) => {
//                 const attendancePercentage = ((subjectData.attendedClasses / subjectData.totalClasses) * 100).toFixed(2);
//                 const chartColor = attendancePercentage < 75 ? "red" : "green";

//                 const pieData = {
//                     labels: ["Attended", "Missed"],
//                     datasets: [{
//                         data: [subjectData.attendedClasses, subjectData.totalClasses - subjectData.attendedClasses],
//                         backgroundColor: [chartColor, "gray"]
//                     }]
//                 };

//                 return (
//                     <div key={index} className="mb-6 p-4 border rounded-lg shadow-lg">
//                         <h3 className="text-lg font-semibold">{subjectData.subject}</h3>
//                         <Pie data={pieData} />
//                         <p className="text-center font-bold">Attendance: {attendancePercentage}%</p>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };

// export default StudentAttendance;