import { useState } from "react";
import axios from "axios";
import Heading from "../../components/Heading";
import { baseApiURL } from "../../baseUrl";
import toast from "react-hot-toast";

const TemporaryAccess = (prop) => {
    const [userEmail, setUserEmail] = useState("");
    const [tempPassword, setTempPassword] = useState("");
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
                id: prop.employeeid,
                email: userEmail,
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

    if (prop.temporary) return null;

    return (
        <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
            <Heading title="Grant Temporary Faculty Access" />
            <br />
            <div className="flex justify-between items-center w-full">
                <div className="w-[40%] mb-4">
                    <label htmlFor="email" className="leading-7 text-sm ">
                        Enter Temporary User Email
                    </label>
                    <input
                        type="email"
                        placeholder="Temporary User Email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                </div>
            </div>

            <button 
                onClick={handleGenerateAccess} 
                className="mt-6 bg-blue-500 px-6 py-3 text-white"
                disabled={loading}
            >
                {loading ? "Granting Access..." : "Grant Access"}
            </button>

            {tempPassword && (
                <p className="mt-4 text-green-600">Temporary Password: {tempPassword}</p>
            )}

            {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
    );
};

export default TemporaryAccess;
