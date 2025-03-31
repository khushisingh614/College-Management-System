import React from "react";
import { FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";

const Navbar = () => {
  const router = useLocation();
  const navigate = useNavigate();
  return (
    <div className="shadow-md px-6 py-6 bg-[#27548A]">
      <div className="max-w-6xl flex justify-between items-center mx-auto font-bold">
        <p
          className="font-semibold text-2xl flex justify-center items-center cursor-pointer text-white"
          onClick={() => navigate("/")}
        >
          <span className="mr-2 font-white">
            <RxDashboard />
          </span>{" "}
          {router.state && router.state.type} Dashboard
        </p>
        <button
          className="flex justify-center items-center text-red-200 px-3 py-2 hover:bg-white hover:text-red-700 font-semibold rounded-md"
          onClick={() => navigate("/")}
        >
          Logout
          <span className="ml-2">
            <FiLogOut />
          </span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;