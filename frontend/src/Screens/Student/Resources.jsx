import React, { useState } from "react";
import { FaComments, FaHeadset, FaHospital, FaGraduationCap, FaBrain, FaPhone } from "react-icons/fa";


const Dashboard = () => {
  const [activeSection, setActiveSection] = useState(null);

  const handleButtonClick = (key) => {
    setActiveSection(activeSection === key ? null : key);
  };

  const options = [
    { key: "feedback", title: "Feedback System", icon: <FaComments />, color: "primary" },
    { key: "complaint", title: "Complaint System", icon: <FaHeadset />, color: "success" },
    { key: "hospital", title: "Hospital Services", icon: <FaHospital />, color: "warning" },
    { key: "career", title: "Skill Development & Career Growth", icon: <FaGraduationCap />, color: "danger" },
    { key: "wellbeing", title: "Mental Wellbeing & Counselling", icon: <FaBrain />, color: "info" },
    { key: "emergency", title: "Emergency Contact Details", icon: <FaPhone />, color: "dark" },
  ];

  return (
    <div className="container mt-4">
      <div className="row g-4">
        {options.map((option) => (
          <div key={option.key} className="col-md-4">
            <div className={`card text-white bg-${option.color} shadow-lg text-center p-3`}>
              <div className="card-body">
                <div className="display-4">{option.icon}</div>
                <h5 className="card-title mt-2">{option.title}</h5>
                <button
                  className="btn btn-light mt-3"
                  onClick={() => handleButtonClick(option.key)}
                >
                  {activeSection === option.key ? "Hide" : "Show"} Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section Display Below Cards */}
      <div className="mt-4">
        {activeSection === "feedback" && (
          <div className="alert alert-primary">
            <h4>Feedback System</h4>
            <p>Submit feedback about your courses, faculty, or campus services. Your opinions help us improve!</p>
            <button className="btn btn-primary">Give Feedback</button>
          </div>
        )}

        {activeSection === "complaint" && (
          <div className="alert alert-success">
            <h4>Complaint System</h4>
            <p>Report issues related to campus facilities, faculty, or student services. We value your concerns.</p>
            <button className="btn btn-success">Submit Complaint</button>
          </div>
        )}

        {activeSection === "hospital" && (
          <div className="alert alert-warning">
            <h4>Hospital Services</h4>
            <p>Access medical support, health check-ups, and emergency care at our partnered hospitals.</p>
            <ul>
              <li>24/7 Medical Assistance</li>
              <li>On-Campus Health Clinic</li>
              <li>Emergency Ambulance: <strong>+91 9876543210</strong></li>
            </ul>
            <br />
          </div>
        )}

        {activeSection === "career" && (
          <div className="alert alert-danger">
            <h4>Skill Development & Career Growth</h4>
            <p>Find opportunities for internships, workshops, and skill enhancement courses.</p>
            <ul>
              <li>Resume Building Workshops</li>
              <li>Online Skill Courses</li>
              <li>Internship & Job Listings</li>
            </ul>
            <button className="btn btn-danger">Explore Opportunities</button>
          </div>
        )}

        {activeSection === "wellbeing" && (
          <div className="alert alert-info">
            <h4>Mental Wellbeing & Counselling</h4>
            <p>Confidential support for mental health concerns, stress management, and emotional wellbeing.</p>
            <ul>
              <li>Free Counselling Sessions</li>
              <li>Group Therapy & Mindfulness Programs</li>
              <li>Contact a Counselor: <strong>wellbeing@gmail.com</strong></li>
            </ul>
            <br />
          </div>
        )}

        {activeSection === "emergency" && (
          <div className="alert alert-dark">
            <h4>Emergency Contact Details</h4>
            <p>For immediate assistance, contact the following authorities:</p>
            <ul>
              <li>Campus Security: <strong>+91 9123456789</strong></li>
              <li>Student Helpline: <strong>+91 9234567890</strong></li>
              <li>Fire Department: <strong>101</strong></li>
            </ul>
             <br />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
