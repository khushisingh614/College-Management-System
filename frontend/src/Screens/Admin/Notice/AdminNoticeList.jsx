// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { baseApiURL } from "../../../baseUrl";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";

// const AdminNoticeList = () => {
//   const [notices, setNotices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editNotice, setEditNotice] = useState(null); // Holds the notice being edited
//   const [editData, setEditData] = useState({ title: "", content: "" });

//   const adminId = useSelector((state) => state.userData?._id) || "";

//   useEffect(() => {
//     fetchNotices();
//   }, []);

//   const fetchNotices = () => {
//     setLoading(true);
//     axios
//       .get(`${baseApiURL()}/notice/getAllNotices/${adminId}/111111111111111111111111`)
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

//   const handleDelete = (noticeId) => {
//     if (!window.confirm("Are you sure you want to delete this notice?")) return;

//     toast.loading("Deleting Notice...");
//     axios
//       .delete(`${baseApiURL()}/notice/delete/${noticeId}`)
//       .then((response) => {
//         toast.dismiss();
//         if (response.data.success) {
//           toast.success("Notice deleted successfully");
//           setNotices(notices.filter((notice) => notice._id !== noticeId)); // Remove from UI
//         } else {
//           toast.error(response.data.message);
//         }
//       })
//       .catch((error) => {
//         toast.dismiss();
//         toast.error("Error deleting notice");
//         console.error(error);
//       });
//   };

//   const handleEdit = (notice) => {
//     setEditNotice(notice);
//     setEditData({ title: notice.title, content: notice.content });
//   };

//   const handleUpdate = () => {
//     if (!editNotice) return;

//     toast.loading("Updating Notice...");
//     axios
//       .put(`${baseApiURL()}/notice/update/${editNotice._id}`, editData)
//       .then((response) => {
//         toast.dismiss();
//         if (response.data.success) {
//           toast.success("Notice updated successfully");
//           setNotices(
//             notices.map((n) =>
//               n._id === editNotice._id ? { ...n, ...editData } : n
//             )
//           );
//           setEditNotice(null); // Close modal
//         } else {
//           toast.error(response.data.message);
//         }
//       })
//       .catch((error) => {
//         toast.dismiss();
//         toast.error("Error updating notice");
//         console.error(error);
//       });
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
//                 Issued by: {`${notice.issuedByAdmin?.firstName } ${notice.issuedByAdmin?.lastName }`|| "Unknown"} |{" "}
//                 {new Date(notice.createdAt).toLocaleDateString()}
//               </p>

//               {/* Update Button */}
//               <button
//                 onClick={() => handleEdit(notice)}
//                 className="absolute top-4 right-20 bg-yellow-500 text-white px-3 py-1 mx-8 rounded hover:bg-yellow-700"
//               >
//                 Edit
//               </button>

//               {/* Delete Button */}
//               <button
//                 onClick={() => handleDelete(notice._id)}
//                 className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Edit Notice Modal */}
//       {editNotice && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
//             <h2 className="text-xl font-semibold mb-4">Edit Notice</h2>

//             <label className="text-sm">Title</label>
//             <input
//               type="text"
//               value={editData.title}
//               onChange={(e) => setEditData({ ...editData, title: e.target.value })}
//               className="w-full bg-gray-100 rounded border py-2 px-3 mb-4"
//             />

//             <label className="text-sm">Content</label>
//             <textarea
//               rows="4"
//               value={editData.content}
//               onChange={(e) => setEditData({ ...editData, content: e.target.value })}
//               className="w-full bg-gray-100 rounded border py-2 px-3 mb-4"
//             ></textarea>

//             <div className="flex justify-between">
//               <button
//                 onClick={handleUpdate}
//                 className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
//               >
//                 Update
//               </button>
//               <button
//                 onClick={() => setEditNotice(null)}
//                 className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminNoticeList;
