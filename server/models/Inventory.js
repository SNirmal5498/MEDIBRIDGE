const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    pharmacyId: {
      type: String,
      required: true,
      index: true,
    },
    medicineId: {
      type: String,
      required: true,
      index: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 50,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    availability: {
      type: String,
      enum: ["in-stock", "limited", "out"],
      default: "in-stock",
    },
    deliveryAvailable: {
      type: Boolean,
      default: true,
    },
    stockType: {
      type: String,
      enum: ["verified", "manual", "sample", "stale"],
      default: "verified",
    },
    lastVerifiedAt: {
      type: Date,
      default: Date.now,
    },
    verificationSource: {
      type: String,
      default: "manual",
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 0,
    },
    adjustmentHistory: [
      {
        date: { type: Date, default: Date.now },
        oldStock: Number,
        newStock: Number,
        change: Number,
        reason: String,
        source: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

inventorySchema.index({ pharmacyId: 1, medicineId: 1 }, { unique: true });

module.exports = mongoose.model("Inventory", inventorySchema);
