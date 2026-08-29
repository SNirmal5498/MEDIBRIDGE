const express = require("express");
const router = express.Router();
const {
  getMedicines,
  getPopularMedicines,
  getCategories,
  compareMedicines,
  getMedicineById,
  getAlternatives,
} = require("../controllers/medicineController");

router.get("/", getMedicines);
router.get("/popular", getPopularMedicines);
router.get("/categories", getCategories);
router.get("/compare", compareMedicines);
router.get("/:id", getMedicineById);
router.get("/:id/alternatives", getAlternatives);

module.exports = router;
