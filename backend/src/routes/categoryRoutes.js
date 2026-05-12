const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const auth = require("../middleware/authMiddleware");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.get("/", asyncHandler(getCategories));
router.post("/", auth, asyncHandler(createCategory));
router.put("/:id", auth, asyncHandler(updateCategory));
router.delete("/:id", auth, asyncHandler(deleteCategory));

module.exports = router;
