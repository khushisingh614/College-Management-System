import React, { useState, useEffect } from "react";
import Heading from "../../components/Heading";
import { HiOutlinePlus, HiOutlineTrash,HiOutlinePencil  } from "react-icons/hi";
import axios from "axios";
import toast from "react-hot-toast";
import { baseApiURL } from "../../baseUrl";

const TodoList = (prop) => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const [editTaskId, setEditTaskId] = useState(null);
  const [editInput, setEditInput] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);


  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${baseApiURL()}/todo/getTasks?studentId=${prop.studentid}`);
      if (res.data.success) setTasks(res.data.tasks);
    } catch (err) {
      toast.error("Failed to load tasks");
    }
  };

  const updateTask = async (id) => {
      try {
          const res = await axios.patch(`${baseApiURL()}/todo/updateTask/${id}`, {
              task: editInput,
        });
      if (res.data.success) {
        toast.success("Task updated!");
        setEditTaskId(null);
        setEditInput("");
        fetchTasks();
      }
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const addTask = async () => {
    if (!input.trim()) return;
    try {
      const res = await axios.post(`${baseApiURL()}/todo/addTask`, {
        task: input.trim(),
        studentId: prop.studentid,
      });
      if (res.data.success) {
        toast.success("Task added!");
        setInput("");
        fetchTasks();
      }
    } catch (err) {
      toast.error("Failed to add task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${baseApiURL()}/todo/deleteTask/${id}`);
      fetchTasks();
    } catch (err) {
      toast.error("Error deleting task");
    }
  };

  const toggleComplete = async (id) => {
    try {
      await axios.patch(`${baseApiURL()}/todo/toggleTask/${id}`);
      fetchTasks();
    } catch (err) {
      toast.error("Couldn't update task status");
    }
  };

  return (
    <div className="w-full mx-auto my-12 bg-white rounded-lg shadow-lg px-10 py-12">
  <Heading title="To-Do List" />

  <div className="mt-10 w-full flex flex-col items-center">
    <div className="flex w-full max-w-lg mb-8">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a new task..."
        className="px-4 py-3 bg-blue-50 text-base border border-blue-200 focus:ring-2 focus:ring-indigo-300 outline-none rounded-l-lg w-full"
      />
      <button
        onClick={addTask}
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 text-xl rounded-r-lg transition-all duration-200"
      >
        <HiOutlinePlus />
      </button>
    </div>

    <div className="w-full max-w-xl mx-auto space-y-4">
      {tasks.length > 0 ? (
        tasks
          .slice()
          .reverse()
          .map((task) => (
            <div
              key={task._id}
              className={`border-2 w-full rounded-xl shadow-md px-5 py-4 relative transition-all ${
                task.completed
                  ? "border-green-400 bg-green-50"
                  : "border-indigo-400 bg-white"
              }`}
            >
              <div className="flex items-start sm:items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task._id)}
                  className="w-5 h-5 accent-green-600 cursor-pointer mt-1"
                />
                {editTaskId === task._id ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                    <input
                      type="text"
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      className="border border-gray-300 px-3 py-2 rounded-md w-full sm:max-w-sm outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateTask(task._id)}
                        className="text-green-600 hover:text-green-800 font-semibold text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditTaskId(null);
                          setEditInput("");
                        }}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start sm:items-center w-full">
                    <p
                      className={`text-base font-medium break-words ${
                        task.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.task}
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setEditTaskId(task._id);
                          setEditInput(task.task);
                        }}
                        className="text-indigo-500 hover:text-indigo-700"
                      >
                        <HiOutlinePencil className="text-xl" />
                      </button>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <HiOutlineTrash className="text-xl" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
      ) : (
        <p className="text-center text-gray-500">No tasks added yet!</p>
      )}
    </div>
  </div>
</div>
  );
};

export default TodoList;