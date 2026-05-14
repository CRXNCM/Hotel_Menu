const fs = require("fs/promises");
const path = require("path");

const uploadsRoot = process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads");
const MENU_DIR = path.join(uploadsRoot, "menu");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const toSlug = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

/** Safe base filename from menu item title (matches "same name as item" files with spaces etc.) */
const sanitizeFileBase = (name) =>
  String(name || "")
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f]+/g, "")
    .trim();

const pathFromStoredImage = (stored) => {
  if (!stored || typeof stored !== "string") return null;
  let clean = stored.replace(/^\/+/, "");
  if (clean.startsWith("uploads/")) clean = clean.slice("uploads/".length);
  return path.join(uploadsRoot, ...clean.split("/"));
};

let basenameIndexCache = null;
let basenameIndexCacheAt = 0;
const CACHE_MS = 8000;

const buildBasenameIndex = (filenames) => {
  const index = new Map();
  for (const fullName of filenames) {
    const base = path.parse(fullName).name.toLowerCase();
    if (!index.has(base)) index.set(base, fullName);
  }
  return index;
};

async function getMenuBasenameIndex() {
  const now = Date.now();
  if (basenameIndexCache && now - basenameIndexCacheAt < CACHE_MS) return basenameIndexCache;

  await fs.mkdir(MENU_DIR, { recursive: true });
  const entries = await fs.readdir(MENU_DIR, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && IMAGE_EXTENSIONS.has(path.extname(e.name).toLowerCase()))
    .map((e) => e.name);

  basenameIndexCache = buildBasenameIndex(files);
  basenameIndexCacheAt = now;
  return basenameIndexCache;
};

const lookupByItemName = (itemName, basenameIndex) => {
  const sanitized = sanitizeFileBase(itemName);
  const slug = toSlug(itemName);
  const keys = [...new Set([sanitized, slug].filter(Boolean).map((k) => k.toLowerCase()))];
  for (const key of keys) {
    const file = basenameIndex.get(key);
    if (file) return `/uploads/menu/${file}`;
  }
  return "";
};

/**
 * For each menu item: keep stored image if file exists; otherwise use a file in uploads/menu
 * whose basename (without extension) matches the item name (sanitized) or slug form.
 */
async function augmentMenuItemsWithLocalImages(items) {
  if (!items?.length) return items || [];
  const basenameIndex = await getMenuBasenameIndex();

  return Promise.all(
    items.map(async (item) => {
      const stored = item.image;
      if (stored) {
        const abs = pathFromStoredImage(stored);
        if (abs && (await fileExists(abs))) {
          return { ...item, image: stored.startsWith("/") ? stored : `/${stored}` };
        }
      }
      const resolved = lookupByItemName(item.name, basenameIndex);
      if (resolved) return { ...item, image: resolved };
      return { ...item, image: stored || "" };
    })
  );
}

module.exports = {
  augmentMenuItemsWithLocalImages,
  MENU_DIR,
  toSlug,
  sanitizeFileBase,
};
