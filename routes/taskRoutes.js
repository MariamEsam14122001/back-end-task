const express = require("express");
const {
  addTask,
  deleteTask,
  displayAllTasks,
  displayTask,
  getTasksByProjectName,
  UpdateTask,
  deleteAllTasks,
  // getTasksDueToday,
  getTodaysTasks,
  displayTasksByStatus,
} = require("../controllers/taskController");
const router = express.Router();
const auth = require("../Middleware/auth");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/add", auth, upload.none(), addTask);
router.delete("/delete/:id", auth, deleteTask);
router.delete("/deleteAll", auth, deleteAllTasks);
router.get("/", auth, displayAllTasks);
router.get("/:id", auth, displayTask);
router.get("/project/:projectName", auth, getTasksByProjectName);
router.put("/update/:id", auth, upload.none(), UpdateTask);
router.post("/today", auth, getTodaysTasks);
router.get("/status/:status", auth, displayTasksByStatus);

module.exports = router;
