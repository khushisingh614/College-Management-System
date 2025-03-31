import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Notice from "../../components/Notice";
import Profile from "./Profile";
import Timetable from "./Timetable";
import { Toaster } from "react-hot-toast";
import Material from "./Material";
import Curriculum from "./Curriculum";
import Marks from "./Marks";
import Student from "./Student";
import Temporary from "./Temporary";
import AssignmentDashboard from "./AssignmentDashboard";
import Attendance from "./Attendance";
import UploadAssignment from "./UploadAssignment";
const Home = () => {
  const router = useLocation();
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState("My Profile");
  const [load, setLoad] = useState(false);
  const [employeeid , setemployeeid] = useState("");
  const [temporary, setTemporary] = useState(false);
  useEffect(() => {
    if (router.state === null) {
      navigate("/");
    }
    setLoad(true);
  }, [navigate, router.state]);

  return (
    <section>
      {load && (
         <div className="bg-[#E8F9FF] min-h-screen">
        <>
          <Navbar />
          <div className="max-w-6xl mx-auto">
            <ul className="flex justify-evenly items-center font-bold gap-10 w-full mx-auto my-4">
              <li
                className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                  selectedMenu === "My Profile"
                    ? "border-b-2 pb-2 border-white text-white bg-[#183B4E] rounded-sm"
                     : "bg-[#A1E3F9] text-[#3E3F5B] hover:bg-[#27548A] hover:text-white border-b-2 border-white"
                }`}
                onClick={() => setSelectedMenu("My Profile")}
              >
                My Profile
              </li>
              <li
                className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                  selectedMenu === "Timetable"
                    ? "border-b-2 pb-2 border-white text-white bg-[#183B4E] rounded-sm"
                     : "bg-[#A1E3F9] text-[#3E3F5B] hover:bg-[#27548A] hover:text-white border-b-2 border-white"
                }`}
                onClick={() => setSelectedMenu("Timetable")}
              >
                Timetable
              </li>
              
              
              <li
                className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                  selectedMenu === "Notice"
                    ? "border-b-2 pb-2 border-white text-white bg-[#183B4E] rounded-sm"
                     : "bg-[#A1E3F9] text-[#3E3F5B] hover:bg-[#27548A] hover:text-white border-b-2 border-white"
                }`}
                onClick={() => setSelectedMenu("Notice")}
              >
                Notice
              </li>
              
              <li
                className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                  selectedMenu === "Material"
                    ? "border-b-2 pb-2 border-white text-white bg-[#183B4E] rounded-sm"
                     : "bg-[#A1E3F9] text-[#3E3F5B] hover:bg-[#27548A] hover:text-white border-b-2 border-white"
                }`}
                onClick={() => setSelectedMenu("Material")}
              >
                Material
              </li>
              <li
                className={`text-center rounded-sm px-4 py-2 w-1/4 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                  selectedMenu === "Temporary_Access"
                    ? "border-b-2 pb-2 border-white text-white bg-[#183B4E] rounded-sm"
                     : "bg-[#A1E3F9] text-[#3E3F5B] hover:bg-[#27548A] hover:text-white border-b-2 border-white"
                }`}
                onClick={() => setSelectedMenu("Temporary_Access")}
              >
                Temporary Access
              </li>
            </ul>
            <ul className="flex justify-evenly font-bold items-center gap-5 w-full mx-auto my-4">
            <li
                className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                  selectedMenu === "Student Info"
                    ? "border-b-2 pb-2 border-white text-white bg-[#183B4E] rounded-sm"
                     : "bg-[#A1E3F9] text-[#3E3F5B] hover:bg-[#27548A] hover:text-white border-b-2 border-white"
                }`}
                onClick={() => setSelectedMenu("Student Info")}
              >
                Student Info
              </li>
              
              <li
                className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                  selectedMenu === "Upload Marks"
                    ? "border-b-2 pb-2 border-white text-white bg-[#183B4E] rounded-sm"
                     : "bg-[#A1E3F9] text-[#3E3F5B] hover:bg-[#27548A] hover:text-white border-b-2 border-white"
                }`}
                onClick={() => setSelectedMenu("Upload Marks")}
              >
                Upload Marks
              </li>
              <li
                className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                  selectedMenu === "Curriculum"
                    ? "border-b-2 pb-2 border-white text-white bg-[#183B4E] rounded-sm"
                     : "bg-[#A1E3F9] text-[#3E3F5B] hover:bg-[#27548A] hover:text-white border-b-2 border-white"
                }`}
                onClick={() => setSelectedMenu("Curriculum")}
              >
                Curriculum
              </li>
              
              <li
                 className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                   selectedMenu === "Assignment"
                     ? "border-b-2 pb-2 border-white text-white bg-[#183B4E] rounded-sm"
                     : "bg-[#A1E3F9] text-[#3E3F5B] hover:bg-[#27548A] hover:text-white border-b-2 border-white"
                 }`}
                 onClick={() => setSelectedMenu("Assignment")}
               >
                 Assignment
               </li>
               <li
                 className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                   selectedMenu === "Attendance"
                     ? "border-b-2 pb-2 border-white text-white bg-[#183B4E] rounded-sm"
                     : "bg-[#A1E3F9] text-[#3E3F5B] hover:bg-[#27548A] hover:text-white border-b-2 border-white"
                 }`}
                 onClick={() => setSelectedMenu("Attendance")}
               >
                 Attendance
               </li>
            </ul>
            {selectedMenu === "Timetable" && <Timetable />}
            {selectedMenu === "Upload Marks" && <Marks />}
            {selectedMenu === "Material" && <Material />}
            {selectedMenu === "Attendance" && <Attendance />}
            {selectedMenu === "Notice" && <Notice />}
            {selectedMenu === "My Profile" && <Profile setemployeeid={setemployeeid} setTemporary = {setTemporary}/>}
            {selectedMenu === "Curriculum" && <Curriculum />}
            {selectedMenu === "Temporary_Access" && <Temporary  employeeid={employeeid} temporary={temporary} />}
            {selectedMenu === "Student Info" && <Student />}
            {selectedMenu === "Assignment" && <AssignmentDashboard />}
          </div>
        </>
        </div>
      )}
      <Toaster position="bottom-center" />
    </section>
  );
};

export default Home;
