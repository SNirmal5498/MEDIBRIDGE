const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  requirePharmacyAccess,
  requireStaffPermission,
} = require("../middleware/authMiddleware");

const {
  getPharmacyProfile,
  updatePharmacyProfile,
  getPharmacyInventory,
  addOrUpdateInventoryItem,
  updateStockAndPrice,
  getPharmacyOrders,
  updatePharmacyOrderStatus,
  getPharmacyPrescriptions,
  reviewPharmacyPrescription,
  submitNewMedicine,
  getPharmacyStaff,
  addPharmacyStaff,
  updateStaffPermissions,
  getInventoryAuditLogs,
} = require("../controllers/pharmacyOwnerController");

// All pharmacy owner/staff routes require authenticated user
router.use(authMiddleware, requirePharmacyAccess);

// Profile
router.get("/profile", getPharmacyProfile);
router.put("/profile", updatePharmacyProfile);

// Inventory
router.get("/inventory", requireStaffPermission("inventory_read"), getPharmacyInventory);
router.post("/inventory", requireStaffPermission("inventory_write"), addOrUpdateInventoryItem);
router.patch("/inventory/adjust", requireStaffPermission("inventory_write"), updateStockAndPrice);
router.get("/inventory/audit-logs", requireStaffPermission("inventory_read"), getInventoryAuditLogs);

// Orders
router.get("/orders", requireStaffPermission("orders_read"), getPharmacyOrders);
router.patch("/orders/:id/status", requireStaffPermission("orders_update"), updatePharmacyOrderStatus);

// Prescriptions
router.get("/prescriptions", requireStaffPermission("prescriptions_read"), getPharmacyPrescriptions);
router.patch("/prescriptions/:id/review", requireStaffPermission("prescriptions_review"), reviewPharmacyPrescription);

// Catalog Medicine Submissions
router.post("/catalog-submissions", submitNewMedicine);

// Owner-only middleware for staff management
const requireOwnerOnly = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "pharmacy_owner")) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access denied. Only pharmacy owners can manage staff.",
  });
};

// Staff Management (Owner only)
router.get("/staff", requireOwnerOnly, getPharmacyStaff);
router.post("/staff", requireOwnerOnly, addPharmacyStaff);
router.patch("/staff/:staffId", requireOwnerOnly, updateStaffPermissions);

module.exports = router;
