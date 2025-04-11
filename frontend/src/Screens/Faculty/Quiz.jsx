import React, { useState } from "react";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";

const Quiz = () => {
  const [pdf, setPdf] = useState(null);
  const [numSubj, setNumSubj] = useState("");
  const [numObj, setNumObj] = useState("");
  const [branch, setBranch] = useState("");
  const [sem, setSem] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [facultyId, setFacultyId] = useState(""); 
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const handlePdfChange = (e) => {
    setPdf(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (!pdf) {
      alert("Please upload a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("facultyId", facultyId);
    formData.append("title", title);
    formData.append("branch", branch);
    formData.append("semester", sem);
    formData.append("subject", subject);
    formData.append("numSubj", numSubj);
    formData.append("numObj", numObj);
    formData.append("type", "quiz");
    formData.append("quiz", pdf);

    try {
      const res = await axios.post(`${baseApiURL()}/quiz/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Quiz generated:", res.data);
      setMessage("Quiz generated successfully!");
    } catch (err) {
      console.error("❌ Error generating quiz:", err);
      setMessage("Failed to generate quiz.");
    }

    setSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md p-6 rounded-2xl border border-purple-200">
      <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">Generate Quiz</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Upload PDF</label>
          <input type="file" accept=".pdf" onChange={handlePdfChange} required className="w-full" />
        </div>

        <div>
          <label className="block font-medium mb-1">Faculty ID</label>
          <input
            type="text"
            value={facultyId}
            onChange={(e) => setFacultyId(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Branch</label>
          <input
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Semester</label>
          <input
            type="text"
            value={sem}
            onChange={(e) => setSem(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">No. of Subjective Questions</label>
          <input
            type="number"
            min={0}
            value={numSubj}
            onChange={(e) => setNumSubj(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">No. of Objective Questions</label>
          <input
            type="number"
            min={0}
            value={numObj}
            onChange={(e) => setNumObj(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-xl transition duration-200"
        >
          {submitting ? "Generating..." : "Generate Quiz"}
        </button>
      </form>
      {message && (
    <div className="text-center text-lg font-medium text-purple-700 bg-purple-100 p-2 mb-4 mt-2 ">
      {message}
    </div>
  )}
    </div>
  );
};

export default Quiz;


