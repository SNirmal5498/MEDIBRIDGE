const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { getReviews, submitReview, deleteReview } = require("../controllers/reviewController");

router.get("/:targetType/:targetId", getReviews);
router.post("/", authMiddleware, submitReview);
router.delete("/:id", authMiddleware, deleteReview);

module.exports = router;
