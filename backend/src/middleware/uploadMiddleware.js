const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsRoot = process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads");
const menuUploads = path.join(uploadsRoot, "menu");
const tempUploads = path.join(uploadsRoot, "temp");

[uploadsRoot, menuUploads, tempUploads].forEach((dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsRoot),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) return cb(null, true);
  cb(new Error("Only image uploads are allowed."));
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
