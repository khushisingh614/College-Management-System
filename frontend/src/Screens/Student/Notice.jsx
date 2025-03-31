// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { baseApiURL } from "../../baseUrl";
// import toast from "react-hot-toast";

// const Notice = () => {
//   const [notices, setNotices] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchNotices();
//   }, []);

//   const fetchNotices = () => {
//     setLoading(true);
//     axios
//       .get(`${baseApiURL()}/notice/getAll`)
//       .then((response) => {
//         if (response.data.success) {
//           setNotices(response.data.notices || []);
//         } else {
//           toast.error(response.data.message);
//         }
//       })
//       .catch((error) => {
//         toast.error("Error fetching notices");
//         console.error(error);
//       })
//       .finally(() => setLoading(false));
//   };

//   return (
//     <div className="w-[70%] mx-auto mt-10">
//       <h2 className="text-2xl font-semibold mb-4">All Notices</h2>

//       {loading ? (
//         <p className="text-center text-gray-600">Loading notices...</p>
//       ) : notices.length === 0 ? (
//         <p className="text-center text-gray-600">No notices found.</p>
//       ) : (
//         <div className="flex flex-col gap-6">
//           {notices.map((notice) => (
//             <div key={notice._id} className="bg-blue-50 p-6 rounded-lg shadow-md relative">
//               <h3 className="text-xl font-semibold">{notice.title}</h3>
//               <p className="text-gray-700 mt-2">{notice.content}</p>
//               <p className="text-sm text-gray-600 mt-2">
//                 Issued by: {notice.issuedByAdmin
//                   ? `${notice.issuedByAdmin?.firstName || ""} ${notice.issuedByAdmin?.lastName || ""}`.trim()
//                   : notice.issuedByFaculty
//                     ? `${notice.issuedByFaculty?.firstName || ""} ${notice.issuedByFaculty?.lastName || ""}`.trim()
//                     : "Unknown"} {"    "} | {new Date(notice.createdAt).toLocaleDateString()}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Notice;
