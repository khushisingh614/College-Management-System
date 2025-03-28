// import React from "react";
// import Login from "./components/Login";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Provider } from "react-redux";
// import mystore from "./redux/store";
// import StudentHome from "./Screens/Student/Home";
// import FacultyHome from "./Screens/Faculty/Home";
// import AdminHome from "./Screens/Admin/Home";

// const App = () => {
//   return (
//     <>
//       <Provider store={mystore}>
//         <Router>
//           <Routes>
//             <Route path="/" element={<Login />} />
//             <Route path="student" element={<StudentHome />} />
//             <Route path="faculty" element={<FacultyHome />} />
//             <Route path="admin" element={<AdminHome />} />
//           </Routes>
//         </Router>
//       </Provider>
//     </>
//   );
// };

// export default App;
import React from "react";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import mystore from "./redux/store";
import StudentHome from "./Screens/Student/Home";
import FacultyHome from "./Screens/Faculty/Home";
import AdminHome from "./Screens/Admin/Home";
import SubmitFeedback from "./Screens/Student/SubmitFeedback";
import AdminFeedbackList from "./Screens/Admin/Feedback/AdminFeedbackList";
import AdminFeedbackForm from "./Screens/Admin/Feedback/AdminFeedbackForm";

const App = () => {
  return (
    <>
      <Provider store={mystore}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="student" element={<StudentHome />} />
            <Route path="faculty" element={<FacultyHome />} />
            <Route path="admin" element={<AdminHome />} />

            {/* Feedback Routes */}
            <Route path="student/submit-feedback" element={<SubmitFeedback />} />
            <Route path="admin/create-feedback" element={<AdminFeedbackForm />} />
            <Route path="admin/view-feedback" element={<AdminFeedbackList />} />
          </Routes>
        </Router>
      </Provider>
    </>
  );
};

export default App;
