import { useState, useEffect } from "react";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";
import CommentSection from "./CommentSection";
import { FaReply } from "react-icons/fa";

const ForumPosts = ({ forumId, forumType }) => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  const authorId = localStorage.getItem("studentId") 
  const authorModel =  "Student Detail" ;

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
    <div className="p-4 mx-auto">
      <h2 className="text-2xl font-bold mb-4">Discussion</h2>
      <div className="max-w-xl">
        {posts.map((post) => (
          <div key={post._id} className={`border rounded p-3 mb-3 border-black ${post.isPinned ? "bg-yellow-200" : "bg-green-200"}`}>
            <div className="flex justify-between items-center">
            <p className="text-sm font-semibold">{post.author?.post} {post.author?.firstName} {post.author?.lastName}</p>
            <button
              title="Reply"
              onClick={() =>
                setActiveCommentPostId(activeCommentPostId === post._id ? null : post._id)
              }
            >
              <FaReply />
            </button>
            </div>
            <p>{post.content}</p>
            <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
            <div className="flex justify-end mt-2">
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
