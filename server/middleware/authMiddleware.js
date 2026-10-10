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

const requirePharmacyAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  if (req.user.role === "admin") {
    return next();
  }

  if (!["pharmacy_owner", "pharmacy_staff"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Pharmacy owner or staff account required.",
    });
  }

  // Determine target pharmacy ID safely from params, query, or body
  const targetPharmacyId =
    (req.params && req.params.pharmacyId) ||
    (req.body && req.body.pharmacyId) ||
    (req.query && req.query.pharmacyId) ||
    req.user.pharmacyId;

  if (!req.user.pharmacyId || (targetPharmacyId && req.user.pharmacyId !== targetPharmacyId)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You are not authorized to access records for this pharmacy.",
    });
  }

  next();
};

const requireStaffPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    if (req.user.role === "admin" || req.user.role === "pharmacy_owner") {
      return next();
    }

    if (req.user.role === "pharmacy_staff") {
      const perms = req.user.staffPermissions || [];
      if (!perms.includes(permission)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Staff permission '${permission}' required.`,
        });
      }
      return next();
    }

    return res.status(403).json({ success: false, message: "Forbidden" });
  };
};

module.exports = {
  authMiddleware,
  requireAdmin,
  requirePharmacyAccess,
  requireStaffPermission,
};