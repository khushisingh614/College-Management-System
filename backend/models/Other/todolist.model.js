const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    task: { type: String, required: true },
    completed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("TodoList", TodoSchema);