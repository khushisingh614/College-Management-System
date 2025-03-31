// import React, { useState } from "react";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { baseApiURL } from "../../../baseUrl";

// const AddNotice = () => {
//   const adminId = useSelector((state) => state.userData._id);
//   const [data, setData] = useState({
//     title: "",
//     content: "",
//   });

//   const addNotice = (e) => {
//     e.preventDefault();
//     toast.loading("Adding Notice");

//     axios
//       .post(`${baseApiURL()}/notice/add`, { ...data, issuedByAdmin: adminId })
//       .then((response) => {
//         toast.dismiss();
//         if (response.data.success) {
//           toast.success(response.data.message);
//           setData({ title: "", content: "" });
//         } else {
//           toast.error(response.data.message);
//         }
//       })
//       .catch((error) => {
//         toast.dismiss();
//         toast.error(error.response?.data?.message || "Error adding notice");
//       });
//   };

//   return (
//     <form
//       onSubmit={addNotice}
//       className="w-[70%] flex flex-col justify-center items-center gap-6 mx-auto mt-10"
//     >
//       <div className="w-full">
//         <label className="leading-7 text-sm">Notice Title</label>
//         <input
//           type="text"
//           value={data.title}
//           onChange={(e) => setData({ ...data, title: e.target.value })}
//           className="w-full bg-blue-50 rounded border focus:ring-2 focus:ring-light-green py-2 px-3"
//         />
//       </div>

//       <div className="w-full">
//         <label className="leading-7 text-sm">Notice Content</label>
//         <textarea
//           rows="5"
//           value={data.content}
//           onChange={(e) => setData({ ...data, content: e.target.value })}
//           className="w-full bg-blue-50 rounded border focus:ring-2 focus:ring-light-green py-2 px-3"
//         ></textarea>
//       </div>

//       <button type="submit" className="bg-blue-500 px-6 py-3 rounded-sm text-white">
//         Add Notice
//       </button>
//     </form>
//   );
// };

// export default AddNotice;
