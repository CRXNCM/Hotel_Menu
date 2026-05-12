const HotelInfo = require("../models/HotelInfo");

const getHotelInfo = async (_req, res) => {
  let info = await HotelInfo.findOne();
  if (!info) info = await HotelInfo.create({});
  res.json(info);
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
