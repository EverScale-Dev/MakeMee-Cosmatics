const multer = require("multer");
const path = require("path");

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads"); // Path to save uploaded images
  },
  filename: function (req, file, cb) {
    // Use the original file name with a timestamp to avoid name collisions
    const originalName = file.originalname;
    const ext = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, ext);
    const timestamp = Date.now();
    const newFileName = `${nameWithoutExt}_${timestamp}${ext}`; // Combine original name and timestamp
    cb(null, newFileName);
  },
});

// Initialize multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // ✅ Limit file size to 1MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp|avif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// ✅ Error-handling middleware for Multer
// You can use this globally or inline in your route
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "Product image size must be less than 1 MB." });
    }
  } else if (err) {
    return res.status(400).json({ message: err.message || "File upload error." });
  }
  next();
};

module.exports = { upload, handleMulterError };
