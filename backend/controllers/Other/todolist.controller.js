const Todo = require("../../models/Other/todolist.model");

// Get tasks for a specific student
const getTasks = async (req, res) => {
    const { studentId } = req.query;

    if (!studentId) {
        return res.status(400).json({ success: false, message: "Student ID is required" });
    }

    try {
        const tasks = await Todo.find({ studentId }).sort({ createdAt: -1 });
        res.json({ success: true, tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Add a task for a student
const addTask = async (req, res) => {
    const { task, studentId } = req.body;

    if (!task || !studentId) {
        return res.status(400).json({ success: false, message: "Task and Student ID are required" });
    }

    try {
        const newTask = new Todo({ task, studentId });
        await newTask.save();
        res.json({ success: true, message: "Task added!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Delete a task by ID
const deleteTask = async (req, res) => {
    try {
        const task = await Todo.findById(req.params.id);
        if (!task) {
        return res.status(404).json({ success: false, message: "Task not found" });
        }

        await task.deleteOne();
        res.json({ success: true, message: "Task deleted!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Toggle task completion
const toggleTask = async (req, res) => {
    try {
        const task = await Todo.findById(req.params.id);
        if (!task) {
        return res.status(404).json({ success: false, message: "Task not found" });
        }

        task.completed = !task.completed;
        await task.save();
        res.json({ success: true, message: "Task status updated!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update task content
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { task } = req.body;

  if (!task || !task.trim()) {
    return res.status(400).json({ success: false, message: "Task cannot be empty" });
  }

  try {
    const updated = await Todo.findByIdAndUpdate(
      id,
      { task: task.trim() }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, task: updated });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
    getTasks,
    addTask,
    deleteTask,
    toggleTask,
    updateTask,
};