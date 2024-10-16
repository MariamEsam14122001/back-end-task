const express = require("express");
const {
  signup,
  login,
  upload,
  displayUserInfo,
} = require("../controllers/userController");

console.log({ signup, login, upload, displayUserInfo });
const auth = require("../Middleware");
const router = express.Router();

// router.post("/signup", upload.single("image"), signup);
// router.post("/signup", signup);
router.post("/signup", upload.none(), signup);
router.post("/login", upload.none(), login);
router.get("/displayUserInfo/:id", auth, displayUserInfo);

module.exports = router;
