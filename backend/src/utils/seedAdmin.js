const bcrypt = require("bcrypt");
const AdminUser = require("../models/AdminUser");

const seedAdmin = async () => {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const existing = await AdminUser.findOne({ username });
  if (existing) return;

  const hashed = await bcrypt.hash(password, 10);
  await AdminUser.create({ username, password: hashed });
  console.log(`Default admin created: ${username}`);
};

module.exports = seedAdmin;
