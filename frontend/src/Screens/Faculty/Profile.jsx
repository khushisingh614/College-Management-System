import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { baseApiURL } from "../../baseUrl";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
const Profile = () => {
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
  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(
        `${baseApiURL()}/${router.state.type}/details/getDetails`,
        { employeeId: router.state.loginid },
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data.success) {
          setData(response.data.user);
          dispatch(
            setUserData({
              fullname: `${response.data.user[0].firstName} ${response.data.user[0].middleName} ${response.data.user[0].lastName}`,
              employeeId: response.data.user[0].employeeId,
              _id: response.data.user[0]._id,
            })
          );
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [router.state.loginid, router.state.type]);

  const checkPasswordHandler = (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(
        `${baseApiURL()}/faculty/auth/login`,
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
        `${baseApiURL()}/faculty/auth/update/${id}`,
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
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-gradient-to-r from-[#27548A] to-[#410445] shadow-xl rounded-lg text-white font-poppins">
      {data && (
        <>
          <div className="flex items-center gap-8">
            <img
              src={`${process.env.REACT_APP_MEDIA_LINK}/${data.profile || data[0]?.profile}`}
              alt="Profile"
              className="h-40 w-40 object-cover rounded-lg shadow-lg"
            />
            <div>
              <h2 className="text-3xl font-bold">Hello, {data.firstName || data[0]?.firstName} {data.middleName || data[0]?.middleName} {data.lastName || data[0]?.lastName} 👋</h2>
              <p className="text-lg mt-2">ID: <span className="font-medium">{data.employeeId || data[0]?.employeeId || data.enrollmentNo}</span></p>
              <p className="text-lg">Phone: <span className="font-medium">+91 {data.phoneNumber || data[0]?.phoneNumber}</span></p>
              <p className="text-lg">Email: <span className="font-medium">{data.email || data[0]?.email}</span></p>
              {data.branch && <p className="text-lg">Branch: <span className="font-medium">{data.branch}</span></p>}
              {data.semester && <p className="text-lg">Semester: <span className="font-medium">{data.semester}</span></p>}
              {data.post && <p className="text-lg">Post: <span className="font-medium">{data.post}</span></p>}
              {data.department && <p className="text-lg">Department: <span className="font-medium">{data.department}</span></p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Profile;
