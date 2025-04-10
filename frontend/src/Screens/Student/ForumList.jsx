import { useEffect, useState } from "react";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";

const ForumList = ({ forumType, onSelectForum }) => {
    const [forums, setForums] = useState([]);
    const enrollmentNo = localStorage.getItem("studentId");
  
    useEffect(() => {
      const fetchForums = async () => {
        try {
          const endpoint = forumType === "SubjectForum" ? "subject-forums" : "general-forums";
          const res = await axios.get(`${baseApiURL()}/forum/${endpoint}/${enrollmentNo}`);
          setForums(res.data);
        } catch (err) {
          console.error("Error fetching forums:", err);
        }
      };
  
      fetchForums();
    }, [forumType]);
  
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">
          {forumType === "subject" ? "Subject Forums" : "General Forums"}
        </h2>
        <ul className="space-y-3">
          {forums.map((forum) => (
            <li
              key={forum._id}
              className="border p-3 bg-[#8E7DBE] rounded hover:bg-[#693382] cursor-pointer"
              onClick={() => onSelectForum(forum._id)}
            >
              <h3 className="font-semibold text-white text-[17px]">{forum.title}</h3>
              <p className="text-sm text-gray-600 text-yellow-400 text-[16px]">{forum.description}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default ForumList;
  
