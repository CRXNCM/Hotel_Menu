const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const token = header.split(" ")[1];
  try {
    const secret = process.env.JWT_SECRET || "hotel-menu-secret";
    req.admin = jwt.verify(token, secret);
    next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
