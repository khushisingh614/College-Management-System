import React, { useEffect, useState } from "react";
import axios from "axios";
import ForumList from "./ForumList";
import ForumPosts from "./ForumPosts";
import { baseApiURL } from "../../baseUrl";

const ForumPage = () => {
  const [forumType, setForumType] = useState("BranchSemForum"); // 'general' or 'subject'
  const [selectedForumId, setSelectedForumId] = useState(null);

  // 🔹 Call initialization API once on mount
  useEffect(() => {
    const initForums = async () => {
      try {
        await axios.post(`${baseApiURL()}/forum/initialize-forums`);
        console.log("Forums initialized successfully");
      } catch (err) {
        console.error("Error initializing forums:", err);
      }
    };

    initForums();
  }, []);

  return (
    <div className="p-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-xl mt-6">
      {/* Toggle Buttons */}
      <div className="flex justify-center gap-6 mb-8">
        <button
          onClick={() => setForumType("BranchSemForum")}
          className={`px-6 py-3 text-lg font-semibold rounded-xl transition-all ease-in-out duration-300 transform ${
            forumType === "BranchSemForum" 
              ? "bg-blue-600 text-white scale-105 shadow-md"
              : "bg-gray-200 text-blue-600 hover:bg-blue-100"
          }`}
        >
          General Forums
        </button>
        <button
          onClick={() => setForumType("SubjectForum")}
          className={`px-6 py-3 text-lg font-semibold rounded-xl transition-all ease-in-out duration-300 transform ${
            forumType === "SubjectForum"
              ? "bg-blue-600 text-white scale-105 shadow-md"
              : "bg-gray-200 text-blue-600 hover:bg-blue-100"
          }`}
        >
          Subject Forums
        </button>
      </div>

      {/* Forum List */}
      <div className="max-w-7xl mx-auto">
        <ForumList
          forumType={forumType}
          onSelectForum={(id) => setSelectedForumId(id)}
        />
      </div>

      {/* Forum Posts */}
      {selectedForumId && (
        <div className="mt-6 p-6 bg-white rounded-lg shadow-lg transition-all ease-in-out duration-300">
          <ForumPosts forumId={selectedForumId} forumType={forumType} />
        </div>
      )}
    </div>
  );
};

export default ForumPage;
