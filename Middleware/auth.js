const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authentication = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Please authenticate." });
  }
};

module.exports = authentication;
