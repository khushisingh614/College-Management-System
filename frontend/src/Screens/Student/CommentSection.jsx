import { useState, useEffect } from "react";
import axios from "axios";
import {baseApiURL} from "../../baseUrl";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  const authorId = localStorage.getItem("studentId");
  const authorModel = "Student Detail";

  const fetchComments = async () => {
    const res = await axios.get(`${baseApiURL()}/forum/posts/getcomments/${postId}`);
    //console.log(res.data);
    setComments(res.data);
  };

  const handleComment = async () => {
    await axios.post(`${baseApiURL()}/forum/posts/${postId}/comments`, {
      postId,
      content,
      authorId,
      authorModel
    });
    setContent("");
    fetchComments();
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="mt-3 px-4 py-2 border-l-2 border-gray-400 rounded-md">
      {comments.map((cmt) => (
        <div key={cmt._id} className="text-sm mb-2">
          <p className="font-medium">{cmt.author?.post} {cmt.author?.firstName} {cmt.author?.lastName}</p>
          <p>{cmt.content}</p>
          <p className="text-xs text-gray-500">{new Date(cmt.createdAt).toLocaleString()}</p>
        </div>
      ))}

      <textarea
        className="w-full p-2 border rounded mt-2"
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={handleComment}
        className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Comment
      </button>
    </div>
  );
};

export default CommentSection;
