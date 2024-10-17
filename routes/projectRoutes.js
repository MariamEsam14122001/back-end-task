const express = require("express");
const {
  addProject,
  deleteProject,
  displayProjects,
} = require("../controllers/projectController");
const multer = require("multer");
const upload = multer({ dest: "../uploads/" });

const auth = require("../Middleware/auth");

const router = express.Router();

router.post("/add", auth, upload.none(), addProject);
router.delete("/delete/:id", auth, deleteProject);
router.get("/getAllProjects", auth, displayProjects);

module.exports = router;
