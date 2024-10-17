const Task = require("../models/Task");
const mongoose = require("mongoose");

//add Task
const addTask = async (req, res) => {
  try {
    const { name, projectName, dueDate, time, priority, status } = req.body;
    const userId = req.user._id;
    // Convert dueDate to a Date object
    const dueDateObj = dueDate ? new Date(dueDate) : null;

    // Check if dueDate is valid
    if (dueDate && isNaN(dueDateObj.getTime())) {
      return res.status(400).json({ message: "Invalid due date format." });
    }
    const newTask = new Task({
      name,
      projectName,
      dueDate: dueDateObj,
      time,
      priority,
      status,
      userId,
    });
    await newTask.save();
    res.status(201).json({ message: "Task added successfully", task: newTask });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding task", error: error.message });
  }
};

//delete Task

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const deletedTask = await Task.findByIdAndDelete({
      _id: id,
      userId: userId,
    });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res
      .status(200)
      .json({ message: "Task deleted successfully", task: deletedTask });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting task", error: error.message });
  }
};

//delete all tasks
const deleteAllTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await Task.deleteMany({ userId: userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }
    res.status(200).json({ message: "All tasks deleted successfully", result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting all tasks", error: error.message });
  }
};

//display all tasks
const displayAllTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await Task.find({ userId });

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }
    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
};

//display 1 task
const displayTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const task = await Task.findById({ _id: id, userId: userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching task", error: error.message });
  }
};

//filtered tasks
const displayTasksByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const userId = req.user._id;
    const tasks = await Task.find({ status, userId });
    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }
    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
};

//get tasks by projectname
const getTasksByProjectName = async (req, res) => {
  try {
    const { projectName } = req.params;
    const userId = req.user._id;
    const tasks = await Task.find({ projectName, userId });

    if (!tasks.length) {
      return res
        .status(404)
        .json({ message: "No tasks found for this project" });
    }
    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
};

//update task

const UpdateTask = async (req, res) => {
  try {
    // Ensure id is a string
    const { id } = req.params;

    // Validate that the id is a valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID format." });
    }

    const { name, projectName, dueDate, time, priority, status } = req.body;
    const userId = req.user._id;

    // Use findOneAndUpdate instead of findByIdAndUpdate
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId }, // Ensure userId is also used in the query
      { name, projectName, dueDate, time, priority, status },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthenticated" });
    }

    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({
      message: "Error updating task or unauthenticated",
      error: error.message,
    });
  }
};

//display tasks that are due date today's date and are not done and in time order and add an order numbers 1 , 2 , 3 , ... and return it and send it to the front
const getTodaysTasks = async (req, res) => {
  try {
    // Get the date from the request body
    const { date } = req.body;

    // Parse the date to set the start and end of the day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Assuming userId is available from authenticated user
    // const userId = req.user._id;

    // Query for tasks due on the specified date
    const todaysTasks = await Task.find({
      // userId: userId,
      dueDate: { $gte: startOfDay, $lte: endOfDay },
    });

    res.status(200).json({
      success: true,
      data: todaysTasks,
      dateReceived: date, // Optional: return the date received for confirmation
    });
  } catch (error) {
    console.error("Error fetching today's tasks:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

// const getTodaysTasks = async (req, res) => {
//   try {
//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0);

//     const endOfDay = new Date();
//     endOfDay.setHours(23, 59, 59, 999);

//     const userId = mongoose.Types.ObjectId(req.user._id);

//     const todaysTasks = await Task.find({
//        userId,
//       dueDate: { $gte: startOfDay, $lte: endOfDay }
//     });

//     res.status(200).json({
//       success: true,
//       data: todaysTasks
//     });
//   } catch (error) {
//     console.error("Error fetching today's tasks:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching task",
//       error: error.message
//     });
//   }
// };

// const moment = require("moment");

// const getTasksDueToday = async (req, res) => {
//   try {
//     const today = moment().startOf("day").toDate(); // Get the start of the current day
//     const userId = req.user._id;

//     console.log("Fetching tasks for userId:", userId);

//     const tasks = await Task.find({
//       userId: userId,
//       dueDate: {
//         $gte: today,
//         $lt: moment(today).add(1, "days").toDate(),
//       },
//       status: { $ne: "done" },
//     }).sort({ time: 1 });

//     if (tasks.length === 0) {
//       return res.status(404).json({ message: "No tasks found for today" });
//     }

//     const orderedTasks = tasks.map((task, index) => ({
//       orderedNumber: index + 1,
//       ...task._doc,
//     }));

//     res.status(200).json(orderedTasks);
//   } catch (error) {
//     console.error("Error fetching tasks:", error);
//     res
//       .status(500)
//       .json({ message: "Error fetching tasks", error: error.message });
//   }
// };

module.exports = {
  // getTasksDueToday,
  getTodaysTasks,
  UpdateTask,
  getTasksByProjectName,
  displayTasksByStatus,
  displayTask,
  displayAllTasks,
  deleteTask,
  deleteAllTasks,
  addTask,
};
