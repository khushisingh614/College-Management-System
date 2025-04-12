import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import Heading from "../../components/Heading";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { baseApiURL } from "../../baseUrl";
const Timetable = () => {
  const [timetable, setTimetable] = useState("");
  const userData = useSelector((state) => state.userData);

  useEffect(() => {
    const getTimetable = () => {
      const headers = {
        "Content-Type": "application/json",
      };
      axios
        .get(
          `${baseApiURL()}/timetable/getTimetable`,
          { semester: userData.semester, branch: userData.branch },
          {
            headers: headers,
          }
        )
        .then((response) => {
          if (response.data.length !== 0) {
            setTimetable(response.data[0].link);
          }
        })
        .catch((error) => {
          toast.dismiss();
          console.log(error);
        });
    };
    userData && getTimetable();
  }, [userData, userData.branch, userData.semester]);

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10 space-y-6 bg-gray-50 p-6 rounded-lg shadow-lg">
  <div className="flex justify-between items-center w-full mb-6 p-4 rounded-md">
    <Heading title={`Timetable of Semester ${userData.semester}`} />
    {timetable && (
      <p
        className="flex justify-center items-center text-lg font-semibold text-blue-600 cursor-pointer hover:text-red-500 hover:scale-110 ease-linear transition-all duration-200"
        onClick={() =>
          window.open(process.env.REACT_APP_MEDIA_LINK + "/" + timetable)
        }
      > 
        <button className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
  <span>Download</span>
  <span className="ml-2">
    <FiDownload />
  </span>
</button>

      </p>
    )}
  </div>
  
  {timetable ? (
    <img
      className="mt-8 rounded-lg shadow-lg w-[80%] mx-auto transition-all transform hover:scale-105"
      src={process.env.REACT_APP_MEDIA_LINK + "/" + timetable}
      alt="Timetable"
    />
  ) : (
    <p className="text-lg text-gray-500 mt-10">No Timetable Available At The Moment!</p>
  )}
</div>


  );
};

export default Timetable;
