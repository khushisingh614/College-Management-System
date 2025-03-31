import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const API_BASE_URL = baseApiURL();

const StudentAttendance = ({ studentId }) => {
    const [attendanceData, setAttendanceData] = useState([]);

    const fetchAttendance = useCallback(async () => {
        if (!studentId) {
            console.error("Student ID is required");
            return;
        }
    
        try {
            const response = await axios.get(`${API_BASE_URL}/attendance/${studentId}`);
            setAttendanceData(response.data);
            console.log("Attendance Data:", response.data);
        } catch (error) {
            console.error("Error fetching attendance", error.response ? error.response.data : error);
        }
    }, [studentId]); // Removed API_BASE_URL from the dependency array

    useEffect(() => {
        fetchAttendance();
    }, [fetchAttendance]);

    const calculatePercentage = (subjectId) => {
        const subjectData = attendanceData.filter(record => record.subjectId === subjectId);
        const total = subjectData.length;
        const attended = subjectData.filter(record => record.status === "present").length;
        return total === 0 ? 0 : Math.round((attended / total) * 100);
    };

    const chartData = [...new Set(attendanceData.map(record => record.subjectId))].map(subjectId => ({
        subject: subjectId,
        percentage: calculatePercentage(subjectId),
    }));

    const COLORS = chartData.map(d => (d.percentage < 75 ? "red" : "green"));

    return (
        <div>
            <h2>Student Attendance</h2>
            <PieChart width={400} height={400}>
                <Pie data={chartData} dataKey="percentage" nameKey="subject" cx="50%" cy="50%" outerRadius={150} label>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
};

export default StudentAttendance;