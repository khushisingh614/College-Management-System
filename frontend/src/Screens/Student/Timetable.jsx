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
          {
            params: {
              semester: userData.semester,
              branch: userData.branch,
            },
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
    <div className="w-full max-w-5xl mx-auto mt-12 mb-16 px-4 sm:px-8">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Heading title={`Semester ${userData.semester} Timetable`} />
          {timetable && (
            <button
              onClick={() =>
                window.open(
                  process.env.REACT_APP_MEDIA_LINK + "/" + timetable
                )
              }
              className="inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-transform duration-200 hover:scale-105"
            >
              <FiDownload className="text-lg" />
              Download
            </button>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          {timetable ? (
            <img
              className="rounded-xl shadow-md w-full sm:w-3/4 border border-gray-300"
              src={process.env.REACT_APP_MEDIA_LINK + "/" + timetable}
              alt="Timetable"
            />
          ) : (
            <p className="text-center text-gray-500 text-lg mt-12">
              No Timetable Available At The Moment!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timetable;
