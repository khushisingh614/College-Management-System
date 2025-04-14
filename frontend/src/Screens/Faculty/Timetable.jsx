import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import Heading from "../../components/Heading";
import { AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";
import { baseApiURL } from "../../baseUrl";
const Timetable = () => {
  const [addselected, setAddSelected] = useState({
    branch: "",
    semester: "",
  });
  const [file, setFile] = useState();
  const [branch, setBranch] = useState();
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    getBranchData();
  }, []);

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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const imageUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(imageUrl);
  };

  const addTimetableHandler = () => {
    toast.loading("Adding Timetable");
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    const formData = new FormData();
    formData.append("branch", addselected.branch);
    formData.append("semester", addselected.semester);
    formData.append("type", "timetable");
    formData.append("timetable", file);
    axios
      .post(`${baseApiURL()}/timetable/addTimetable`, formData, {
        headers: headers,
      })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          setAddSelected({
            branch: "",
            semester: "",
          });
          setFile("");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        console.log("FIle error", error);

        toast.error(error.response.data.message);
      });
  };
  return (
<div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10 bg-white px-4 py-10">
  <div className="flex justify-between items-center w-full">
    <Heading title={`Upload Timetable`} />
  </div>
  <div className="w-full flex justify-evenly items-center mt-12">
    <div className="w-1/2 flex flex-col justify-center items-center bg-gradient-to-r from-indigo-200 via-blue-100 to-violet-200 p-6 rounded-xl shadow-lg">
      <p className="mb-4 text-xl font-semibold text-indigo-800">Add Timetable</p>

      <select
        id="branch"
        className="px-2 bg-indigo-50 py-3 rounded-md text-base w-[80%] text-indigo-700 mt-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        value={addselected.branch}
        onChange={(e) =>
          setAddSelected({ ...addselected, branch: e.target.value })
        }
      >
        <option defaultValue>-- Select Branch --</option>
        {branch &&
          branch.map((branch) => (
            <option value={branch.name} key={branch.name}>
              {branch.name}
            </option>
          ))}
      </select>

      <select
        onChange={(e) =>
          setAddSelected({ ...addselected, semester: e.target.value })
        }
        value={addselected.semester}
        name="semester"
        id="semester"
        className="px-2 bg-indigo-50 py-3 rounded-md text-base w-[80%] text-indigo-700 mt-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
      >
        <option defaultValue>-- Select Semester --</option>
        <option value="1">1st Semester</option>
        <option value="2">2nd Semester</option>
        <option value="3">3rd Semester</option>
        <option value="4">4th Semester</option>
        <option value="5">5th Semester</option>
        <option value="6">6th Semester</option>
        <option value="7">7th Semester</option>
        <option value="8">8th Semester</option>
      </select>

      {!addselected.link && (
        <label
          htmlFor="upload"
          className="px-4 py-3 mt-4 w-[80%] bg-indigo-100 hover:bg-indigo-200 rounded-md cursor-pointer flex justify-center items-center text-indigo-800 font-medium transition-all duration-200"
        >
          Select Timetable
          <span className="ml-2 text-lg">
            <FiUpload />
          </span>
        </label>
      )}

      {previewUrl && (
        <p
          className="px-4 py-2 mt-4 w-[80%] bg-white border-2 border-violet-500 text-violet-700 rounded-md flex justify-center items-center cursor-pointer font-medium"
          onClick={() => {
            setFile("");
            setPreviewUrl("");
          }}
        >
          Remove Selected Timetable
          <span className="ml-2 text-lg">
            <AiOutlineClose />
          </span>
        </p>
      )}

      <input
        type="file"
        name="upload"
        id="upload"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />

      <button
        className="mt-8 px-6 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold rounded-md transition duration-300"
        onClick={addTimetableHandler}
      >
        Add Timetable
      </button>

      {previewUrl && (
        <img
          className="mt-6 rounded-md border border-indigo-300 shadow-md"
          src={previewUrl}
          alt="timetable"
        />
      )}
    </div>
  </div>
</div>

  );
};

export default Timetable;
