const MenuItem = require("../models/MenuItem");
const { augmentMenuItemsWithLocalImages } = require("../utils/menuItemImageResolver");

const getMenuItems = async (req, res) => {
  const { category, search, tags, isFeatured, isAvailable } = req.query;
  const query = {};

  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: "i" };
  if (typeof isFeatured !== "undefined") query.isFeatured = isFeatured === "true";
  if (typeof isAvailable !== "undefined") query.isAvailable = isAvailable === "true";
  if (tags) {
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    if (tagsArray.length) query.tags = { $all: tagsArray };
  }

  const items = await MenuItem.find(query).sort({ createdAt: -1 }).lean();
  const withImages = await augmentMenuItemsWithLocalImages(items);
  res.json(withImages);
};

const createMenuItem = async (req, res) => {
  const payload = {
    ...req.body,
    image: req.file ? `/uploads/${req.file.filename}` : req.body.image || "",
  };
  const item = await MenuItem.create(payload);
  res.status(201).json(item);
};

const updateMenuItem = async (req, res) => {
  const payload = { ...req.body };
  if (req.file) payload.image = `/uploads/${req.file.filename}`;

  const updated = await MenuItem.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updated) return res.status(404).json({ message: "Menu item not found." });
  res.json(updated);
};

const deleteMenuItem = async (req, res) => {
  const deleted = await MenuItem.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Menu item not found." });
  res.json({ message: "Menu item deleted." });
};

module.exports = {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
