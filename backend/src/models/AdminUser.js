const mongoose = require("mongoose");

const adminUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model("AdminUser", adminUserSchema);
