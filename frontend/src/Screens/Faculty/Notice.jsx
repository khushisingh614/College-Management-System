import React, { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import axios from "axios";
import { IoMdLink } from "react-icons/io";
import { HiOutlineCalendar } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import { IoAddOutline } from "react-icons/io5";
import { MdDeleteOutline, MdEditNote } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import toast from "react-hot-toast";
import { baseApiURL } from "../../baseUrl";
import { FiUpload } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";

const Notice = (prop) => {
  const router = useLocation();
  const [notice, setNotice] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState("");
  const [data, setData] = useState({
    title: "",
    description: "",
    branch: [],
    semester: [],
    forwhom: "student",
  });
  const [branch, setBranch] = useState();
  const [file, setFile] = useState();

  const getBranchData = () => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .get(`${baseApiURL()}/branch/getBranch`, { headers })
      .then((response) => {
        if (response.data.success) {
          setBranch(response.data.branches);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  };

  const getNoticeHandler = () => {
    const headers = { "Content-Type": "application/json" };
    const query = {
      forwhom: ["faculty", "both"],
      branch: prop.branch,
    };
    axios
      .post(`${baseApiURL()}/notice/getNoticeforfaculty`, query, {
        headers
      })
      .then((response) => {
        if (response.data.success) {
          setNotice(response.data.notice);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response?.data?.message || "Error fetching notices");
      });
  };

  useEffect(() => {
    getNoticeHandler();
    getBranchData();
  }, [router.pathname]);

  const addNoticeHandler = (e) => {
    e.preventDefault();
    toast.loading("Adding Notice...");
    const headers = { "Content-Type": 'multipart/form-data' };
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    data.branch.forEach((br) => formData.append("branch[]", br));
    data.semester.forEach((sem) => formData.append("semester[]", sem));
    formData.append("forwhom" , data.forwhom);
    formData.append("type", "notice");
    if(file){
      formData.append("notice", file);
    }
    axios
      .post(`${baseApiURL()}/notice/addNotice`, formData, { headers })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          setFile("");
          getNoticeHandler();
          setOpen(false);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response?.data?.message || "Error adding notice");
      });
  };

  const deleteNoticeHandler = (id) => {
    toast.loading("Deleting Notice...");
    const headers = { "Content-Type": "application/json" };
    axios
      .delete(`${baseApiURL()}/notice/deleteNotice/${id}`, { headers })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          getNoticeHandler();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response?.data?.message || "Error deleting notice");
      });
  };

  const updateNoticeHandler = (e) => {
    e.preventDefault();
    toast.loading("Updating Notice...");
    const headers = { "Content-Type": "application/json" };
    axios
      .put(`${baseApiURL()}/notice/updateNotice/${id}`, data, { headers })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          getNoticeHandler();
          setOpen(false);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response?.data?.message || "Error updating notice");
      });
  };

  const setOpenEditSectionHandler = (index) => {
    setEdit(true);
    setOpen(true);
    setData({
      title: notice[index].title,
      description: notice[index].description,
      forwhom: notice[index].forwhom,
      branch: notice[index].branch,
      semester: notice[index].semester,
    });
    setId(notice[index]._id);
  };

  const openHandler = () => {
    setOpen(!open);
    setEdit(false);
    setData({ title: "", description: "", forwhom: "student", branch: "", semester: "" });
  };

  return (
    <div className="w-full mx-auto flex justify-center items-start flex-col my-10">
      <div className="relative flex justify-between items-center w-full">
        <Heading title="Notices" />
        {open ? (
          <button
            className="absolute right-2 flex justify-center items-center border-2 border-red-500 px-3 py-2 rounded text-red-500"
            onClick={openHandler}
          >
            <span className="mr-2">
              <BiArrowBack className="text-red-500" />
            </span>
            Close
          </button>
        ) : (
          <button
            className="absolute right-2 flex justify-center items-center border-2 border-red-500 px-3 py-2 rounded text-red-500"
            onClick={openHandler}
          >
            Add Notice
            <span className="ml-2">
              <IoAddOutline className="text-red-500 text-xl" />
            </span>
          </button>
        )}
      </div>

      {!open && (
        <div className="mt-8 w-full">
          {notice &&
            notice.map((item, index) => (
              <div
                key={item._id}
                className="border-blue-500 border-2 w-full rounded-md shadow-sm py-4 px-6 mb-4 relative"
              >
                <div className="absolute flex justify-center items-center right-4 bottom-3">
                  <span className="text-sm bg-blue-500 px-4 py-1 text-white rounded-full">
                    {item.forwhom}
                  </span>
                  <span
                    className="text-2xl ml-2 cursor-pointer hover:text-red-500"
                    onClick={() => deleteNoticeHandler(item._id)}
                  >
                    <MdDeleteOutline />
                  </span>
                  <span
                    className="text-2xl ml-2 cursor-pointer hover:text-blue-500"
                    onClick={() => setOpenEditSectionHandler(index)}
                  >
                    <MdEditNote />
                  </span>
                </div>
                <p
                  className={`text-xl font-medium flex items-center ${
                    item.link ? "cursor-pointer group" : ""
                  }`}
                  onClick={() => item.link && window.open(process.env.REACT_APP_MEDIA_LINK + "/" + item.link)}
                >
                  {item.title}
                  {item.link && (
                    <span className="text-2xl group-hover:text-blue-500 ml-1">
                      <IoMdLink />
                    </span>
                  )}
                </p>
                <p className="text-base mt-1">{item.description}</p>
                <p className="text-sm absolute top-4 right-4 flex items-center">
                  <HiOutlineCalendar className="mr-1" />
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
        </div>
      )}

      {open && (
        <form className="mt-8 w-full">
          <div className="w-[40%] mt-2">
            <label htmlFor="title">Notice Title</label>
            <input
              type="text"
              id="title"
              className="bg-blue-50 py-2 px-4 w-full mt-1 border"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
            />
          </div>

          <div className="w-[40%] mt-4">
            <label htmlFor="description">Notice Description</label>
            <textarea
              id="description"
              rows="4"
              className="bg-blue-50 py-2 px-4 w-full mt-1 resize-none border"
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            ></textarea>
          </div>

          <div className="w-[40%] mt-4">
            <label htmlFor="branch">Branch</label>
            <select
              id="branch"
              multiple
              className="bg-blue-50 py-2 px-4 rounded-sm w-full mt-1 resize-none border"
              value={data.branch}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions).map(
                  (option) => option.value
                );
                setData({ ...data, branch: selectedOptions });
              }}
            >
              {branch &&
                branch.map((branch) => (
                  <option value={branch.name} key={branch.name}>
                    {branch.name}
                  </option>
                ))}
            </select>

            {data.branch.length > 0 && (
              <div className="mt-2 text-sm text-blue-700">
                Selected: {data.branch.join(", ")}
              </div>
            )}
          </div>

          <div className="w-[40%] mt-4">
            <label htmlFor="semester">Semester</label>
            <select
              id="semester"
              multiple
              className="bg-blue-50 py-2 px-4 rounded-sm w-full mt-1 resize-none border"
              value={data.semester}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions).map(
                  (option) => option.value
                );
                setData({ ...data, semester: selectedOptions });
              }}
            >
              <option value="1">1st Semester</option>
              <option value="2">2nd Semester</option>
              <option value="3">3rd Semester</option>
              <option value="4">4th Semester</option>
              <option value="5">5th Semester</option>
              <option value="6">6th Semester</option>
              <option value="7">7th Semester</option>
              <option value="8">8th Semester</option>
            </select>

            {data.semester.length > 0 && (
              <div className="mt-2 text-sm text-blue-700">
                Selected: {data.semester.join(", ")}
              </div>
            )}

          </div>  
            
          <div className="w-[40%] mt-4">
            <label htmlFor="upload">File Upload</label>
            {!file && (
              <label
                htmlFor="upload"
                className="px-4 bg-blue-50 py-2 rounded-sm w-full border text-base w-[80%] mt-1 flex justify-center items-center cursor-pointer"
              >
                Upload Material
                <span className="ml-2">
                  <FiUpload />
                </span>
              </label>
            )}
            {file && (
              <p
                className="px-4 border-2 border-blue-500 py-2 rounded w-full text-base w-[80%] mt-1 flex justify-center items-center cursor-pointer"
                onClick={() => setFile(null)}
              >
                Remove Selected Material
                <span className="ml-2">
                  <AiOutlineClose />
                </span>
              </p>
            )}
            <input
              type="file"
              name="upload"
              id="upload"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>  
            


            


          <button
            onClick={edit ? updateNoticeHandler : addNoticeHandler}
            className="bg-blue-500 text-white mt-6 px-6 rounded text-lg py-2 hover:bg-blue-600"
          >
            {edit ? "Update Notice" : "Add Notice"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Notice;