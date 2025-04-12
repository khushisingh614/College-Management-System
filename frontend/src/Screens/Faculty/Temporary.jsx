import { useState } from "react";
import axios from "axios";
import Heading from "../../components/Heading";
import { baseApiURL } from "../../baseUrl";
import toast from "react-hot-toast";

const TemporaryAccess = (props) => {
    const [userEmail, setUserEmail] = useState("");
    const [tempPassword, setTempPassword] = useState("");
    const [selectedTabs, setSelectedTabs] = useState([]);
    const availableTabs = [
        "Notice", "Material", "Upload Marks", "Assignment", "Attendance", "Student Info", "Curriculum", "Timetable"
    ];
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerateAccess = async () => {
        setLoading(true);
        setError("");
        if (!userEmail) {
            setError("Please provide both Faculty ID and Email.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.put(`${baseApiURL()}/faculty/auth/update-temporary`, {
                id: props.employeeid,
                email: userEmail,
                selected_tabs: selectedTabs,
            });
            

            if (response.data.success) {
                setTempPassword(response.data.temporary_password);
                toast.success("Temporary Access Given");
            } else {
                setError("Failed to grant temporary access");
            }
        } catch (err) {
            console.error(err);
            setError("Error granting access. Try again.");
        }
        setLoading(false);
    };

    if (props.temporary) return null;

    return (
        <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
  <Heading title="Grant Temporary Faculty Access" />
  <br />
  
  <div className="w-full flex justify-center items-center mt-8">
    <div className="w-[40%] bg-white p-8 rounded-lg shadow-md border border-indigo-200">
      
      <div className="w-full mb-4">
        <label htmlFor="email" className="leading-7 text-sm text-indigo-700">
          Enter Temporary User Email
        </label>
        <input
          type="email"
          placeholder="Temporary User Email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          className="w-full bg-indigo-50 rounded border border-indigo-300 focus:border-indigo-500 focus:bg-indigo-100 focus:ring-2 focus:ring-indigo-500 text-base outline-none py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>

      <div className="w-full mb-4">
        <label className="leading-7 text-sm text-indigo-700">Select Tabs to Grant Access</label>
        <div className="grid grid-cols-2 gap-4">
          {availableTabs.map((tab) => (
            <label key={tab} className="flex items-center space-x-2 text-indigo-700">
              <input
                type="checkbox"
                value={tab}
                onChange={(e) => {
                  const updatedTabs = e.target.checked
                    ? [...selectedTabs, tab]
                    : selectedTabs.filter((t) => t !== tab);
                  setSelectedTabs(updatedTabs);
                }}
                className="focus:ring-indigo-500"
              />
              <span>{tab}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleGenerateAccess}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-md text-lg transition-colors duration-200"
          disabled={loading}
        >
          {loading ? "Granting Access..." : "Grant Access"}
        </button>
      </div>

      {tempPassword && (
        <p className="mt-4 text-green-600 text-lg">Temporary Password: {tempPassword}</p>
      )}

      {error && <p className="mt-4 text-red-600 text-lg">{error}</p>}
    </div>
  </div>
</div>

    );
};

export default TemporaryAccess;