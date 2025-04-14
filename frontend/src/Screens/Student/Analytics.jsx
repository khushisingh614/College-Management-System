import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import baseUrl, { baseApiURL } from '../../baseUrl';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [gradeData, setGradeData] = useState([]);
  const [internalMarks, setInternalMarks] = useState({});
  const [externalMarks, setExternalMarks] = useState({});
  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await axios.post(`${baseApiURL()}/analytics/get-grade`, {
          studentId,
        });
          console.log(gradeData);
          setGradeData(res.data);
        
      } catch (error) {
        console.error("Error fetching grade analytics:", error);
      }
    };

    fetchGrades();

  },[]);
  
  useEffect(() => {

    const fetchMarks = async () => {
      try {
        const res = await axios.post(`${baseApiURL()}/analytics/get-marks`, {
          enrollmentNo: studentId,
        });
        setInternalMarks(res.data.internal || {});
        setExternalMarks(res.data.external || {});
      } catch (error) {
        console.error('Marks fetch error:', error);
      }
    };

    fetchMarks();
  }, []);

  const sortedData = [...gradeData].sort(
    (a, b) => new Date(a.gradedAt) - new Date(b.gradedAt)
  );

  
  const data = {
    labels: sortedData.map(entry =>
      new Date(entry.gradedAt).toLocaleTimeString('en-IN', { day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit' 
      }))
    ,
    datasets: [
      {
        label: "Assignment Grade % Over Time",
        data: sortedData.map((entry) => entry.percentage),
        fill: true,
        backgroundColor: "rgba(51, 178, 220, 0.3)", // Light blue shaded area
        borderColor: "#3b82f6", // Blue line
        pointBackgroundColor: "#1e40af", // Dot color
        pointRadius: 6, // Bigger dots
        tension: 0.4, // Smooth curves
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14,
            weight: 'bold',
          },
          color: 'lightblue',
        },
      },
      tooltip: {
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        backgroundColor: 'white',
        titleColor: '#fff',
        bodyColor: '#ddd',
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 13,
            weight: 'bold',
          },
          color: 'lightblue',
        },
        title: {
          display: true,
          text: 'Date & Time',
          font: {
            size: 19,
            weight: 'bold',
            color:'darkgreen'
          },
          color: 'lightgreen',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 13,
            weight: 'bold',
          },
          color: 'lightgreen',
        },
        title: {
          display: true,
          text: 'Percentage (%)',
          font: {
            size: 19,
            weight: 'bold',
          },
          color: 'green',
        },
      },
    },
  };
  const labelStyle = 'text-sm text-gray-700 text-center mb-2 font-medium';

  const generateColors = (n) =>
    Array.from({ length: n }, (_, i) => `hsl(${(i * 360) / n}, 70%, 60%)`);
  const subjectKeys = Object.keys(internalMarks);
  const colors = generateColors(subjectKeys.length);

  const getChartData = (marksObj) => ({
    labels: Object.keys(marksObj),
    datasets: [
      {
        label: 'Marks',
        data: Object.values(marksObj),
        backgroundColor: colors,
        borderWidth: 0,
      },
    ],
  });

  const cardStyle =
    'bg-white shadow-md border border-gray-200 rounded-2xl p-5 flex flex-col items-center';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-white-800">Student Performance Analytics</h2>

      {/* Grid of cards */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">

        {/* Internal vs External Comparison */}
        <div className={cardStyle}>
          <p className={labelStyle}>Internal vs External Comparison</p>
          <Bar
            data={{
              labels: subjectKeys,
              datasets: [
                {
                  label: 'Internal',
                  data: subjectKeys.map((k) => internalMarks[k]),
                  backgroundColor: 'rgba(59,130,246,0.7)',
                },
                {
                  label: 'External',
                  data: subjectKeys.map((k) => externalMarks[k]),
                  backgroundColor: 'rgba(239,68,68,0.7)',
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </div>

        {/* Assignment Grade Trend */}
        {gradeData.length === 0 ? (
          <p className="text-center text-gray-500">No grade data available.</p>
        ) : (
          <div className="mt-6 bg-white p-2">
            <h3 className="text-xl font-bold mb-2 text-center mt-6 mb-4">Assignment Marks over Time</h3>
            <Line data={data} options={options} />
          </div>
        )}

        {/* Attendance */}
        <div className={cardStyle}>
          <p className={labelStyle}>Attendance</p>
          <Bar
            data={{
              labels: ['Machine Learning', 'Network & System Securities'],
              datasets: [
                {
                  label: 'Attendance (%)',
                  data: [85, 78],
                  backgroundColor: 'rgba(34,197,94,0.7)',
                },
              ],
            }}
            options={{
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, max: 100 },
              },
            }}
          />
        </div>

        {/* CGPA Progression */}
        <div className={cardStyle}>
          <p className={labelStyle}>CGPA Progression</p>
          <Line
            data={{
              labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5'],
              datasets: [
                {
                  label: 'CGPA',
                  data: [8.1, 8.3, 8.7, 9.0, 8.8],
                  borderColor: '#8b5cf6',
                  backgroundColor: 'rgba(139,92,246,0.3)',
                  fill: true,
                },
              ],
            }}
            options={{
              plugins: { legend: { display: false } },
              scales: { y: { min: 0, max: 10 } },
            }}
          />
        </div>

        {/* Extra Activities */}
        <div className={`${cardStyle} md:col-span-2 flex justify-center`}>
          <div className="w-full md:w-[60%]">
            <p className={labelStyle}>Extra Activities</p>
            <Doughnut
              data={{
                labels: ['Hackathons', 'Clubs', 'Workshops', 'Sports'],
                datasets: [
                  {
                    data: [4, 3, 6, 2],
                    backgroundColor: [
                      '#3b82f6',
                      '#facc15',
                      '#22c55e',
                      '#ef4444',
                    ],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { boxWidth: 12 },
                  },
                },
              }}
            />
          </div>
        </div>


      </div>
    </div>
  );
};

export default Analytics;
