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
    <div className="w-full mx-auto flex justify-center items-start flex-col my-10">
      <Heading title="Student Notices" />
      <div className="mt-8 w-full">
        {notice.length === 0 && (
          <p className="text-gray-500 text-center">No notices available.</p>
        )}
        {notice.map((item) => (
          <div
            key={item._id}
            className="border-blue-500 border-2 w-full rounded-md shadow-sm py-4 px-6 mb-4 relative"
          >
            <p
              className={`text-xl font-medium flex justify-start items-center ${
                item.link && "cursor-pointer"
              } group`}
              onClick={() => item.link && window.open(process.env.REACT_APP_MEDIA_LINK + "/" + item.link)}
            >
              {item.title}
              {item.link && (
                <span className="text-2xl group-hover:text-blue-500 ml-1">
                  <IoMdLink />
                </span>
              )}
            </p>
            <p className="text-base font-normal mt-1">{item.description}</p>
            <p className="text-sm absolute top-4 right-4 flex items-center">
              <span className="text-base mr-1">
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