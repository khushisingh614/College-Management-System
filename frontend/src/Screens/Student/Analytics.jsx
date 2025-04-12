import React, {useState,useEffect} from 'react';
import { Line, Bar } from 'react-chartjs-2';
import baseUrl, { baseApiURL } from '../../baseUrl'
import axios from 'axios'
import { Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);


ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const Analytics = () => {
  
  const [gradeData, setGradeData] = useState([]);
  const studentId = localStorage.getItem("studentId")
  const [internalMarks, setInternalMarks] = useState({});
  const [externalMarks, setExternalMarks] = useState({});


  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await axios.post(`${baseApiURL()}/analytics/get-grade`, {
          studentId,
        });
          //console.log(gradeData);
          setGradeData(res.data);
        
      } catch (error) {
        console.error("Error fetching grade analytics:", error);
      }
    };

    fetchGrades();
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
          color: '#333',
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
        backgroundColor: 'rgba(0,0,0,0.8)',
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
          color: '#4B5563',
        },
        title: {
          display: true,
          text: 'Date & Time',
          font: {
            size: 19,
            weight: 'bold',
            color:'darkgreen'
          },
          color: 'green',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 13,
            weight: 'bold',
          },
          color: '#4B5563',
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
  
  //MARKS
  const enrollmentNo = studentId
  useEffect(() => {
    const fetchMarksDistribution = async () => {
      try {
        const res = await axios.post(`${baseApiURL()}/analytics/get-marks`, {
          enrollmentNo,
        });
  
        setInternalMarks(res.data.internal || {});
        setExternalMarks(res.data.external || {});
      } catch (error) {
        console.error("Error fetching marks distribution:", error);
      }
    };
  
    fetchMarksDistribution();
  }, []);
  
const subjectKeys = Object.keys(internalMarks);
const generateColors = (n) =>
  Array.from({ length: n }, (_, i) => `hsl(${(i * 360) / n}, 70%, 60%)`);
const dynamicColors = generateColors(subjectKeys.length);
  const getChartData = (marksObj) => {
    //const labels = Object.keys(marksObj);
    const data = Object.values(marksObj);
    
    
    return {
      datasets: [
        {
          label: 'Marks',
          data,
          backgroundColor: dynamicColors,
          borderWidth: 1,
        }
      ]
    };
  };

  
  return (
    <div className="w-full max-w-4xl mt-4 bg-white p-4 rounded-md">
      <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Grade Analytics</h2>
       <div className="flex flex items-center gap-8 p-6 mt-8">
  <div className="flex flex-col md:flex-row justify-center items-center gap-10">
    <div className="w-72">
      <h3 className="text-lg font-bold mb-2 text-center">Internal Marks</h3>
      <Pie data={getChartData(internalMarks)} />
    </div>
    <div className="w-72">
      <h3 className="text-lg font-bold mb-2 text-center">External Marks</h3>
      <Pie data={getChartData(externalMarks)} />
    </div>
  </div>

  {/* Unified Circular Legend */}
  <div className="flex flex-wrap justify-center gap-4">
    {subjectKeys.map((subject, index) => (
      <div key={subject} className="flex items-center space-x-2">
        <span
          className="inline-block w-3.5 h-3.5 rounded-full"
          style={{ backgroundColor: dynamicColors[index] }}
        ></span>
        <span className="text-sm font-medium">{subject}</span>
      </div>
    ))}
  </div>
</div>
      
        {gradeData.length === 0 ? (
          <p className="text-center text-gray-500">No grade data available.</p>
        ) : (
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2 text-center mt-6 mb-4">Assignment Marks over Time</h3>
            <Line data={data} options={options} />
          </div>
        )}

      </div>

</div>
  );
};

export default Analytics;
