
import React, { useState } from "react";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";

const MarkAttendance = () => {
    const [attendanceData, setAttendanceData] = useState({
        studentId: "",
        subjectId: "",
        date: "",
        status: "present",
        recordedBy: "",
    });

    const handleChange = (e) => {
        setAttendanceData({ ...attendanceData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const API_BASE_URL = baseApiURL(); // Call the function to get the API link
        console.log("API Base URL:", API_BASE_URL); // Debugging
    
        try {
            await axios.post(`${API_BASE_URL}/attendance/mark`, attendanceData);
            alert("Attendance marked successfully!");
        } catch (error) {
            console.error("Error marking attendance", error.response ? error.response.data : error);
            alert("Error marking attendance! Check console.");
        }
    };

    return (
        <div>
            <h2>Mark Attendance</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="studentId" placeholder="Student ID" onChange={handleChange} required />
                <input type="text" name="subjectId" placeholder="Subject ID" onChange={handleChange} required />
                <input type="date" name="date" onChange={handleChange} required />
                <select name="status" onChange={handleChange}>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                </select>
                <input type="text" name="recordedBy" placeholder="Faculty ID" onChange={handleChange} required />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default MarkAttendance;
