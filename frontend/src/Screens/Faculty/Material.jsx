/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import Heading from "../../components/Heading";
import { AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseApiURL } from "../../baseUrl";
const Material = () => {
  const { fullname } = useSelector((state) => state.userData);
  const [subject, setSubject] = useState();
  const [file, setFile] = useState();
  const [selected, setSelected] = useState({
    title: "",
    subject: "",
    faculty: fullname.split(" ")[0] + " " + fullname.split(" ")[2],
  });

  useEffect(() => {
    toast.loading("Loading Subjects");
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

  const addMaterialHandler = () => {
    toast.loading("Adding Material");
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    const formData = new FormData();
    formData.append("title", selected.title);
    formData.append("subject", selected.subject);
    formData.append("faculty", selected.faculty);
    formData.append("type", "material");
    formData.append("material", file);
    axios
      .post(`${baseApiURL()}/material/addMaterial`, formData, {
        headers: headers,
      })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          setSelected({
            title: "",
            subject: "",
            faculty: fullname.split(" ")[0] + " " + fullname.split(" ")[2],
          });
          setFile("");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };
  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10 ">
  <div className="flex justify-between items-center w-full">
    <Heading title={`Upload Material`} />
  </div>

  <div className="w-full flex justify-center items-center mt-12">
    <div className="w-[40%] bg-white p-8 rounded-lg shadow-md border border-indigo-200">
      <div className="w-full mt-4">
        <label htmlFor="title" className="text-lg font-medium text-indigo-700">
          Material Title
        </label>
        <input
          type="text"
          id="title"
          className="bg-indigo-50 py-3 px-4 w-full mt-1 border border-indigo-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={selected.title}
          onChange={(e) =>
            setSelected({ ...selected, title: e.target.value })
          }
        />
      </div>

      <div className="w-full mt-4">
        <label htmlFor="subject" className="text-lg font-medium text-indigo-700">
          Material Subject
        </label>
        <select
          value={selected.subject}
          name="subject"
          id="subject"
          onChange={(e) =>
            setSelected({ ...selected, subject: e.target.value })
          }
          className="px-4 py-3 mt-1 w-full border border-indigo-300 rounded-sm bg-indigo-50 text-base text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option defaultValue value="select">
            -- Select Subject --
          </option>
          {subject &&
            subject.map((item) => (
              <option value={item.name} key={item.name}>
                {item.name}
              </option>
            ))}
        </select>
      </div>

      {!file && (
        <label
          htmlFor="upload"
          className="px-4 bg-indigo-50 py-3 rounded-sm text-base mt-4 w-full border text-indigo-500 cursor-pointer hover:bg-indigo-100 flex justify-center items-center"
        >
          Upload Material
          <span className="ml-2">
            <FiUpload />
          </span>
        </label>
      )}

      {file && (
        <p
          className="px-4 border-2 border-indigo-500 py-2 rounded text-base mt-4 w-full flex justify-center items-center cursor-pointer hover:bg-indigo-50"
          onClick={() => setSelected({ ...selected, link: "" })}
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

      <div className="flex justify-center mt-8">
        <button
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-md text-lg transition-colors duration-200"
          onClick={addMaterialHandler}
        >
          Add Material
        </button>
      </div>
    </div>
  </div>
</div>
  );
};

export default Material;
