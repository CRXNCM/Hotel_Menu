const HotelInfo = require("../models/HotelInfo");

const DEFAULT_HOTEL = {
  about:
    "Located in front of Ethio-Italy Polytechnic in Dire Dawa, we offer comfortable rooms, dining, and guest-focused service.",
  phone: "0254113070",
  whatsapp: "0970818181",
  emergencyContact: "0254113070",
  address: "In front of Ethio-Italy Polytechnic\n\nJV35+M47, Dire Dawa, Ethiopia",
  location: "https://www.google.com/maps/search/?api=1&query=JV35%2BM47%20Dire%20Dawa%20Ethiopia",
  facilities: ["WiFi", "Gym", "Parking", "Dining"],
};

const isEmptyValue = (cur) => {
  if (cur == null) return true;
  if (typeof cur === "string") return cur.trim() === "";
  if (Array.isArray(cur)) return cur.length === 0;
  return false;
};

const mergeHotelDefaults = (doc) => {
  const o = doc && typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
  const merged = { ...o };
  for (const [key, defVal] of Object.entries(DEFAULT_HOTEL)) {
    if (isEmptyValue(merged[key])) merged[key] = defVal;
  }
  return merged;
};

const getHotelInfo = async (_req, res) => {
  let info = await HotelInfo.findOne();
  if (!info) info = await HotelInfo.create({});
  res.json(mergeHotelDefaults(info));
};

const updateHotelInfo = async (req, res) => {
  const info = await HotelInfo.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true,
    runValidators: true,
  });
  res.json(info);
};

module.exports = { getHotelInfo, updateHotelInfo };
