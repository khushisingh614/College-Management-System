import React, { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import axios from "axios";
import { IoMdLink } from "react-icons/io";
import { HiOutlineCalendar } from "react-icons/hi";
import { baseApiURL } from "../../baseUrl";
import toast from "react-hot-toast";

const NoticeStudentView = (prop) => {
  const [notice, setNotice] = useState([]);

  const getNoticeHandler = () => {
    const headers = { "Content-Type": "application/json" };
    const query = {
      forwhom: ["student", "both"],
      branch: prop.branch,
      semester: prop.semester,
    };

    axios
      .post(`${baseApiURL()}/notice/getNoticebybranchandsem`, {
        headers,
        data: query,
      })
      .then((response) => {
        if (response.data.success) {
          setNotice(response.data.notice);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Error fetching notices");
      });
  };

  useEffect(() => {
    getNoticeHandler();
  }, []);

  return (
    <div className="w-full mx-auto flex justify-center items-start flex-col my-10 bg-white shadow-lg rounded-lg px-10 py-12">
    <Heading title="Student Notices" />
    <div className="mt-10 w-full">
      {notice.length === 0 && (
        <p className="text-gray-500 text-center">No notices available.</p>
      )}
      {notice.map((item) => (
        <div
          key={item._id}
          className="border border-blue-200 rounded-lg shadow-lg p-6 mb-6 bg-white transition-all hover:scale-105 hover:shadow-2xl transform duration-200 mx-2"
        >
          <p
            className={`text-xl font-semibold text-blue-700 flex justify-start items-center cursor-pointer hover:text-blue-600 group`}
            onClick={() =>
              item.link &&
              window.open(process.env.REACT_APP_MEDIA_LINK + "/" + item.link)
            }
          >
            {item.title}
            {item.link && (
              <span className="ml-2 text-2xl group-hover:text-blue-500">
                <IoMdLink />
              </span>
            )}
          </p>
          <p className="text-base font-normal mt-2">{item.description}</p>
          <p className="text-xs text-gray-500 absolute top-4 right-4 flex items-center">
            <span className="mr-1">
              <HiOutlineCalendar />
            </span>
            {new Date(item.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default NoticeStudentView;