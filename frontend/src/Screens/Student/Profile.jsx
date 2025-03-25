import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { setUserData } from "../../redux/actions";
import { baseApiURL } from "../../baseUrl";
import toast from "react-hot-toast";
const Profile = () => {
  const [showPass, setShowPass] = useState(false);
  const router = useLocation();
  const [data, setData] = useState();
  const dispatch = useDispatch();
  const [password, setPassword] = useState({
    new: "",
    current: "",
  });

const [isOnline, setIsOnline] = useState(navigator.onLine);

useEffect(() => {
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}, []);

useEffect(() => {
  if (isOnline) {
    syncOfflineChanges();
  }
}, [isOnline]);

const syncOfflineChanges = async () => {
  let pendingChanges = JSON.parse(localStorage.getItem("offlinePasswords")) || [];

  if (pendingChanges.length === 0) {
    console.log("No offline password changes to sync."); // ✅ Debugging
    return;
  }

  console.log("Syncing offline password changes:", pendingChanges); // ✅ Debugging

  for (const change of pendingChanges) {
    try {
      let userId = change.id; // Use stored ID if available

      // 🔍 If ID is missing, fetch the user ID first
      if (!userId) {
        console.log(`Fetching user ID for login ID: ${change.loginid}`);
        const loginResponse = await axios.post(
          `${baseApiURL()}/student/auth/login`,
          { loginid: change.loginid, password: change.currentPassword },
          { headers: { "Content-Type": "application/json" } }
        );

        if (loginResponse.data.success) {
          userId = loginResponse.data.id; // ✅ Get correct ID from backend
          console.log(`Fetched user ID: ${userId}`);
        } else {
          console.error(`Failed to get user ID: ${loginResponse.data.message}`);
          toast.error(`Failed to sync password for ${change.loginid}.`);
          continue; // Skip this change
        }
      }

      // 🔄 Now, update the password using the correct ID
      console.log(`Syncing password change for user ID: ${userId}`);

      const updateResponse = await axios.put(
        `${baseApiURL()}/student/auth/update/${userId}`,
        { password: change.newPassword },
        { headers: { "Content-Type": "application/json" } }
      );

      if (updateResponse.data.success) {
        toast.success(`Password for ${change.loginid} synced successfully!`);
      } else {
        toast.error(`Failed to sync password for ${change.loginid}.`);
      }
    } catch (error) {
      console.error(`Error syncing password for ${change.loginid}:`, error);
      toast.error(`Failed to sync password for ${change.loginid}.`);
    }
  }

  // ✅ Clear stored changes after syncing
  localStorage.removeItem("offlinePasswords");
  console.log("Cleared offline password changes after sync."); // ✅ Debugging
};

  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(
        `${baseApiURL()}/${router.state.type}/details/getDetails`,
        { enrollmentNo: router.state.loginid },
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data.success) {
          setData(response.data.user[0]);
          dispatch(
            setUserData({
              fullname: `${response.data.user[0].firstName} ${response.data.user[0].middleName} ${response.data.user[0].lastName}`,
              semester: response.data.user[0].semester,
              enrollmentNo: response.data.user[0].enrollmentNo,
              branch: response.data.user[0].branch,
            })
          );
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [dispatch, router.state.loginid, router.state.type]);

  //  const checkPasswordHandler = (e) => { 
  //   e.preventDefault();
  //   const headers = {
  //     "Content-Type": "application/json",
  //   };
  //   axios
  //     .post(
  //       `${baseApiURL()}/student/auth/login`,
  //       { loginid: router.state.loginid, password: password.current },
  //       {
  //         headers: headers,
  //       }
  //     )
  //     .then((response) => {
  //       if (response.data.success) {
  //         changePasswordHandler(response.data.id);
  //       } else {
  //         toast.error(response.data.message);
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(error.response.data.message);
  //       console.error(error);
  //     });
  // };
  const checkPasswordHandler = async (e) => {
    e.preventDefault();
  
    if (!password.current || !password.new) {
      toast.error("Please enter both current and new password.");
      return;
    }
  
    if (isOnline) {
      // User is online, proceed with API request
      try {
        const response = await axios.post(
          `${baseApiURL()}/student/auth/login`,
          { loginid: router.state.loginid, password: password.current },
          { headers: { "Content-Type": "application/json" } }
        );
  
        if (response.data.success) {
          changePasswordHandler(response.data.id);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Login failed.");
        console.error(error);
      }
    } else {
      // User is offline, save the request for later
      saveOfflinePasswordChange({
        loginid: router.state.loginid,
        newPassword: password.new,
        currentPassword: password.current,
      });
  
      toast.success("You're offline! Password change will sync when online.");
      setPassword({ new: "", current: "" });
    }
  };
  
  const saveOfflinePasswordChange = (passwordData) => {
    let pendingChanges = JSON.parse(localStorage.getItem("offlinePasswords")) || [];
  
    // Make sure we store the correct ID (if available)
    const changeWithId = {
      id: passwordData.id || null, // Store ID if available
      loginid: passwordData.loginid,
      newPassword: passwordData.newPassword,
      currentPassword: passwordData.currentPassword,
    };
  
    pendingChanges.push(changeWithId);
    localStorage.setItem("offlinePasswords", JSON.stringify(pendingChanges));
  
    console.log("Saved offline password changes:", pendingChanges); // ✅ Debugging
  };
  

  //...

 
 
  
  
 
      

  const changePasswordHandler = (id) => {
    const headers = {
      "Content-Type": "application/json",
    };
    console.log("id", id);
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
    <div className="w-full mx-auto my-8 flex justify-between items-start">
      {data && (
        <>
          <div>
            <p className="text-2xl font-semibold">
              Hello {data.firstName} {data.middleName} {data.lastName}👋
            </p>
            <div className="mt-3">
              <p className="text-lg font-normal mb-2">
                Enrollment No: {data.enrollmentNo}
              </p>
              <p className="text-lg font-normal mb-2">Branch: {data.branch}</p>
              <p className="text-lg font-normal mb-2">
                Semester: {data.semester}
              </p>
              <p className="text-lg font-normal mb-2">
                Phone Number: +91 {data.phoneNumber}
              </p>
              <p className="text-lg font-normal mb-2">
                Email Address: {data.email}
              </p>
            </div>
            <button
              className={`${
                showPass ? "bg-red-100 text-red-600" : "bg-blue-600 text-white"
              }  px-3 py-1 rounded mt-4`}
              onClick={() => setShowPass(!showPass)}
            >
              {!showPass ? "Change Password" : "Close Change Password"}
            </button>
            {showPass && (
              <form
                className="mt-4 border-t-2 border-blue-500 flex flex-col justify-center items-start"
                onSubmit={checkPasswordHandler}
              >
                <input
                  type="password"
                  value={password.current}
                  onChange={(e) =>
                    setPassword({ ...password, current: e.target.value })
                  }
                  placeholder="Current Password"
                  className="px-3 py-1 border-2 border-blue-500 outline-none rounded mt-4"
                />
                <input
                  type="password"
                  value={password.new}
                  onChange={(e) =>
                    setPassword({ ...password, new: e.target.value })
                  }
                  placeholder="New Password"
                  className="px-3 py-1 border-2 border-blue-500 outline-none rounded mt-4"
                />
                <button
                  className="mt-4 hover:border-b-2 hover:border-blue-500"
                  onClick={checkPasswordHandler}
                  type="submit"
                >
                  Change Password
                </button>
              </form>
            )}
          </div>
          <img
            src={process.env.REACT_APP_MEDIA_LINK + "/" + data.profile}
            alt="student profile"
            className="h-[240px] w-[240px] object-cover rounded-lg shadow-md"
          />
        </>
      )}
    </div>
  );
};

export default Profile;


