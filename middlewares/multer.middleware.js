const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Storage config: Where to save images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/rooms";

    // Auto-create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir); // Always returns existing folder now
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "_" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

// Filter: Only allow image files
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) {
    return cb(new Error("Only image files are allowed"), false);
  }
  cb(null, true);
};

// Final Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Optional: limit to 5MB
});

module.exports = upload;
