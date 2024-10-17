const multer = require("multer");
const path = require("path");

// Set storage for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory where images will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Append the original file extension
  },
});

// Filter for allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const isValid = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isMimeTypeValid = allowedTypes.test(file.mimetype);

  if (isValid && isMimeTypeValid) {
    return cb(null, true);
  }
  cb(new Error("Unsupported file type!"), false);
};

// Initialize multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  fileFilter: fileFilter,
});

module.exports = upload;
