require("dotenv").config();

const fs = require("fs");
const path = require("path");
const connectDB = require("../config/db");
const MenuItem = require("../models/MenuItem");
const Category = require("../models/Category");

const toTitleCase = (value) =>
  value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const normalizeCategory = (rawCategory) => {
  const cleaned = String(rawCategory || "").trim();
  if (!cleaned) return "Others";
  return cleaned
    .split("/")
    .map((part) => toTitleCase(part))
    .join("/");
};

const parsePrice = (rawPrice) => {
  const cleaned = String(rawPrice || "").trim().replace(/[^0-9.]/g, "");
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
};

const parseItemsFile = (filePath) => {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split(/\r?\n/).slice(1).filter(Boolean);
  const items = [];

  for (const line of lines) {
    const cols = line.split("\t");
    if (cols.length < 4) continue;

    const name = String(cols[1] || "").trim();
    const category = normalizeCategory(cols[2]);
    const price = parsePrice(cols[3]);

    if (!name || price === null) continue;

    items.push({
      name,
      category,
      price,
      description: `${name} from ${category}`,
      image: "",
      tags: [],
      ingredients: [],
      allergens: [],
      spiceLevel: 0,
      isFeatured: false,
      isAvailable: true,
    });
  }

  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.name}__${item.category}__${item.price}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const seed = async () => {
  const itemsPath = path.resolve(__dirname, "../../../items");
  if (!fs.existsSync(itemsPath)) {
    throw new Error(`Items file not found at: ${itemsPath}`);
  }

  await connectDB();
  const menuItems = parseItemsFile(itemsPath);
  const categoryNames = [...new Set(menuItems.map((item) => item.category))].sort((a, b) =>
    a.localeCompare(b)
  );

  await MenuItem.deleteMany({});
  await Category.deleteMany({});

  if (menuItems.length) {
    await MenuItem.insertMany(menuItems);
  }

  const categoryDocs = categoryNames.map((name, index) => ({ name, order: index + 1 }));
  if (categoryDocs.length) {
    await Category.insertMany(categoryDocs);
  }

  console.log(`Seed completed: ${menuItems.length} menu items, ${categoryDocs.length} categories.`);
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
