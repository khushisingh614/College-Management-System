import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { setUserData } from "../../redux/actions";
import { baseApiURL } from "../../baseUrl";
import toast from "react-hot-toast";

const Profile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPassForm, setShowPassForm] = useState(false);
  const router = useLocation();
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const [password, setPassword] = useState({
    new: "",
    current: "",
  });

  useEffect(() => {
    axios
      .post(`${baseApiURL()}/${router.state.type}/details/getDetails`, {
        employeeId: router.state.loginid,
      })
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
      .catch((error) => console.error(error));
  }, [dispatch, router.state.loginid, router.state.type]);

  const checkPasswordHandler = (e) => {
    e.preventDefault();
    axios
      .post(`${baseApiURL()}/admin/auth/login`, {
        loginid: router.state.loginid,
        password: password.current,
      })
      .then((response) => {
        if (response.data.success) {
          changePasswordHandler(response.data.id);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => toast.error(error.response?.data?.message || "Error"));
  };

  const changePasswordHandler = (id) => {
    axios
      .put(`${baseApiURL()}/admin/auth/update/${id}`, {
        loginid: router.state.loginid,
        password: password.new,
      })
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          setPassword({ new: "", current: "" });
          setShowPassForm(false);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => toast.error(error.response?.data?.message || "Error"));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-gradient-to-r from-[#27548A] to-[#410445] shadow-xl rounded-lg text-white font-poppins">
      {data && (
        <>
          <div className="flex items-center gap-8">
            <img
              src={`${process.env.REACT_APP_MEDIA_LINK}/${data.profile}`}
              alt="Profile"
              className="h-40 w-40 object-cover rounded-lg shadow-lg"
            />
            <div>
              <h2 className="text-3xl font-bold">Hello, {data.firstName} {data.middleName} {data.lastName} 👋</h2>
              <p className="text-lg mt-2">Employee ID: <span className="font-medium">{data.employeeId}</span></p>
              <p className="text-lg">Phone: <span className="font-medium">+91 {data.phoneNumber}</span></p>
              <p className="text-lg">Email: <span className="font-medium">{data.email}</span></p>
            </div>
          </div>

          <button
            className={`mt-6 px-5 py-2 rounded-lg  text-black font-bold ${showPassForm ? "bg-white hover:bg-red-300 hover:text-[#7D0A0A]" : "bg-[#E8F9FF] hover:bg-[#410445] hover:text-white"}`}
            onClick={() => setShowPassForm(!showPassForm)}
          >
            {showPassForm ? "Close Change Password" : "Change Password"}
          </button>

          {showPassForm && (
            <form className="mt-6 border-t pt-4" onSubmit={checkPasswordHandler}>
              <div className="mb-4 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password.current}
                  onChange={(e) => setPassword({ ...password, current: e.target.value })}
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
                  type={showNewPassword ? "text" : "password"}
                  value={password.new}
                  onChange={(e) => setPassword({ ...password, new: e.target.value })}
                  placeholder="New Password"
                  className="w-full p-3 border rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="button"
                  className="absolute right-3 top-4 text-gray-800"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-[#E8F9FF] text-black font-bold hover:bg-[black] hover:text-white  py-2 rounded-lg transition duration-300"
              >
                Change Password
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
