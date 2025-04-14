import { useState, useEffect } from "react";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";
import CommentSection from "./CommentSection";
import { FaReply } from "react-icons/fa";

const ForumPosts = ({ forumId, forumType }) => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  const authorId = localStorage.getItem("studentId");
  const authorModel = "Student Detail";

  const fetchPosts = async () => {
    const res = await axios.get(`${baseApiURL()}/forum/posts/${forumId}/${forumType}`);
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, [forumId, forumType]);

  const handlePost = async () => {
    await axios.post(`${baseApiURL()}/forum/posts`, {
      forumId,
      forumType,
      authorId,
      authorModel,
      content,
    });
    setContent("");
    fetchPosts();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Discussion</h2>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className={`p-4 rounded-lg shadow-md border ${post.isPinned ? "bg-yellow-100" : "bg-green-100"} transition-all`}
            style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-gray-700">
                {post.author?.post} {post.author?.firstName} {post.author?.lastName}
              </p>
              <button
                title="Reply"
                className="text-blue-600 hover:text-blue-800"
                onClick={() =>
                  setActiveCommentPostId(activeCommentPostId === post._id ? null : post._id)
                }
              >
                <FaReply className="text-xl" />
              </button>
            </div>

            <p className="text-lg text-gray-800">{post.content}</p>
            <p className="text-xs text-gray-500 mt-2">{new Date(post.createdAt).toLocaleString()}</p>

            {activeCommentPostId === post._id && <CommentSection postId={post._id} />}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <textarea
          className="w-full p-3 border rounded-lg text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          rows="4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your message..."
        />
        <button
          onClick={handlePost}
          className="mt-4 px-6 py-3 w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default ForumPosts;
