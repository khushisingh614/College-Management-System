const express = require("express");
const router = express.Router();
const {
  getTasks,
  addTask,
  deleteTask,
  toggleTask,
  updateTask,
} = require("../../controllers/Other/todolist.controller.js");

// Routes for Todo
router.get("/getTasks", getTasks);
router.post("/addTask", addTask);
router.delete("/deleteTask/:id", deleteTask);
router.patch("/toggleTask/:id", toggleTask);
router.patch("/updateTask/:id", updateTask);

module.exports = router;