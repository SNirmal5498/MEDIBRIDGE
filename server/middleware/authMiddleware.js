const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. No Token Provided",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "medibridge_secret_key");

    // Fetch user from DB to verify user active status & role
    const userDoc = await User.findById(decoded.id || decoded._id).lean();
    if (!userDoc || userDoc.accountStatus === "suspended") {
      return res.status(401).json({
        success: false,
        message: "User account suspended or invalid",
      });
    }

    req.user = userDoc;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access forbidden. Admin role required.",
    });
  }
  next();
};

module.exports = {
  authMiddleware,
  requireAdmin,
};