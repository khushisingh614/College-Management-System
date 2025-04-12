import React, { useState } from "react";
import { FaComments, FaHeadset, FaHospital, FaGraduationCap, FaBrain, FaPhone, FaTint, FaBook, FaFutbol } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Heading from "../../components/Heading";

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
    { key: "shecycle", title: "Menstrual Health", icon: <FaTint />, color: "primary"},
    { key: "library", title: "Library Services", icon: <FaBook />, color: "secondary" },
    { key: "sports", title: "Sports Complex", icon: <FaFutbol />, color: "success" },
  ];

  return (
    <div className="container mt-4">
      <Heading title="Resources" />
      <br />
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

        {activeSection === "library" && (
          <div className="alert alert-secondary">
            <h4>Library Services</h4>
            <p>Access thousands of books, journals, e-resources, and study spaces through our central library system.</p>
            <ul>
              <li>Digital Library Access (24/7)</li>
              <li>Study Rooms and Group Discussion Areas</li>
              <li>Online Catalog & Book Reservation</li>
              <li>Librarian Assistance: <strong>library@college.edu</strong></li>
            </ul>
          </div>
        )}

        {activeSection === "sports" && (
          <div className="alert alert-success">
            <h4>Sports Complex</h4>
            <p>Stay fit and active with our world-class sports facilities and clubs.</p>
            <ul>
              <li>Gymnasium and Fitness Center</li>
              <li>Football, Cricket, and Basketball Courts</li>
              <li>Swimming Pool and Indoor Games</li>
              <li>Join a Sports Club or Event!</li>
            </ul>
            <button className="btn btn-success">Explore Sports Facilities</button>
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

        {activeSection === "shecycle" && (
          <div className="alert alert-danger">
            <Heading title="Menstrual Health" />
            <br />
            <h4><strong>🌺 What Is Menstrual Health?</strong></h4>
            <p>Menstrual health refers to complete physical, mental, and social well-being in relation to the menstrual cycle. It's not just about periods — it's about understanding your body, managing symptoms, and breaking the stigma.</p>
            <br />
            <h4><strong>🧠 Understanding the Menstrual Cycle</strong></h4>
            <p>The menstrual cycle is a monthly process that prepares the body for pregnancy. It usually lasts between 28 to 35 days, and is divided into 4 main phases:</p>
            <ul>
              <li>Menstrual Phase (Days 1–5): Bleeding occurs as the uterine lining sheds.</li>
              <li>Follicular Phase (Days 1–13): Hormones stimulate the growth of follicles in the ovaries.</li>
              <li>Ovulation (Day 14): An egg is released for potential fertilization.</li>
              <li>Luteal Phase (Days 15–28): Hormones prepare the uterus for pregnancy, or the cycle starts again.</li>
            </ul>
            <br />
            <h4><strong>🩸 What Is a Period?</strong></h4>
            <p>A period is the shedding of the uterine lining through the vagina. It usually lasts 3–7 days. It's completely normal and natural.</p>
            <br />
            <h4><strong>⚠ Common Menstrual Issues</strong></h4>
            <ul>
              <li>Cramps</li>
              <li>Irregular periods</li>
              <li>Heavy bleeding</li>
              <li>Mood swings</li>
              <li>Bloating</li>
              <li>PCOD/PCOS</li>
            </ul>
            <p>If symptoms are severe or interfere with daily life, consult a medical professional.</p>
            <br />
            <h4><strong>🧼 Menstrual Hygiene Tips</strong></h4>
            <ul>
              <li>Change pads/tampons every 4–6 hours</li>
              <li>Use clean, dry underwear</li>
              <li>Wash your hands before and after changing products</li>
              <li>Avoid scented products to prevent irritation</li>
              <li>Dispose of sanitary waste properly</li>
            </ul>
            <br />
            <h4><strong>🔄 Products You Can Use</strong></h4>
            <ul>
              <li>Sanitary Pads</li>
              <li>Tampons</li>
              <li>Menstrual Cups</li>
              <li>Period Panties</li>
              <li>Reusable Cloth Pads</li>
            </ul>
            <p>Choose what’s comfortable and eco-friendly for you!</p>
            <br />
            <h4><strong>🧘 Managing Period Pain</strong></h4>
            <ul>
              <li>Use a hot water bottle</li>
              <li>Light exercise or yoga</li>
              <li>Stay hydrated</li>
              <li>Pain-relief medication (with doctor’s advice)</li>
              <li>Maintain a balanced diet</li>
            </ul>
            <br />
            <h4><strong>🚺 Breaking the Taboo</strong></h4>
            <p>
              Talking about periods should never be shameful. It’s a sign of health and strength.
              By raising awareness, we can end stigma, promote hygiene, and support each other.
            </p>
            <br />
            <h4><strong>🫂 Support Each Other</strong></h4>
            <ul>
              <li>Be kind and inclusive</li>
              <li>Never mock someone for period-related issues</li>
              <li>Share knowledge — it’s empowering</li>
            </ul>
            <br />
            <h4><strong>💬 Did You Know?</strong></h4>
            <ul>
              <li>The average woman menstruates for 7 years of her life.</li>
              <li>PCOD affects 1 in 10 women of reproductive age.</li>
              <li>Periods can start as early as age 9 and continue until about 50.</li>
              <li>Menstruation is a vital sign of health, just like your pulse or temperature.</li>
            </ul>
            <br />
            <h4><strong>🧾 Final Thought</strong></h4>
            <p>
              Menstrual health is human health. Understanding your cycle, choosing the right hygiene practices,
              and supporting others creates a healthier, stigma-free campus.
            </p>


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