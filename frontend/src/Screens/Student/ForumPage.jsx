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
    <div className="p-6 bg-white rounded-md mt-4">
      {/* Toggle Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setForumType("BranchSemForum")}
          className={`px-4 py-2 rounded ${
            forumType === "BranchSemForum" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          General Forums
        </button>
        <button
          onClick={() => setForumType("SubjectForum")}
          className={`px-4 py-2 rounded ${
            forumType === "SubjectForum" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Subject Forums
        </button>
      </div>

      {/* Forum List */}
      <ForumList
        forumType={forumType}
        onSelectForum={(id) => setSelectedForumId(id)}
      />

      {/* Forum Posts */}
      {selectedForumId && (
        <div className="mt-2">
          <ForumPosts forumId={selectedForumId} forumType={forumType} />
        </div>
      )}
    </div>
  );
};

export default ForumPage;

