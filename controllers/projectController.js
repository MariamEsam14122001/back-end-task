const Project = require("../models/Project");

//add project

const addProject = async (req, res) => {
  try {
    console.log(req.body);
    const { name } = req.body;
    const userId = req.user._id;
    if (!name) {
      return res.status(400).json({ message: "Please enter project name" });
    }
    const newProject = new Project({
      name,
      tasks: [],
      userId,
    });
    await newProject.save();
    res.status(201).json({ message: "Project added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding project", error });
  }
};

//delete project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const deletedProject = await Project.findByIdAndDelete({ _id: id, userId });
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error });
  }
};

//display projects
const displayProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    const projects = await Project.find({ userId });

    if (projects.length === 0) {
      return res.status(404).json({ message: "No projects found" });
    }
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error displaying projects", error });
  }
};

module.exports = { displayProjects, deleteProject, addProject };
