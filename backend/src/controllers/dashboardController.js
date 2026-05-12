const MenuItem = require("../models/MenuItem");

const getDashboardStats = async (_req, res) => {
  const [total, available, featured] = await Promise.all([
    MenuItem.countDocuments(),
    MenuItem.countDocuments({ isAvailable: true }),
    MenuItem.countDocuments({ isFeatured: true }),
  ]);

  res.json({ total, available, featured });
};

module.exports = { getDashboardStats };
