const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const auth = require("../middleware/authMiddleware");
const { getDashboardStats } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/stats", auth, asyncHandler(getDashboardStats));

module.exports = router;
