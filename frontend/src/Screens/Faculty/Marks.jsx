import axios from "axios";
import React, { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { baseApiURL } from "../../baseUrl";
import * as XLSX from "xlsx";

const Marks = () => {
  const [subject, setSubject] = useState();
  const [branch, setBranch] = useState();
  const [studentData, setStudentData] = useState();
  const [selected, setSelected] = useState({
    branch: "",
    semester: "",
    subject: "",
    examType: "",
  });

  const loadStudentDetails = () => {
    const headers = { "Content-Type": "application/json" };
    axios
      .post(
        `${baseApiURL()}/student/details/getDetailsofmarks`,
        {
          branch: selected.branch,
          semester: selected.semester,
          subject: selected.subject,
          examType: selected.examType,
        },
        { headers }
      )
      .then((response) => {
        if (response.data.success) {
          setStudentData(response.data.user);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  };

  const downloadExcelHandler = () => {
    if (!studentData || studentData.length === 0) {
      toast.error("No student data available to download");
      return;
    }

    const examType = selected.examType;
    const subject = selected.subject;

    const data = studentData.map((student) => ({
      EnrollmentNo: student.enrollmentNo,
      Name: student.firstName + " " + student.lastName || "-",
      [subject + " - " + examType]: student.existingMarks ?? "Not Available",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Marks");

    const filename = `${selected.branch}_Sem${selected.semester}_${subject}_${examType}_Marks.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  const submitMarksHandler = () => {
    let container = document.getElementById("markContainer");
    container.childNodes.forEach((enroll) => {
      setStudentMarksHandler(
        enroll.id,
        document.getElementById(enroll.id + "marks").value
      );
    });
  };

  const setStudentMarksHandler = (enrollment, value) => {
    const headers = { "Content-Type": "application/json" };
    axios
      .post(
        `${baseApiURL()}/marks/addMarks`,
        {
          enrollmentNo: enrollment,
          [selected.examType]: {
            [selected.subject]: value,
          },
        },
        { headers }
      )
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  };

  const getBranchData = () => {
    const headers = { "Content-Type": "application/json" };
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

  const getSubjectData = (branch, semester) => {
    if (!branch || !semester) return;
    toast.loading("Loading Subjects");
    axios
      .get(`${baseApiURL()}/subject/getSubjectbranchandsem`, {
        params: { offering_branch: selected.branch, semester: selected.semester },
      })
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
  };

  useEffect(() => {
    getBranchData();
  }, []);

  useEffect(() => {
    if (selected.branch && selected.semester) {
      getSubjectData(selected.branch, selected.semester);
    }
  }, [selected.branch, selected.semester]);

  const resetValueHandler = () => {
    setStudentData();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10 bg-white">
      <div className="relative flex justify-between items-center w-full mb-6">
        <Heading title={`Upload Marks`} />
        {studentData && (
          <button
            className="absolute right-2 flex items-center border border-red-500 px-4 py-2 rounded-md text-red-600 hover:bg-red-50 transition"
            onClick={resetValueHandler}
          >
            <BiArrowBack className="mr-2" />
            Close
          </button>
        )}
      </div>

      {!studentData && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label htmlFor="branch" className="block mb-1 font-medium">
                Select Branch
              </label>
              <select
                id="branch"
                className="w-full px-3 py-2 border rounded-md"
                value={selected.branch}
                onChange={(e) =>
                  setSelected({ ...selected, branch: e.target.value })
                }
              >
                <option value="">-- Select --</option>
                {branch &&
                  branch.map((b) => (
                    <option value={b.name} key={b.name}>
                      {b.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label htmlFor="semester" className="block mb-1 font-medium">
                Select Semester
              </label>
              <select
                id="semester"
                className="w-full px-3 py-2 border rounded-md"
                value={selected.semester}
                onChange={(e) =>
                  setSelected({ ...selected, semester: e.target.value })
                }
              >
                <option value="">-- Select --</option>
                {[...Array(8)].map((_, i) => (
                  <option value={i + 1} key={i}>
                    {i + 1} Semester
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="subject" className="block mb-1 font-medium">
                Select Subject
              </label>
              <select
                id="subject"
                className="w-full px-3 py-2 border rounded-md"
                value={selected.subject}
                onChange={(e) =>
                  setSelected({ ...selected, subject: e.target.value })
                }
              >
                <option value="">-- Select --</option>
                {subject &&
                  subject.map((s) => (
                    <option value={s.name} key={s.name}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label htmlFor="examType" className="block mb-1 font-medium">
                Select Exam Type
              </label>
              <select
                id="examType"
                className="w-full px-3 py-2 border rounded-md"
                value={selected.examType}
                onChange={(e) =>
                  setSelected({ ...selected, examType: e.target.value })
                }
              >
                <option value="">-- Select --</option>
                <option value="internal">Internal</option>
                <option value="external">External</option>
              </select>
            </div>
          </div>

          <button
            className="bg-blue-600 text-white px-6 py-2 mt-8 rounded hover:bg-blue-700 transition"
            onClick={loadStudentDetails}
          >
            Load Student Data
          </button>
        </>
      )}

      {studentData && studentData.length > 0 && (
        <>
          <p className="mt-6 text-xl font-semibold">
            Upload {selected.examType} Marks of {selected.branch} - Sem{" "}
            {selected.semester} ({selected.subject})
          </p>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6"
            id="markContainer"
          >
            {studentData.map((student) => (
              <div
                key={student.enrollmentNo}
                id={student.enrollmentNo}
                className="flex justify-between items-center border border-blue-300 rounded-md p-3 shadow-sm bg-white"
              >
                <span className="text-sm font-medium w-1/2 truncate">
                  {student.enrollmentNo}
                </span>
                <input
                  type="number"
                  id={`${student.enrollmentNo}marks`}
                  placeholder="Enter Marks"
                  defaultValue={
                    student.existingMarks !== null ? student.existingMarks : ""
                  }
                  className="w-1/2 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
              onClick={submitMarksHandler}
            >
              Upload Student Marks
            </button>
            <button
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
              onClick={downloadExcelHandler}
            >
              Download Excel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Marks;
