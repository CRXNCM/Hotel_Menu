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
const port = process.env.PORT || 4000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

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
      callback(new Error("CORS origin not allowed."));
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
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: error.message || "Server error." });
});

module.exports = app;
