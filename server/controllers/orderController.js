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

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const deliveryFee = 40;
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
    const order = new Order({
      user: req.user.id,
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
