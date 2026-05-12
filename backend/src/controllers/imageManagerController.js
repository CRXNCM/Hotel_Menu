const fs = require("fs/promises");
const path = require("path");
const MenuItem = require("../models/MenuItem");

const TEMP_DIR = path.join(process.cwd(), "uploads", "temp");
const MENU_DIR = path.join(process.cwd(), "uploads", "menu");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

const ensureDirectories = async () => {
  await fs.mkdir(TEMP_DIR, { recursive: true });
  await fs.mkdir(MENU_DIR, { recursive: true });
};

const toSlug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const getUniqueFileName = async (baseName, extension) => {
  const safeBase = toSlug(baseName) || "menu-item";
  let candidate = `${safeBase}${extension}`;
  let counter = 2;

  while (await fileExists(path.join(MENU_DIR, candidate))) {
    candidate = `${safeBase}-${counter}${extension}`;
    counter += 1;
  }

  return candidate;
};

const getTempImages = async (_req, res) => {
  await ensureDirectories();
  const entries = await fs.readdir(TEMP_DIR, { withFileTypes: true });
  const images = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
      .map(async (entry) => {
        const fullPath = path.join(TEMP_DIR, entry.name);
        const stats = await fs.stat(fullPath);
        return {
          fileName: entry.name,
          path: `/uploads/temp/${entry.name}`,
          size: stats.size,
          updatedAt: stats.mtime,
        };
      })
  );

  images.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
  res.json(images);
};

const renameAndMapImage = async (req, res) => {
  await ensureDirectories();

  const { fileName, menuItemId } = req.body;
  if (!fileName || !menuItemId) {
    return res.status(400).json({ message: "fileName and menuItemId are required." });
  }

  const sourcePath = path.join(TEMP_DIR, path.basename(fileName));
  if (!(await fileExists(sourcePath))) {
    return res.status(404).json({ message: "Source image not found in temp folder." });
  }

  const menuItem = await MenuItem.findById(menuItemId);
  if (!menuItem) {
    return res.status(404).json({ message: "Menu item not found." });
  }

  const extension = path.extname(fileName).toLowerCase() || ".jpg";
  const finalFileName = await getUniqueFileName(menuItem.name, extension);
  const destinationPath = path.join(MENU_DIR, finalFileName);

  await fs.rename(sourcePath, destinationPath);
  menuItem.image = `/uploads/menu/${finalFileName}`;
  await menuItem.save();

  res.json({
    message: "Image renamed and mapped successfully.",
    imagePath: menuItem.image,
    fileName: finalFileName,
    menuItemId: menuItem._id,
  });
};

module.exports = {
  getTempImages,
  renameAndMapImage,
};
