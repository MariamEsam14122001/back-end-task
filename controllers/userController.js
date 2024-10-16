const User = require("../models/User");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
});

const signup = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    console.log("Uploaded file:", req.file);

    // Check for missing fields
    if (!name || !password || !email) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Check if file was uploaded and get the path, or set to null
    const imagePath = req.file ? req.file.path : null;

    // Create new user
    const newUser = new User({
      name,
      password: hashedPassword,
      email,
      image: imagePath,
    });
    await newUser.save();

    // Success response
    res.status(201).json({
      message: "User created successfully.",
      user: { name, email, image: imagePath },
    });
  } catch (error) {
    console.error("Error during signup:", error); // Additional logging
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// Log in
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });
    res.status(200).json({
      message: "User logged in successfully",
      user: { name: user.name, email: user.email, image: user.image },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user", error: error.message });
  }
};

// Display user info
const displayUserInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res
      .status(200)
      .json({ message: "User info displayed successfully.", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error displaying user info", error: error.message });
  }
};
module.exports = { signup, login, upload, displayUserInfo };
