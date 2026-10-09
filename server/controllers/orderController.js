const Order = require("../models/Order");
const User = require("../models/User");

function generateOrderId() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomNum = Math.floor(Math.random() * 999) + 1;
  const paddedNum = randomNum.toString().padStart(3, "0");
  return `MB-${dateStr}-${paddedNum}`;
}

function serializeOrder(order) {
  return {
    id: order.orderId,
    _id: order._id,
    user: order.user,
    items: order.items.map((item) => ({
      medicineId: item.medicineId,
      name: `${item.medicineName} (${item.genericName} ${item.strength})`,
      qty: item.quantity,
      price: item.unitPrice,
    })),
    pharmacy: order.pharmacy,
    deliveryAddress: order.deliveryAddress,
    paymentMethod: order.paymentMethod,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    discount: order.discount,
    totalAmount: order.totalAmount,
    status: order.status,
    estimatedDelivery: order.estimatedDelivery,
    timeline: order.timeline,
    placedOn: order.createdAt,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

const createOrder = async (req, res) => {
  try {
    const { items, pharmacy, deliveryAddress, paymentMethod } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    if (!pharmacy || !pharmacy.id) {
      return res.status(400).json({
        success: false,
        message: "Pharmacy information is required",
      });
    }

    if (!deliveryAddress || !deliveryAddress.phone || !deliveryAddress.pincode) {
      return res.status(400).json({
        success: false,
        message: "Delivery address with phone and pincode is required",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required",
      });
    }

    // Validate all items are OTC
    for (const item of items) {
      if (!item.otc) {
        return res.status(400).json({
          success: false,
          message: `Prescription medicine ${item.medicineName} cannot be ordered directly`,
        });
      }

      if (item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid quantity for item",
        });
      }
    }

    // Inventory Stock Atomic Reservation & Deduction
    const Inventory = require("../models/Inventory");
    const deductedItems = [];

    for (const item of items) {
      // Find current inventory document before change for audit history
      const invBefore = await Inventory.findOne({ pharmacyId: pharmacy.id, medicineId: item.medicineId });
      if (!invBefore || invBefore.stock < item.quantity) {
        // Rollback any stock deducted so far in this transaction
        for (const rolledItem of deductedItems) {
          await Inventory.updateOne(
            { pharmacyId: pharmacy.id, medicineId: rolledItem.medicineId },
            { $inc: { stock: rolledItem.quantity } }
          );
        }
        return res.status(400).json({
          success: false,
          message: !invBefore || invBefore.stock === 0
            ? `Item '${item.medicineName}' is currently Out of Stock`
            : `Only ${invBefore.stock} units of '${item.medicineName}' are currently available.`,
        });
      }

      // Perform atomic decrement
      const updatedInv = await Inventory.findOneAndUpdate(
        { pharmacyId: pharmacy.id, medicineId: item.medicineId, stock: { $gte: item.quantity } },
        {
          $inc: { stock: -item.quantity },
          $set: {
            lastVerifiedAt: new Date(),
            verificationSource: "customer_order",
          },
          $push: {
            adjustmentHistory: {
              date: new Date(),
              oldStock: invBefore.stock,
              newStock: invBefore.stock - item.quantity,
              change: -item.quantity,
              reason: "Order Placement",
              source: "customer_order",
            },
          },
        },
        { new: true }
      );

      if (!updatedInv) {
        // Rollback previous deductions if race condition occurred
        for (const rolledItem of deductedItems) {
          await Inventory.updateOne(
            { pharmacyId: pharmacy.id, medicineId: rolledItem.medicineId },
            { $inc: { stock: rolledItem.quantity } }
          );
        }
        return res.status(400).json({
          success: false,
          message: `Stock reservation conflict for '${item.medicineName}'. Please try again.`,
        });
      }

      // Update availability enum based on remaining stock
      const lowThreshold = updatedInv.lowStockThreshold || 10;
      const newAvailability = updatedInv.stock === 0 ? "out" : updatedInv.stock <= lowThreshold ? "limited" : "in-stock";
      if (updatedInv.availability !== newAvailability) {
        updatedInv.availability = newAvailability;
        await updatedInv.save();
      }

      deductedItems.push({ medicineId: item.medicineId, quantity: item.quantity });
    }

    // Calculate totals
    const Settings = require("../models/Settings");
    const globalSettings = await Settings.findOne({ key: "global_platform_settings" });
    const deliveryFee = globalSettings?.deliveryFee ?? 40;

    const subtotal = items.reduce((sum, item) => sum + (item.totalPrice || item.unitPrice * item.quantity), 0);
    const discount = 0;
    const totalAmount = subtotal + deliveryFee - discount;

    // Calculate estimated delivery (2 days from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 2);

    // Generate order ID
    const orderId = generateOrderId();

    // Create initial timeline
    const timeline = [
      {
        status: "placed",
        timestamp: new Date(),
        done: true,
      },
    ];

    // Create order
    const userId = req.user._id || req.user.id;
    const order = new Order({
      user: userId,
      orderId,
      items,
      pharmacy,
      deliveryAddress,
      paymentMethod,
      subtotal,
      deliveryFee,
      discount,
      totalAmount,
      estimatedDelivery,
      timeline,
      stockDeducted: true,
      stockRestored: false,
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: serializeOrder(order),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders: orders.map(serializeOrder),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ orderId: id, user: req.user.id });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order: serializeOrder(order),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["placed", "confirmed", "packed", "out-for-delivery", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const order = await Order.findOne({ orderId: id });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Handle stock restoration upon order cancellation
    if (status === "cancelled" && !order.stockRestored && order.pharmacy?.id) {
      const Inventory = require("../models/Inventory");
      for (const item of order.items) {
        const invBefore = await Inventory.findOne({ pharmacyId: order.pharmacy.id, medicineId: item.medicineId });
        const oldStock = invBefore ? invBefore.stock : 0;
        const newStock = oldStock + item.quantity;
        const lowThresh = invBefore?.lowStockThreshold || 10;
        const newAvail = newStock === 0 ? "out" : newStock <= lowThresh ? "limited" : "in-stock";

        await Inventory.updateOne(
          { pharmacyId: order.pharmacy.id, medicineId: item.medicineId },
          {
            $inc: { stock: item.quantity },
            $set: { availability: newAvail, lastVerifiedAt: new Date() },
            $push: {
              adjustmentHistory: {
                date: new Date(),
                oldStock,
                newStock,
                change: item.quantity,
                reason: `Order Cancelled (${order.orderId})`,
                source: "order_cancellation",
              },
            },
          }
        );
      }
      order.stockRestored = true;
    }

    order.status = status;

    // Add to timeline
    order.timeline.push({
      status,
      timestamp: new Date(),
      done: true,
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: serializeOrder(order),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
};
