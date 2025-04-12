import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { setUserData } from "../../redux/actions";
import { baseApiURL } from "../../baseUrl";
import Analytics from "./Analytics"
import toast from "react-hot-toast";
import CryptoJS from "crypto-js";

const Profile = (props) => {
  const [showPass, setShowPass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shownewPassword, setShownewPassword] = useState(false);
  const router = useLocation();
  const [data, setData] = useState();
  const dispatch = useDispatch();
  const [password, setPassword] = useState({
    new: "",
    current: "",
  });

  const SECRET_KEY = "YourSuperSecretKey";
  
  const encryptData = (data) => {
    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      SECRET_KEY
    ).toString();
    localStorage.setItem("userProfile", ciphertext);
  };
  
  const decryptData = () => {
    const ciphertext = localStorage.getItem("userProfile");
    if (!ciphertext) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
      const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decrypted;
    } catch (err) {
      console.error("Failed to decrypt data:", err);
      return null;
    }
  };
  

  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
    };
  
    // Safeguard for router.state being undefined on reload
    const loginId = router?.state?.loginid || localStorage.getItem("studentId");
    const type = router?.state?.type || "students"; // fallback to students
  
    const fetchAndCacheProfile = async () => {
      try {
        const response = await axios.post(
          `${baseApiURL()}/${type}/details/getDetails`,
          { enrollmentNo: loginId },
          { headers }
        );
  
        if (response.data.success) {
          const user = response.data.user[0];
  
          // Save encrypted profile to localStorage
          encryptData(user);
  
          // Load profile into state/Redux
          loadProfile(user);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
  
        // Try loading from offline cache (localStorage)
        const cached = decryptData();
        console.log("Decrypted cached profile:", cached);
        if (cached) {
          loadProfile(cached);
          toast("Loaded profile from offline cache.");
        } else {
          toast.error("Profile unavailable offline and not cached.");
        }
      }
    };
  
    const loadProfile = (user) => {
      localStorage.setItem("semester", user.semester);
      localStorage.setItem("branch", user.branch);
      localStorage.setItem("studentId", user.enrollmentNo);
  
      setData(user);
  
      dispatch(
        setUserData({
          fullname: `${user.firstName} ${user.middleName} ${user.lastName}`,
          semester: user.semester,
          enrollmentNo: user.enrollmentNo,
          branch: user.branch,
        })
      );
  
      props.setBranch(user.branch);
      props.setSemester(user.semester);
      props.setStudentid(user._id);
    };
  
    fetchAndCacheProfile();
  }, [dispatch]); // Remove router.state deps to prevent reload issues  




  const checkPasswordHandler = (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(
        `${baseApiURL()}/student/auth/login`,
        { loginid: router.state.loginid, password: password.current },
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data.success) {
          changePasswordHandler(response.data.id);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.error(error);
      });
  };

  const changePasswordHandler = (id) => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .put(
        `${baseApiURL()}/student/auth/update/${id}`,
        { loginid: router.state.loginid, password: password.new },
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          setPassword({ new: "", current: "" });
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.error(error);
      });
  };

  return (
    <div className="flex justify-between w-full">
  {/* Left side (Profile + Analytics stacked vertically) */}
  <div className="flex-1">
    {/* Profile Box */}
    <div className="max-w-4xl mt-2 p-8 bg-gradient-to-r from-[#27548A] to-[#410445] shadow-xl rounded-lg text-white font-poppins">
      {data && (
        <>
            <div className="flex items-center gap-8">
              <img
                src={process.env.REACT_APP_MEDIA_LINK + "/" + data.profile}
                alt="student Profile"
                className="h-40 w-40 object-cover rounded-lg shadow-lg"
              />
              <div>
                <h2 className="text-3xl font-bold">
                  Hello, {data.firstName || data[0]?.firstName} {data.middleName || data[0]?.middleName} {data.lastName || data[0]?.lastName} 👋
                </h2>
                <p className="text-lg mt-2">
                  ID: <span className="font-medium">{data.employeeId || data[0]?.employeeId || data.enrollmentNo}</span>
                </p>
                <p className="text-lg">
                  Phone: <span className="font-medium">+91 {data.phoneNumber || data[0]?.phoneNumber}</span>
                </p>
                <p className="text-lg">
                  Email: <span className="font-medium">{data.email || data[0]?.email}</span>
                </p>
                {data.branch && (
                  <p className="text-lg">
                    Branch: <span className="font-medium">{data.branch}</span>
                  </p>
                )}
                {data.semester && (
                  <p className="text-lg">
                    Semester: <span className="font-medium">{data.semester}</span>
                  </p>
                )}
                {data.post && (
                  <p className="text-lg">
                    Post: <span className="font-medium">{data.post}</span>
                  </p>
                )}
                {data.department && (
                  <p className="text-lg">
                    Department: <span className="font-medium">{data.department}</span>
                  </p>
                )}
              </div>
            </div>

          <div className="mt-6">
          <button
  className={`px-5 py-2 rounded-lg font-bold ${
    showPass
      ? "bg-white hover:bg-red-300 hover:text-[#7D0A0A]"
      : "bg-[#E8F9FF] text-black hover:bg-[#410445] hover:text-white"
  }`}
  onClick={() => setShowPass(!showPass)}
>
  {!showPass ? "Change Password" : "Close Change Password"}
</button>

          </div>

          {showPass && (
            <form className="mt-6 border-t pt-4" onSubmit={checkPasswordHandler}>
              <div className="mb-4 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password.current}
                  onChange={(e) =>
                    setPassword({ ...password, current: e.target.value })
                  }
                  placeholder="Current Password"
                  className="w-full p-3 border rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="button"
                  className="absolute right-3 top-4 text-gray-800"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="mb-4 relative">
                <input
                  type={shownewPassword ? "text" : "password"}
                  value={password.new}
                  onChange={(e) =>
                    setPassword({ ...password, new: e.target.value })
                  }
                  placeholder="New Password"
                  className="w-full p-3 border rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="button"
                  className="absolute right-3 top-4 text-gray-800"
                  onClick={() => setShownewPassword(!shownewPassword)}
                >
                  {shownewPassword ? "Hide" : "Show"}
                </button>
              </div>

              <button
                className="w-full bg-[#E8F9FF] text-black font-bold hover:bg-[black] hover:text-white py-2 rounded-lg transition duration-300"
                type="submit"
              >
                Change Password
              </button>
            </form>
          )}
        </>
      )}
    </div>

    {/* Analytics below profile */}
    <div className="mt-4">
      <Analytics />
    </div>
  </div>
</div>


  );
};

export default Profile;
/**/ 