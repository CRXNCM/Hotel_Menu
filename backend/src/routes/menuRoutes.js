const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

const router = express.Router();

router.get("/", asyncHandler(getMenuItems));
router.post("/", auth, upload.single("image"), asyncHandler(createMenuItem));
router.put("/:id", auth, upload.single("image"), asyncHandler(updateMenuItem));
router.delete("/:id", auth, asyncHandler(deleteMenuItem));

module.exports = router;
