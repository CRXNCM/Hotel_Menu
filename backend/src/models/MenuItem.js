const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
    category: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    ingredients: { type: [String], default: [] },
    allergens: { type: [String], default: [] },
    spiceLevel: { type: Number, min: 0, max: 5, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
