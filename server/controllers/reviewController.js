const Review = require("../models/Review");
const Pharmacy = require("../models/Pharmacy");

// Get reviews for target (pharmacy or medicine)
const getReviews = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const reviews = await Review.find({ targetType, targetId, isApproved: true })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error in getReviews:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};

// Create or update review
const submitReview = async (req, res) => {
  try {
    const { targetType, targetId, rating, comment } = req.body;

    if (!targetType || !targetId || !rating) {
      return res.status(400).json({ success: false, message: "targetType, targetId, and rating are required" });
    }

    const review = await Review.findOneAndUpdate(
      { user: req.user._id, targetType, targetId },
      {
        userName: req.user.name || "MediBridge User",
        rating: Math.max(1, Math.min(5, Number(rating))),
        comment: (comment || "").trim(),
        isApproved: true,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Recalculate rating for target pharmacy if pharmacy
    if (targetType === "pharmacy") {
      const stats = await Review.aggregate([
        { $match: { targetType: "pharmacy", targetId, isApproved: true } },
        { $group: { _id: "$targetId", avgRating: { $avg: "$rating" } } },
      ]);

      if (stats.length > 0) {
        const rounded = Math.round(stats[0].avgRating * 10) / 10;
        await Pharmacy.updateOne({ id: targetId }, { rating: rounded });
      }
    }

    res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Error in submitReview:", error);
    res.status(500).json({ success: false, message: "Failed to submit review" });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await review.deleteOne();

    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error in deleteReview:", error);
    res.status(500).json({ success: false, message: "Failed to delete review" });
  }
};

module.exports = {
  getReviews,
  submitReview,
  deleteReview,
};
