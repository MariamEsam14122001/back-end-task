const express = require("express");
const {
  signup,
  login,
  displayUserInfo,
} = require("../controllers/userController");
const upload = require("../Middleware/upload");

const auth = require("../Middleware/auth");
const router = express.Router();

router.post("/signup", upload.single("image"), signup);
router.post("/login", upload.none(), login);
router.get("/displayUserInfo/:id", auth, displayUserInfo);

module.exports = router;
