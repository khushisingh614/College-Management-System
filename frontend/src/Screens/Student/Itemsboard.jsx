import React, { useState, useEffect } from "react";
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil } from "react-icons/hi";
import Heading from "../../components/Heading";
import axios from "axios";
import toast from "react-hot-toast";
import { baseApiURL } from "../../baseUrl";

const StudentItemsBoard = ({ studentid }) => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("lost");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    mobilenumber: "",
    image: null,
  });

  const [editItemId, setEditItemId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const fetchItems = async () => {  
    try {
      const res = await axios.get(`${baseApiURL()}/itemsboard/getItemsByType?type=${activeTab}`);
      if (res.data.success) {
        setItems(res.data.items);
      }
    } catch (err) {
      toast.error("Failed to load items");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleAddItem = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("location", formData.location);
    payload.append("mobilenumber", formData.mobilenumber);
    payload.append("itemType", activeTab);
    payload.append("studentId", studentid);
    payload.append("type", "itemsboard"); 
    if (formData.image) payload.append("itemsboard", formData.image);

    try {
      const res = await axios.post(`${baseApiURL()}/itemsboard/addItem`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        toast.success("Item added!");
        setFormData({ title: "", description: "", location: "", mobilenumber: "",image: null });
        fetchItems();
      }
    } catch (err) {
      toast.error("Failed to add item");
    }
  };

  const startEdit = (item) => {
    setEditItemId(item._id);
    setEditData({
      title: item.title,
      description: item.description,
      location: item.location,
    });
  };

  const handleUpdate = async (id) => {
    try {
      const res = await axios.patch(`${baseApiURL()}/itemsboard/updateItem/${id}`, editData);
      if (res.data.success) {
        toast.success("Item updated!");
        setEditItemId(null);
        setEditData({});
        fetchItems();
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${baseApiURL()}/itemsboard/deleteItem/${id}`);
      toast.success("Item deleted");
      fetchItems();
    } catch (err) {
      toast.error("Error deleting item");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 flex flex-col items-center mb-10">
  <Heading title="Lost & Found / Marketplace" />
  
  {/* Tabs */}
  <div className="flex justify-center space-x-4 my-6">
    {["lost", "found", "marketplace"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-2 rounded-md capitalize ${
          activeTab === tab ? "bg-indigo-600 text-white" : "bg-gray-100"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>

  {/* Add Item Form */}
  <div className="bg-blue-50 p-4 rounded-md shadow w-full max-w-2xl space-y-4">
    <input
      type="text"
      placeholder="Title"
      value={formData.title}
      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      className="w-full px-3 py-2 border rounded"
    />
    <textarea
      placeholder="Description"
      value={formData.description}
      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      className="w-full px-3 py-2 border rounded"
    />
    <input
      type="text"
      placeholder="Location"
      value={formData.location}
      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
      className="w-full px-3 py-2 border rounded"
    />
    <input
      type="text"
      placeholder="Mobile Number"
      value={formData.mobilenumber}
      onChange={(e) => setFormData({ ...formData, mobilenumber: e.target.value })}
      className="w-full px-3 py-2 border rounded"
    />
    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      className="w-full"
    />
    <button
      onClick={handleAddItem}
      className="bg-indigo-600 text-white px-4 py-2 rounded-md w-full flex items-center justify-center gap-2"
    >
      <HiOutlinePlus className="text-lg" />
      Add Item
    </button>
  </div>

  {/* Items List */}
  <div className="w-full max-w-3xl mt-6">
    {items.length > 0 ? (
      items
        .slice()
        .reverse()
        .map((item) => (
          <div
            key={item._id}
            className="border rounded-md shadow-sm py-3 px-4 relative mb-4"
          >
            <div className="flex items-start gap-3">
              {item.imageUrl && (
                <img
                  src={process.env.REACT_APP_MEDIA_LINK + "/" + item.imageUrl}
                  alt="item"
                  className="w-20 h-20 object-cover rounded-md"
                />
              )}
              <div className="flex-1">
                {editItemId === item._id ? (
                  <>
                    <input
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="w-full border rounded px-2 py-1 mb-2"
                    />
                    <textarea
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({ ...editData, description: e.target.value })
                      }
                      className="w-full border rounded px-2 py-1 mb-2"
                    />
                    <input
                      value={editData.location}
                      onChange={(e) =>
                        setEditData({ ...editData, location: e.target.value })
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                    <div className="mt-2 flex gap-3">
                      <button
                        onClick={() => handleUpdate(item._id)}
                        className="text-green-600 font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditItemId(null);
                          setEditData({});
                        }}
                        className="text-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-700">{item.description}</p>
                    <p className="text-xs text-gray-400">Location: {item.location}</p>
                    <p className="text-xs text-gray-400">Mobile: {item.mobilenumber}</p>
                  </>
                )}
              </div>
              {item.studentId === studentid && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <button onClick={() => startEdit(item)} className="text-blue-500">
                    <HiOutlinePencil className="text-xl" />
                  </button>
                  <button onClick={() => deleteItem(item._id)} className="text-red-500">
                    <HiOutlineTrash className="text-xl" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
    ) : (
      <p className="text-center text-gray-500">No items listed in this section.</p>
    )}
  </div>
</div>
  )
};

export default StudentItemsBoard;