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
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <Heading title="To-Do List" />
      <div className="mt-8 w-full flex flex-col items-center">
        <div className="flex w-[40%] mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a new task..."
            className="px-3 py-3 bg-blue-50 text-base rounded-l-md w-full border"
          />
          <button
            onClick={addTask}
            className="bg-indigo-500 text-white px-4 text-xl rounded-r-md"
          >
            <HiOutlinePlus />
          </button>
        </div>

        <div className="w-full max-w-xl mx-auto">
          {tasks.length > 0 ? (
            tasks
              .slice()
              .reverse()
              .map((task) => (
                <div
                  key={task._id}
                  className={`border-2 w-full rounded-md shadow-sm py-2 px-4 relative mb-3 ${
                    task.completed ? "border-green-500" : "border-blue-500"
                  }`}
                >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task._id)}
                    className="w-5 h-5 accent-green-600 cursor-pointer"
                  />
                  {editTaskId === task._id ? (
                    <>
                    <input
                        type="text"
                        value={editInput}
                        onChange={(e) => setEditInput(e.target.value)}
                        className="border px-2 py-1 rounded w-full max-w-xs"
                    />
                    <button
                        onClick={() => updateTask(task._id)}
                        className="text-green-600 text-sm font-semibold ml-2"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => {
                        setEditTaskId(null);
                        setEditInput("");
                        }}
                        className="text-gray-500 text-sm ml-2"
                    >
                        Cancel
                    </button>
                    </>
                ) : (
                    <>
                    <p
                        className={`text-base font-medium ${
                        task.completed ? "line-through text-gray-500" : ""
                        }`}
                    >
                        {task.task}
                    </p>
                    <button
                        onClick={() => {
                        setEditTaskId(task._id);
                        setEditInput(task.task);
                        }}
                        className="absolute top-2 right-10 text-blue-500 hover:text-blue-700"
                    >
                        <HiOutlinePencil className="text-2xl" />
                    </button>
                    </>
                )}
                </div>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <HiOutlineTrash  className="text-2xl"/>
                  </button>
                </div>
              ))
          ) : (
            <p className="text-center">No tasks added yet!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;