
# 🎓 CollegeMania – An All-in-One College Management System

Built for the <b>WiSE Hackathon'25 finale</b> by Texas Instruments.
CollegeMania is a full-stack MERN-based academic management platform that bridges students, faculty, and administrators under a single intelligent interface. It offers AI-based assessments, offline support, real-time updates, and role-based functionality — all built for scalability and seamless campus digitization.

---

## 🚀 Key Highlights

- 📚 **AI Quiz Generator & Evaluator**  
  Upload course PDFs → auto-generate quizzes (MCQ + subjective). Subjective answers are evaluated using integrated AI models.

- 🔄 **Offline Assignment Submission**  
  Assignments are accessible and editable offline via IndexedDB and Service Workers, syncing when the network is restored.

- 🔐 **Secure Auth with 2FA & RBAC**  
  Login secured with bcrypt-hashed passwords and OTP-based 2FA. Role-based access control supports temporary escalations for TAs.

- 💬 **Collaborative Discussion Forums**  
  Subject-wise and general forums for peer discussions and faculty interactions.

- 🔔 **Notices**  
  Updates for quizzes, marks, notices, and announcements.

- 📊 **Performance Analytics, College Marketplace, To-do list**  
  Makes the app interactive through badges and points across participation metrics.

- 📚 **Resources Dashboard**  


---

## ✅ Platform-Wide Features

> Unified list covering all dashboards (student, faculty, admin)

1. **My Profile** – View and manage user info, with change password and access control options.
2. **Timetable** – Real-time schedule visibility for lectures, labs, and other sessions.
3. **Notice Board** – Publish and view academic/admin announcements instantly.
4. **Material Upload & Access** – Faculty upload study content; students download by subject or semester.
5. **Temporary Access Control** – Escalate roles (e.g., peer mentor) with time-bound access and full audit logging.
6. **Student Info Viewer** – Access student lists, attendance logs, and performance details.
7. **Upload Marks** – Faculty post internal marks directly into the database.
8. **Curriculum Manager** – Edit/view structured syllabus and credit breakdowns.
9. **Assignment Manager** – Issue assignments with deadlines, submission portals, and evaluation tools. Offline-ready.
10. **Attendance Tracker** – Record and review attendance with subject-wise breakdowns.
11. **Quiz Portal** – Upload material → generate quizzes → evaluate results (with AI grading).
12. **Discussion Forums** – Post questions, respond in threads, tag faculty or subjects.
13. **Role-Based Dashboards** – UI changes dynamically based on user type (Student, Faculty, Admin).
14. **2-Factor Authentication (2FA)** – OTP via email during login for secure access.
15. **Offline Access** – Complete and store assignments offline; auto-sync when online.
16. **Live WebSocket Notifications** – Instant push for quizzes, updates, or new results.
17. **Feedback & Complaint Module** – Secure channel for raising academic/admin issues.
18. **Health & Emergency Module** – Book appointments, access prescriptions, and call emergency helplines.
19. **Career & Skill Development Portal** – View workshops, webinars, and register for upskilling events.
20. **Gamified Dashboard** – Ranks, points, and badges based on task completion.

---

## ⚙️ Tech Stack

| Layer         | Technology                   |
|---------------|------------------------------|
| Frontend      | React.js + TailwindCSS       |
| Backend       | Node.js + Express.js         |
| Database      | MongoDB                      |
| Auth & Email  | bcrypt.js + Nodemailer (OTP) |
| Offline Mode  | IndexedDB + Service Workers  |
                  

---

## 🧪 Getting Started

### Prerequisites

- Node.js
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
git clone https://github.com/your-org/CollegeApp.git
cd CollegeApp

# Backend Setup
cd server
npm install
npm start

# Frontend Setup
cd ../client
npm install
npm start
```

App runs locally at `http://localhost:3000`

---

## 🔐 Security Architecture

- **bcrypt.js** for password hashing
- **2FA OTP Verification** via Nodemailer
- **Role-based Access Control (RBAC)**
- **Audit Trails** for escalations and sensitive operations


## 👨‍💻 Team

- **Khushi Singh** – NIT Surat  
- **Lakshmi C** – IIT Guwahati  
- **Sonika Kumari** – IGDTUW  
**Mentor:** Koushik Anche
