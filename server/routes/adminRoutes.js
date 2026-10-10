const express = require("express");
const router = express.Router();
const { authMiddleware, requireAdmin } = require("../middleware/authMiddleware");
const {
  getOverviewStats,
  getUsers,
  updateUserStatus,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getPharmacies,
  addPharmacy,
  updatePharmacy,
  deletePharmacy,
  getInventory,
  updateInventory,
  getAllOrders,
  updateOrderStatus,
  getAllPrescriptions,
  getReviews,
  moderateReview,
  getAnalytics,
  getSettings,
  updateSettings,
  getAuditLogs,
  getSystemHealth,
  reviewPharmacyApplication,
  getCatalogSubmissions,
  reviewCatalogSubmission,
} = require("../controllers/adminController");

// All admin routes require authenticated user with role == 'admin'
router.use(authMiddleware, requireAdmin);

router.get("/overview", getOverviewStats);
router.get("/users", getUsers);
router.patch("/users/:id/status", updateUserStatus);

router.post("/medicines", addMedicine);
router.put("/medicines/:id", updateMedicine);
router.delete("/medicines/:id", deleteMedicine);

router.get("/pharmacies", getPharmacies);
router.post("/pharmacies", addPharmacy);
router.put("/pharmacies/:id", updatePharmacy);
router.delete("/pharmacies/:id", deletePharmacy);
router.patch("/pharmacies/:id/application", reviewPharmacyApplication);

router.get("/catalog-submissions", getCatalogSubmissions);
router.patch("/catalog-submissions/:id/review", reviewCatalogSubmission);

router.get("/inventory", getInventory);
router.post("/inventory", updateInventory);

router.get("/orders", getAllOrders);
router.patch("/orders/:id/status", updateOrderStatus);

router.get("/prescriptions", getAllPrescriptions);

router.get("/reviews", getReviews);
router.patch("/reviews/:id", moderateReview);

router.get("/analytics", getAnalytics);
router.get("/settings", getSettings);
router.put("/settings", updateSettings);
router.get("/audit-logs", getAuditLogs);
router.get("/system-health", getSystemHealth);

module.exports = router;
