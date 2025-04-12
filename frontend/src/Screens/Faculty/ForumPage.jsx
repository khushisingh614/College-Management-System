import React, { useEffect, useState } from "react";
import axios from "axios";
import ForumList from "./ForumList";
import ForumPosts from "./ForumPosts";
import { baseApiURL } from "../../baseUrl";

const ForumPage = () => {
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

      {/* Forum List */}
      <ForumList
        onSelectForum={(id) => setSelectedForumId(id)}
      />

      {/* Forum Posts */}
      {selectedForumId && (
        <div className="mt-2">
          <ForumPosts forumId={selectedForumId} />
        </div>
      )}
    </div>
  );
};

export default ForumPage;

