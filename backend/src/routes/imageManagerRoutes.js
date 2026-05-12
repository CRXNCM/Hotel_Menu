const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const auth = require("../middleware/authMiddleware");
const { getTempImages, renameAndMapImage } = require("../controllers/imageManagerController");

const router = express.Router();

router.get("/images", auth, asyncHandler(getTempImages));
router.post("/rename", auth, asyncHandler(renameAndMapImage));

module.exports = router;
