import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Notice from "./Notice";
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
import Sidebar, { SidebarItem } from "../../components/sidebar";
import {
  User,
  Calendar,
  Bell,
  Book,
  Key,
  Users,
  Clipboard,
  BookOpen,
  FileText,
  CheckSquare,
} from "lucide-react";

const Home = () => {
  const router = useLocation();
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState("My Profile");
  const [load, setLoad] = useState(false);
  const [employeeid, setemployeeid] = useState("");
  const [temporary, setTemporary] = useState(false);
  const [branch, setBranch] = useState("");
  const [selectedTabs, setSelectedTabs] = useState([]);

  const allTabs = [
    { key: "My Profile", icon: <User size={20} /> },
    { key: "Timetable", icon: <Calendar size={20} /> },
    { key: "Notice", icon: <Bell size={20} /> },
    { key: "Material", icon: <Book size={20} /> },
    { key: "Temporary_Access", icon: <Key size={20} /> },
    { key: "Student Info", icon: <Users size={20} /> },
    { key: "Upload Marks", icon: <Clipboard size={20} /> },
    { key: "Curriculum", icon: <BookOpen size={20} /> },
    { key: "Assignment", icon: <FileText size={20} /> },
    { key: "Attendance", icon: <CheckSquare size={20} /> },
  ];
  

  useEffect(() => {
    if (!router.state) {
      navigate("/");
    }
    setLoad(true);
  }, [navigate, router.state]);

  return (
    <section>
      {load && (
        <div className="flex bg-[#E8F9FF] min-h-screen flex flex-col overflow-visible">
          

          <Navbar />
          <div className="flex flex-1 overflow-visible">
          <Sidebar>
            {temporary ? (
              selectedTabs.push("My Profile"),
              allTabs    
                .filter(tab => selectedTabs.includes(tab.key))
                .map(tab => (
                  <SidebarItem
                    key={tab.key}
                    icon={tab.icon}
                    text={tab.key}
                    active={selectedMenu === tab.key}
                    onClick={() => setSelectedMenu(tab.key)}
                  />
                ))
            ) : (
              allTabs.map(tab => (
                <SidebarItem
                  key={tab.key}
                  icon={tab.icon}
                  text={tab.key}
                  active={selectedMenu === tab.key}
                  onClick={() => setSelectedMenu(tab.key)}
                />
              ))
            )}
          </Sidebar>

            <div className="flex-1">
              <div className="max-w-6xl mx-auto py-4 px-6">
                {selectedMenu === "Timetable" && <Timetable />}
                {selectedMenu === "Upload Marks" && <Marks />}
                {selectedMenu === "Material" && <Material />}
                {selectedMenu === "Attendance" && <Attendance />}
                {selectedMenu === "Notice" && <Notice branch={branch}/>}
                {selectedMenu === "My Profile" && (
                  <Profile
                    setemployeeid={setemployeeid}
                    setTemporary={setTemporary}
                    setBranch = {setBranch}
                    setSelectedTabs = {setSelectedTabs}
                  />
                )}
                {selectedMenu === "Curriculum" && <Curriculum />}
                {selectedMenu === "Temporary_Access" && (
                  <Temporary employeeid={employeeid} temporary={temporary} />
                )}
                {selectedMenu === "Student Info" && <Student />}
                {selectedMenu === "Assignment" && <AssignmentDashboard />}
              </div>
            </div>
          </div>
        </div>
      )}
      <Toaster position="bottom-center" />
    </section>
  );
};

export default Home;