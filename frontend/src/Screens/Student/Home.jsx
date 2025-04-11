import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Timetable from "./Timetable";
import Curriculum from "./Curriculum";
import Marks from "./Marks";
import Notice from "./Notice";
import Material from "./Material";
import Attendance from "./Attendance";
import Resources from "./Resources";
import AssignmentDashboard from "./AssignmentDashboard";
import Profile from "./Profile";
import Todolist from "./todolist";
import Itemsboard from "./Itemsboard";
import Societies from "./societies";
import Store from "./store";
import { Toaster } from "react-hot-toast";
import Sidebar, { SidebarItem } from "../../components/sidebar";
import {
  User,
  Calendar,
  BookOpen,
  Clipboard,
  Bell,
  FileText,
  Book,
  CheckSquare,
  Archive,
  ListTodo,
  PackageSearch,
  Network,
  ShoppingBag
} from "lucide-react";

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState("My Profile");
  const router = useLocation();
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState(0);
  const [studentid , setStudentid] = useState("");

  useEffect(() => {
    if (router.state === null) {
      navigate("/");
    }
    setLoad(true);
  }, [navigate, router.state]);

  return (
    <section>
      {load && (
        <div className="flex bg-[#E8F9FF] min-h-screen flex-col overflow-visible">
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
                icon={<Clipboard size={20} />}
                text="Marks"
                active={selectedMenu === "Marks"}
                onClick={() => setSelectedMenu("Marks")}
              />
              <SidebarItem
                icon={<Book size={20} />}
                text="Material"
                active={selectedMenu === "Material"}
                onClick={() => setSelectedMenu("Material")}
              />
              <SidebarItem
                icon={<BookOpen size={20} />}
                text="Curriculum"
                active={selectedMenu === "Curriculum"}
                onClick={() => setSelectedMenu("Curriculum")}
              />
              <SidebarItem
                icon={<Bell size={20} />}
                text="Notice"
                active={selectedMenu === "Notice"}
                onClick={() => setSelectedMenu("Notice")}
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
              <SidebarItem
                icon={<Archive size={20} />}
                text="Resources"
                active={selectedMenu === "Resources"}
                onClick={() => setSelectedMenu("Resources")}
              />
              <SidebarItem
                icon={<ListTodo size={20} />}
                text="To Do List"
                active={selectedMenu === "todolist"}
                onClick={() => setSelectedMenu("todolist")}
              />
              <SidebarItem
                icon={<PackageSearch  size={20} />}
                text="Lost Found MarketPlace"
                active={selectedMenu === "Itemsboard"}
                onClick={() => setSelectedMenu("Itemsboard")}
              />
              <SidebarItem
                icon={<Network  size={20} />}
                text="Societies"
                active={selectedMenu === "Societies"}
                onClick={() => setSelectedMenu("Societies")}
              />
              <SidebarItem
                icon={<ShoppingBag  size={20} />}
                text="Store"
                active={selectedMenu === "store"}
                onClick={() => setSelectedMenu("store")}
              />
            </Sidebar>
            <div className="flex-1">
              <div className="max-w-6xl mx-auto py-4 px-6">
                {selectedMenu === "Timetable" && <Timetable />}
                {selectedMenu === "Marks" && <Marks />}
                {selectedMenu === "Material" && <Material />}
                {selectedMenu === "todolist" && <Todolist studentid = {studentid}/>}
                {selectedMenu === "Notice" && <Notice branch={branch} semester={semester}/>}
                {selectedMenu === "Curriculum" && <Curriculum />}
                {selectedMenu === "My Profile" && <Profile setBranch = {setBranch} setSemester = {setSemester} setStudentid = {setStudentid}/>}
                {selectedMenu === "Attendance" && <Attendance />}
                 {selectedMenu === "store" && <Store />} 
                 {selectedMenu === "Societies" && <Societies />} 
                {selectedMenu === "Itemsboard" && <Itemsboard />}
                {selectedMenu === "Resources" && <Resources />}
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