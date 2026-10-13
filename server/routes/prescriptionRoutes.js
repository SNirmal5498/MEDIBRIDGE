const express = require("express");
const router = express.Router();
const multer = require("multer");
const { authMiddleware, requireAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  uploadPrescription,
  getMyPrescriptions,
  getPrescriptionFile,
  reviewPrescription,
  createPrescriptionOrderRequest,
} = require("../controllers/prescriptionController");

const handleMulterUpload = (req, res, next) => {
  upload.single("prescription")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "Prescription file size exceeds the 5 MB limit. Please upload a smaller file.",
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || "Invalid file upload.",
      });
    }
    next();
  });
};

router.post("/upload", authMiddleware, handleMulterUpload, uploadPrescription);
router.get("/my", authMiddleware, getMyPrescriptions);
router.get("/:id/file", authMiddleware, getPrescriptionFile);
router.patch("/:id/review", authMiddleware, requireAdmin, reviewPrescription);
router.post("/:id/order-request", authMiddleware, createPrescriptionOrderRequest);

module.exports = router;
