const mongoose = require("mongoose");

const pharmacySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    distanceKm: {
      type: Number,
      default: 1.0,
    },
    travelTimeDrive: {
      type: String,
      default: "5 mins",
    },
    travelTimeWalk: {
      type: String,
      default: "15 mins",
    },
    openingTime: {
      type: String,
      default: "08:00 AM",
    },
    closingTime: {
      type: String,
      default: "10:00 PM",
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    deliveryAvailable: {
      type: Boolean,
      default: true,
    },
    deliveryFee: {
      type: Number,
      default: 25,
    },
    latitude: {
      type: Number,
      default: 11.0168,
    },
    longitude: {
      type: Number,
      default: 76.9558,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Pharmacy", pharmacySchema);
