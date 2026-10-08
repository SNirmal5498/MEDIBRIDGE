const crypto = require("crypto");
const Order = require("../models/Order");

/**
 * Create Payment Order (Razorpay / Gateway architecture)
 * POST /api/payment/create-order
 */
const createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Valid amount is required" });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_medibridge_demo";
    const razorpayOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    res.status(200).json({
      success: true,
      keyId,
      amount: Math.round(amount * 100), // Amount in paise
      currency,
      razorpayOrderId,
      orderId,
      environment: process.env.RAZORPAY_KEY_SECRET ? "production" : "sandbox_test",
    });
  } catch (error) {
    console.error("Error in createPaymentOrder:", error);
    res.status(500).json({ success: false, message: "Payment initialization failed" });
  }
};

/**
 * Verify Payment Signature
 * POST /api/payment/verify
 */
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keySecret) {
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: "Payment signature verification failed. Invalid transaction.",
        });
      }
    } else {
      console.log("RAZORPAY_KEY_SECRET not set: running in sandbox test mode.");
    }

    // Update order status if orderId provided
    if (orderId) {
      const order = await Order.findOne({ orderId });
      if (order) {
        order.status = "confirmed";
        order.timeline.push({ status: "confirmed", done: true, timestamp: new Date() });
        await order.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id || `pay_${Date.now()}`,
    });
  } catch (error) {
    console.error("Error in verifyPayment:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};
