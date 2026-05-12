const mongoose = require("mongoose");

const hotelInfoSchema = new mongoose.Schema(
  {
    about: { type: String, default: "" },
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    location: { type: String, default: "" },
    checkIn: { type: String, default: "" },
    checkOut: { type: String, default: "" },
    facilities: { type: [String], default: [] },
    houseRules: { type: [String], default: [] },
    emergencyContact: { type: String, default: "" },
    gallery: { type: [String], default: [] },
  },
  { versionKey: false }
);

module.exports = mongoose.model("HotelInfo", hotelInfoSchema);
