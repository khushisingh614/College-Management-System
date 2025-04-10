import { useState, useEffect } from "react";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";
import { FaThumbtack, FaReply } from "react-icons/fa";
import CommentSection from "./CommentSection";

const ForumPosts = ({ forumId }) => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  const authorId = Number(localStorage.getItem("facId"));
  const authorModel = "Faculty Detail";

  const fetchPosts = async () => {
    const res = await axios.get(`${baseApiURL()}/forum/posts/${forumId}/SubjectForum`);
    //console.log(res.data)
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, [forumId]);

  const handlePost = async () => {
    await axios.post(`${baseApiURL()}/forum/posts`, {
      forumId,
      forumType:"SubjectForum",
      authorId,
      authorModel,
      content,
    });
    setContent("");
    fetchPosts();
  };
  const handlePin = async (postId, newPinState) => {
    try {
      await axios.patch(`${baseApiURL()}/forum/posts/fac/${postId}/pin`, {
        isPinned: newPinState
      });
      fetchPosts(); // Refresh posts after pinning
    } catch (err) {
      console.error("Error pinning post:", err);
    }
  };  

  return (
    <div className="p-4 mx-auto">
      <h2 className="text-2xl font-bold mb-4">Discussion</h2>
      <div className="max-w-xl">
  {posts.map((post) => (
    <div key={post._id} className={`border rounded p-3 mb-3 border-black ${post.isPinned ? "bg-yellow-200" : "bg-green-200"}`}>
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold">
          {post.author?.post} {post.author?.firstName} {post.author?.lastName}
        </p>
        <button
          className={`text-md px-2 py-1 rounded text-black`}
          onClick={() => handlePin(post._id, !post.isPinned)}
          title={post.isPinned ? "Unpin" : "Pin"}
        >
          <FaThumbtack className={`${post.isPinned ? "rotate-45" : ""}`} />
        </button>

        </div>

      <p>{post.content}</p>
      <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
      <div className="flex justify-end mt-2">
      <button
          title="Reply"
          onClick={() =>
            setActiveCommentPostId(activeCommentPostId === post._id ? null : post._id)
          }
        >
          <FaReply />
        </button>
      </div>
      {activeCommentPostId === post._id && <CommentSection postId={post._id} />}
    </div>
  ))}
</div>

      <div className="mb-4 max-w-2xl">
        <textarea
          className="w-full p-2 border rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your message..."
        />
        <button
          onClick={handlePost}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default ForumPosts;
