import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { baseApiURL } from "../../../baseUrl";
import { useSelector } from "react-redux";

const AdminFeedbackForm = () => {
  const adminId = useSelector((state) => state.userData?._id) || "";

  const [professors, setProfessors] = useState([]);
  const [subjects, setSubjects] = useState([]); // Store fetched subjects
  const [data, setData] = useState({
    adminId: "", // Will be updated once Redux state loads
    professorId: "",
    semester: "",
    subject: "",
    questions: [""], // Always initialized as an array
  });

  // Update adminId once Redux state is available
  useEffect(() => {
    if (adminId) {
      setData((prevData) => ({ ...prevData, adminId }));
    }
  }, [adminId]);

  useEffect(() => {
    fetchProfessors();
    fetchSubjects(); // Fetch subjects as well
  }, []);

  // Fetch Professors
  const fetchProfessors = () => {
    axios
      .get(`${baseApiURL()}/faculty/details/getAll`)
      .then((response) => {
        if (response.data.success) {
          setProfessors(response.data.user);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error("Error fetching professors");
        console.error(error);
      });
  };

  // Fetch Subjects
  const fetchSubjects = () => {
    axios
      .get(`${baseApiURL()}/subject/getSubject`) // Adjust API endpoint as needed
      .then((response) => {
        if (response.data.success) {
          setSubjects(response.data.subject);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error("Error fetching subjects");
        console.error(error);
      });
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...data.questions];
    updatedQuestions[index] = value;
    setData({ ...data, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setData({ ...data, questions: [...data.questions, ""] });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = data.questions.filter((_, i) => i !== index);
    setData({ ...data, questions: updatedQuestions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.adminId) {
      toast.error("Admin ID not found. Please try again.");
      return;
    }

    toast.loading("Creating Feedback Form...");
    axios
      .post(`${baseApiURL()}/admin/feedback/create`, data)
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success("Feedback form created successfully");
          setData({
            adminId: adminId, // Keep adminId after reset
            professorId: "",
            semester: "",
            subject: "",
            questions: [""],
          });
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error("Error creating feedback form");
        console.error(error);
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[70%] flex flex-col justify-center items-center gap-6 mx-auto mt-10"
    >
      <div className="w-[40%]">
        <label className="leading-7 text-sm">Select Professor</label>
        <select
          className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full mt-1"
          value={data.professorId}
          onChange={(e) => setData({ ...data, professorId: e.target.value })}
        >
          <option value="">-- Select --</option>
          {professors?.map((prof) => (
            <option key={prof._id} value={prof._id}>{`${prof.firstName} ${prof.lastName}`}</option>
          ))}
        </select>
      </div>

      <div className="w-[40%]">
        <label className="leading-7 text-sm">Enter Semester</label>
        <input
          type="number"
          className="w-full bg-blue-50 rounded border py-1 px-3 outline-none"
          value={data.semester}
          onChange={(e) => setData({ ...data, semester: e.target.value })}
        />
      </div>

      <div className="w-[40%]">
        <label className="leading-7 text-sm">Select Subject</label>
        <select
          className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full mt-1"
          value={data.subject}
          onChange={(e) => setData({ ...data, subject: e.target.value })}
        >
          <option value="">-- Select --</option>
          {subjects?.map((subj) => (
            <option key={subj._id} value={subj.name}>{subj.name}</option>
          ))}
        </select>
      </div>

      <div className="w-full flex flex-col gap-4">
        <label className="leading-7 text-sm">Feedback Questions</label>
        {Array.isArray(data.questions) && data.questions.length > 0 ? (
          data.questions?.map((question, index) => (
            <div key={index} className="w-full flex gap-4">
              <input
                type="text"
                className="w-full bg-blue-50 rounded border py-1 px-3 outline-none"
                value={question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
              />
              {data.questions.length > 1 && (
                <button
                  type="button"
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => removeQuestion(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600">No questions available</p>
        )}
        <button
          type="button"
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={addQuestion}
        >
          Add Question
        </button>
      </div>

      <button
        type="submit"
        className="bg-blue-500 px-6 py-3 rounded-sm my-6 text-white"
      >
        Create Feedback Form
      </button>
    </form>
  );
};

export default AdminFeedbackForm;
