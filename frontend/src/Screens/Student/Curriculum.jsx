import axios from "axios";
import React, { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import toast from "react-hot-toast";
import { baseApiURL } from "../../baseUrl";
import { IoMdLink } from "react-icons/io";
import { HiOutlineCalendar, HiOutlineSearch } from "react-icons/hi";

const Curriculum = () => {
  const [subject, setSubject] = useState();
  const [selected, setSelected] = useState();
  const [curriculum, setCurriculum] = useState([]);

  useEffect(() => {
    toast.loading("Loading Subjects...");
    axios
      .get(`${baseApiURL()}/subject/getSubject`)
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          setSubject(response.data.subject);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.message);
      });
  }, []);

  const getSubjectCurriculum = () => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(
        `${baseApiURL()}/curriculum/getCurriculum`,
        { subject: selected },
        { headers }
      )
      .then((response) => {
        if (response.data.success) {
          setCurriculum(response.data.curriculum);
        } else {
          // Error
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onSelectChangeHandler = (e) => {
    setCurriculum();
    setSelected(e.target.value);
  };

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10 bg-white shadow-lg rounded-lg p-8">
  <Heading title="Curriculum" />
  <div className="mt-8 w-full flex justify-center items-center flex-col">
    <div className="flex justify-center items-center w-[40%] space-x-4">
      <select
        value={selected}
        name="subject"
        id="subject"
        onChange={onSelectChangeHandler}
        className="px-4 py-3 bg-blue-50 border border-blue-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option defaultValue value="select">
          -- Select Subject --
        </option>
        {subject &&
          subject.map((item) => {
            return (
              <option value={item.name} key={item.name}>
                {item.name}
              </option>
            );
          })}
      </select>
      <button
        onClick={getSubjectCurriculum}
        className="bg-blue-600 text-white py-3 px-6 text-lg rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200"
      >
        <HiOutlineSearch />
      </button>
    </div>

    <div className="mt-8 w-full">
      {curriculum &&
        curriculum.reverse().map((item, index) => {
          return (
            <div
              key={index}
              className="border border-blue-200 rounded-lg shadow-lg p-6 mb-6 transition-all hover:scale-105 hover:shadow-2xl transform duration-200"
            >
              <p
                className={`text-xl font-semibold text-blue-700 flex justify-start items-center cursor-pointer hover:text-blue-600 group`}
                onClick={() =>
                  item.link &&
                  window.open(
                    process.env.REACT_APP_MEDIA_LINK + "/" + item.link
                  )
                }
              >
                {item.title}
                {item.link && (
                  <span className="ml-2 text-2xl group-hover:text-blue-500">
                    <IoMdLink />
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {item.subject} - {item.faculty}
              </p>
              <p className="text-xs text-gray-500 absolute top-4 right-4 flex items-center">
                <span className="mr-1">
                  <HiOutlineCalendar />
                </span>
                {item.createdAt.split("T")[0].split("-")[2] +
                  "/" +
                  item.createdAt.split("T")[0].split("-")[1] +
                  "/" +
                  item.createdAt.split("T")[0].split("-")[0] +
                  " " +
                  item.createdAt.split("T")[1].split(".")[0]}
              </p>
            </div>
          );
        })}
      {curriculum && curriculum.length === 0 && selected && (
        <p className="text-center text-lg text-gray-600 mt-4">
          No Curriculum For {selected}!
        </p>
      )}
    </div>
  </div>
</div>

  );
};

export default Curriculum;
