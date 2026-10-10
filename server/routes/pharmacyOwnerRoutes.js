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

// Staff Management (Owner only)
router.get("/staff", getPharmacyStaff);
router.post("/staff", addPharmacyStaff);
router.patch("/staff/:staffId", updateStaffPermissions);

module.exports = router;
