const multer = require("multer");
const path = require("path");

// Storage config: Where to save images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/rooms");    // Must exist or be auto-created
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


