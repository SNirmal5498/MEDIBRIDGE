const express = require("express");
const router = express.Router();
const {
  getPharmacies,
  getPharmacyById,
  getPharmacyInventory,
  getMedicineAvailability,
} = require("../controllers/pharmacyController");

router.get("/", getPharmacies);
router.get("/availability/:medicineId", getMedicineAvailability);
router.get("/:id", getPharmacyById);
router.get("/:id/inventory", getPharmacyInventory);

module.exports = router;
