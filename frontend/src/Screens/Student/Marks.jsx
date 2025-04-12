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
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10 bg-white shadow-lg rounded-lg p-8">
    <Heading title={`Marks of Semester ${userData.semester}`} />
    <div className="mt-14 w-full flex gap-10">
      {internal && (
        <div className="w-1/2 shadow-lg p-6 bg-green-100 rounded-lg border border-gray-200">
          <p className="border-b-2 border-red-500 text-2xl font-semibold pb-3">
            Internal Marks (Out of 20)
          </p>
          <div className="mt-5">
            {Object.keys(internal).map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex justify-between items-center w-full text-lg mt-4"
                >
                  <p className="w-full text-gray-700">{item}</p>
                  <span className="font-medium text-blue-600">{internal[item]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {external && (
        <div className="w-1/2 shadow-lg p-6 bg-green-100 rounded-lg border border-gray-200">
          <p className="border-b-2 border-red-500 text-2xl font-semibold pb-3">
            External Marks (Out of 80)
          </p>
          <div className="mt-5">
            {Object.keys(external).map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex justify-between items-center w-full text-lg mt-4"
                >
                  <p className="w-full text-gray-700">{item}</p>
                  <span className="font-medium text-blue-600">{external[item]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {!internal && !external && (
        <p className="mt-6 text-center text-lg text-gray-600">
          No Marks Available At The Moment!
        </p>
      )}
    </div>
  </div>
  );  
};

export default Marks;
