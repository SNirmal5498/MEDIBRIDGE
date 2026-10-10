const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    dateOfBirth: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: ["", "male", "female", "other", "prefer_not_to_say"],
      default: "",
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    preferredLanguage: {
      type: String,
      default: "English",
    },

    profilePicture: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "customer", "admin", "pharmacy_owner", "pharmacy_staff"],
      default: "user",
    },

    pharmacyId: {
      type: String,
      default: "",
      index: true,
    },

    staffPermissions: {
      type: [String],
      default: [
        "inventory_read",
        "inventory_write",
        "orders_read",
        "orders_update",
        "prescriptions_read",
        "prescriptions_review",
      ],
    },

    accountStatus: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    // Delivery address fields
    address: {
      houseFlat: {
        type: String,
        default: "",
      },
      streetRoad: {
        type: String,
        default: "",
      },
      area: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
      state: {
        type: String,
        default: "",
      },
      pincode: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
