const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    items: [
      {
        medicineId: {
          type: String,
          required: true,
        },
        medicineName: {
          type: String,
          required: true,
        },
        genericName: {
          type: String,
          required: true,
        },
        strength: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        totalPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        otc: {
          type: Boolean,
          required: true,
        },
      },
    ],

    pharmacy: {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      distance: {
        type: String,
        required: true,
      },
    },

    deliveryAddress: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      houseFlat: {
        type: String,
        required: true,
      },
      streetRoad: {
        type: String,
        required: true,
      },
      area: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "upi", "card", "netbanking"],
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryFee: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["placed", "confirmed", "packed", "out-for-delivery", "delivered", "cancelled"],
      default: "placed",
    },

    estimatedDelivery: {
      type: Date,
      required: true,
    },

    timeline: [
      {
        status: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        done: {
          type: Boolean,
          default: true,
        },
      },
    ],

    stockDeducted: {
      type: Boolean,
      default: true,
    },

    stockRestored: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
