const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const auth = require("../middleware/authMiddleware");
const { getHotelInfo, updateHotelInfo } = require("../controllers/hotelController");

const router = express.Router();

router.get("/", asyncHandler(getHotelInfo));
router.put("/", auth, asyncHandler(updateHotelInfo));

module.exports = router;
