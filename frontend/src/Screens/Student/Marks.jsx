import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import Heading from "../../components/Heading";
import { baseApiURL } from "../../baseUrl";

const Marks = () => {
  const userData = useSelector((state) => state.userData);
  const [internal, setInternal] = useState();
  const [external, setExternal] = useState();

  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(
        `${baseApiURL()}/marks/getMarks`,
        { enrollmentNo: userData.enrollmentNo },
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data.length !== 0) {
          setInternal(response.data.Mark[0].internal);
          setExternal(response.data.Mark[0].external);
        }
      })
      .catch((error) => {
        toast.dismiss();
        console.log(error);
      });
  }, [userData.enrollmentNo]);

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 mb-16 px-4 sm:px-8">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 border border-gray-200">
        <Heading title={`Semester ${userData.semester} Marks`} />

        {(internal || external) ? (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {internal && (
              <div className="bg-gray-50 border border-gray-200 shadow-md rounded-xl p-6">
                <h2 className="text-xl font-semibold border-b border-red-400 pb-2 text-gray-700">
                  Internal Marks (Out of 20)
                </h2>
                <div className="mt-5 space-y-3">
                  {Object.keys(internal).map((subject, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-gray-600 text-base border-b py-1"
                    >
                      <p>{subject}</p>
                      <span className="font-medium">{internal[subject]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {external && (
              <div className="bg-gray-50 border border-gray-200 shadow-md rounded-xl p-6">
                <h2 className="text-xl font-semibold border-b border-red-400 pb-2 text-gray-700">
                  External Marks (Out of 80)
                </h2>
                <div className="mt-5 space-y-3">
                  {Object.keys(external).map((subject, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-gray-600 text-base border-b py-1"
                    >
                      <p>{subject}</p>
                      <span className="font-medium">{external[subject]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg mt-16">
            No Marks Available At The Moment!
          </p>
        )}
      </div>
    </div>
  );
};

export default Marks;
