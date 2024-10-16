const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  projectName: { type: String },
  dueDate: { type: Date },
  createDate: { type: Date, default: Date.now },
  time: { type: String },
  priority: { type: String, enum: ["critical", "low", "high"], default: "low" },
  status: {
    type: String,
    enum: ["in progress", "done", "to do"],
    default: "to do",
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});
module.exports = mongoose.model("Task", TaskSchema);
