const express = require("express");
const cors = require("cors");
const path = require("path");

const menuRoutes = require("./routes/menuRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const imageManagerRoutes = require("./routes/imageManagerRoutes");

const app = express();
const uploadsRoot = process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads");

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || !allowedOrigins.length || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS: origin "${origin}" is not in CORS_ORIGIN. Add it in Render (exact URL, e.g. https://your-app.vercel.app).`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsRoot));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/menu", menuRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/hotel", hotelRoutes);
app.use("/api", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/image-manager", imageManagerRoutes);

app.use((error, _req, res, _next) => {
  if (error.message && String(error.message).startsWith("CORS:")) {
    res.status(403).json({ message: error.message });
    return;
  }
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: error.message || "Server error." });
});

module.exports = app;
