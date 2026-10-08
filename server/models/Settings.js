const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "global_platform_settings",
      unique: true,
    },
    emergencyHotline: {
      type: String,
      default: "+91-1800-123-4567",
    },
    taxRate: {
      type: Number,
      default: 5,
    },
    deliveryFee: {
      type: Number,
      default: 40,
    },
    minOrderValue: {
      type: Number,
      default: 100,
    },
    maxOtcQuantity: {
      type: Number,
      default: 10,
    },
    rxAutoApproval: {
      type: Boolean,
      default: false,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);
