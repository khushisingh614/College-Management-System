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
  useEffect(() => {
    if (router.state === null) {
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
              <SidebarItem
                icon={<User size={20} />}
                text="My Profile"
                active={selectedMenu === "My Profile"}
                onClick={() => setSelectedMenu("My Profile")}
              />
              <SidebarItem
                icon={<Calendar size={20} />}
                text="Timetable"
                active={selectedMenu === "Timetable"}
                onClick={() => setSelectedMenu("Timetable")}
              />
              <SidebarItem
                icon={<Bell size={20} />}
                text="Notice"
                active={selectedMenu === "Notice"}
                onClick={() => setSelectedMenu("Notice")}
              />
              <SidebarItem
                icon={<Book size={20} />}
                text="Material"
                active={selectedMenu === "Material"}
                onClick={() => setSelectedMenu("Material")}
              />
              <SidebarItem
                icon={<Key size={20} />}
                text="Temporary Access"
                active={selectedMenu === "Temporary_Access"}
                onClick={() => setSelectedMenu("Temporary_Access")}
              />
              <SidebarItem
                icon={<Users size={20} />}
                text="Student Info"
                active={selectedMenu === "Student Info"}
                onClick={() => setSelectedMenu("Student Info")}
              />
              <SidebarItem
                icon={<Clipboard size={20} />}
                text="Upload Marks"
                active={selectedMenu === "Upload Marks"}
                onClick={() => setSelectedMenu("Upload Marks")}
              />
              <SidebarItem
                icon={<BookOpen size={20} />}
                text="Curriculum"
                active={selectedMenu === "Curriculum"}
                onClick={() => setSelectedMenu("Curriculum")}
              />
              <SidebarItem
                icon={<FileText size={20} />}
                text="Assignment"
                active={selectedMenu === "Assignment"}
                onClick={() => setSelectedMenu("Assignment")}
              />
              <SidebarItem
                icon={<CheckSquare size={20} />}
                text="Attendance"
                active={selectedMenu === "Attendance"}
                onClick={() => setSelectedMenu("Attendance")}
              />
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