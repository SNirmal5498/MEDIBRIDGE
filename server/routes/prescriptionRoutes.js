const express = require("express");
const router = express.Router();
const { authMiddleware, requireAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  uploadPrescription,
  getMyPrescriptions,
  getPrescriptionFile,
  reviewPrescription,
} = require("../controllers/prescriptionController");

router.post("/upload", authMiddleware, upload.single("prescription"), uploadPrescription);
router.get("/my", authMiddleware, getMyPrescriptions);
router.get("/:id/file", authMiddleware, getPrescriptionFile);
router.patch("/:id/review", authMiddleware, requireAdmin, reviewPrescription);

module.exports = router;
