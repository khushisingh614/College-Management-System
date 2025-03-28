import React, { useState } from "react";
import Heading from "../../components/Heading";
import AddFeedback from "./Feedback/AdminFeedbackForm";
import FeedbackList from "./Feedback/AdminFeedbackList";

const Feedback = () => {
  const [selected, setSelected] = useState("add");

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title="Feedbacks" />
        <div className="flex justify-end items-center w-full">
          <button
            className={`${
              selected === "add" && "border-b-2"
            } border-blue-500 px-4 py-2 text-black rounded-sm mr-6`}
            onClick={() => setSelected("add")}
          >
            Add Feedback
          </button>
          <button
            className={`${
              selected === "view" && "border-b-2"
            } border-blue-500 px-4 py-2 text-black rounded-sm`}
            onClick={() => setSelected("view")}
          >
            View Feedbacks
          </button>
        </div>
      </div>
      {selected === "add" && <AddFeedback />}
      {selected === "view" && <FeedbackList />}
    </div>
  );
};

export default Feedback;
