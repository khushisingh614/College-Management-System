import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import Notice from "./Notice";
import Student from "./Student";
import Faculty from "./Faculty";
import Subjects from "./Subject";
import { baseApiURL } from "../../baseUrl";
import Admin from "./Admin";
import Profile from "./Profile";
import Branch from "./Branch";
import Sidebar, { SidebarItem } from "../../components/sidebar";
import {
  User,
  GraduationCap,
  School,
  BookOpen,
  Bell,
  Users,
  FileText,
  Briefcase,
} from "lucide-react";

const Home = () => {
  const router = useLocation();
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("Profile");
  const [dashboardData, setDashboardData] = useState({
    studentCount: "",
    facultyCount: "",
  });

  useEffect(() => {
    if (router.state === null) {
      navigate("/");
    }
    setLoad(true);
  }, [navigate, router.state]);

  useEffect(() => {
    getStudentCount();
    getFacultyCount();
  }, []);

  const getStudentCount = () => {
    axios
      .get(`${baseApiURL()}/student/details/count`, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.data.success) {
          setDashboardData((prev) => ({
            ...prev,
            studentCount: response.data.user,
          }));
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(console.error);
  };

  const getFacultyCount = () => {
    axios
      .get(`${baseApiURL()}/faculty/details/count`, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.data.success) {
          setDashboardData((prev) => ({
            ...prev,
            facultyCount: response.data.user,
          }));
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(console.error);
  };

  return (
    <div className="bg-[#E8F9FF] min-h-screen">
      {load && (
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar>
              <SidebarItem
                icon={<User size={20} />}
                text="Profile"
                active={selectedMenu === "Profile"}
                onClick={() => setSelectedMenu("Profile")}
              />
              <SidebarItem
                icon={<GraduationCap size={20} />}
                text="Student"
                active={selectedMenu === "Student"}
                onClick={() => setSelectedMenu("Student")}
              />
              <SidebarItem
                icon={<School size={20} />}
                text="Faculty"
                active={selectedMenu === "Faculty"}
                onClick={() => setSelectedMenu("Faculty")}
              />
              <SidebarItem
                icon={<BookOpen size={20} />}
                text="Subjects"
                active={selectedMenu === "Subjects"}
                onClick={() => setSelectedMenu("Subjects")}
              />
              <SidebarItem
                icon={<Bell size={20} />}
                text="Notice"
                active={selectedMenu === "Notice"}
                onClick={() => setSelectedMenu("Notice")}
              />
              <SidebarItem
                icon={<Users size={20} />}
                text="Branch"
                active={selectedMenu === "Branch"}
                onClick={() => setSelectedMenu("Branch")}
              />
              <SidebarItem
                icon={<Briefcase size={20} />}
                text="Admins"
                active={selectedMenu === "Admin"}
                onClick={() => setSelectedMenu("Admin")}
              />
            </Sidebar>
            <div className="flex-1 px-6 py-4">
              {selectedMenu === "Profile" && <Profile />}
              {selectedMenu === "Student" && <Student />}
              {selectedMenu === "Faculty" && <Faculty />}
              {selectedMenu === "Subjects" && <Subjects />}
              {selectedMenu === "Notice" && <Notice />}
              {selectedMenu === "Branch" && <Branch />}
              {selectedMenu === "Admin" && <Admin />}
            </div>
          </div>
        </div>
      )}
      <Toaster position="bottom-center" />
    </div>
  );
};

export default Home;