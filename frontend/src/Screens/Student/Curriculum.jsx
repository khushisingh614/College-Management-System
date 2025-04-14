import axios from "axios";
import React, { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import toast from "react-hot-toast";
import { baseApiURL } from "../../baseUrl";
import { IoMdLink } from "react-icons/io";
import { HiOutlineCalendar, HiOutlineSearch } from "react-icons/hi";

const Curriculum = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [curriculums, setCurriculums] = useState([]);

  useEffect(() => {
    toast.loading("Loading Subjects...");
    axios
      .get(`${baseApiURL()}/subject/getSubject`)
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          setSubjects(response.data.subject);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error("Failed to load subjects");
        console.error(error);
      });
  }, []);

  const fetchCurriculum = () => {
    axios
      .post(
        `${baseApiURL()}/curriculum/getCurriculum`,
        { subject: selectedSubject },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        if (response.data.success) {
          setCurriculums(response.data.curriculum);
        }
      })
      .catch((error) => {
        console.error("Error fetching curriculum:", error);
      });
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setCurriculums([]);
  };

  const formatDateTime = (dateString) => {
    const [date, time] = dateString.split("T");
    const [year, month, day] = date.split("-");
    const formattedTime = time.split(".")[0];
    return `${day}/${month}/${year} ${formattedTime}`;
  };

  return (
    <div className="w-full flex justify-center px-4 py-10 min-h-[80vh] bg-gradient-to-r from-blue-50 to-white">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl p-10 flex flex-col">

        <Heading title="Curriculum" className="text-4xl font-semibold text-blue-600" />

        <div className="mt-10 flex flex-col items-center space-y-8">
          <div className="flex w-full sm:w-3/5 gap-4">
            <select
              value={selectedSubject}
              onChange={handleSubjectChange}
              className="flex-1 px-4 py-3 bg-blue-50 rounded-lg border border-blue-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Subject --</option>
              {subjects.map((item) => (
                <option value={item.name} key={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
            <button
              onClick={fetchCurriculum}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg text-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all"
            >
              <HiOutlineSearch />
            </button>
          </div>

          <div className="w-full">
            {curriculums.length > 0 ? (
              curriculums
                .slice()
                .reverse()
                .map((item, index) => (
                  <div
                    key={index}
                    className="border-2 border-blue-500 rounded-lg shadow-md p-6 mb-6 bg-gradient-to-r from-blue-50 via-white to-blue-50 hover:scale-105 transition-transform relative"
                  >
                    <p
                      className={`text-xl font-semibold flex items-center gap-2 ${item.link ? "cursor-pointer group" : ""}`}
                      onClick={() =>
                        item.link &&
                        window.open(
                          process.env.REACT_APP_MEDIA_LINK + "/" + item.link
                        )
                      }
                    >
                      {item.title}
                      {item.link && (
                        <IoMdLink className="text-2xl group-hover:text-blue-600 transition-colors" />
                      )}
                    </p>
                    <p className="text-base text-gray-700 mt-2">
                      {item.subject} — {item.faculty}
                    </p>
                    <p className="text-sm text-gray-500 absolute top-4 right-5 flex items-center">
                      <HiOutlineCalendar className="mr-1" />
                      {formatDateTime(item.createdAt)}
                    </p>
                  </div>
                ))
            ) : (
              selectedSubject && (
                <p className="text-center text-lg text-gray-600 mt-8">
                  No curriculum available for{" "}
                  <span className="font-semibold">{selectedSubject}</span>.
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Curriculum;
