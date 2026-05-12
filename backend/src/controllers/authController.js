const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");

const login = async (req, res) => {
  const { username, password } = req.body;
  const admin = await AdminUser.findOne({ username });

  if (!admin) return res.status(401).json({ message: "Invalid credentials." });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

  const secret = process.env.JWT_SECRET || "hotel-menu-secret";
  const token = jwt.sign({ adminId: admin._id, username: admin.username }, secret, {
    expiresIn: "1d",
  });

  res.json({ token, username: admin.username });
};

module.exports = { login };
