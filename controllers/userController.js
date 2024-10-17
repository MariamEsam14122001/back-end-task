const User = require("../models/User");
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const image = req.file ? req.file.path : null; // Get the image path from multer

  // Input validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      image, // Store the image path in the database
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success
    res
      .status(201)
      .json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user." });
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
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    res.status(200).json({
      message: "User logged in successfully",
      user: { name: user.name, email: user.email, image: user.image },
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging in user", error: error.message });
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
module.exports = { signup, login, displayUserInfo };
