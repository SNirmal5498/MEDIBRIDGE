const User = require("../models/User");
const Medicine = require("../models/Medicine");
const Pharmacy = require("../models/Pharmacy");
const Order = require("../models/Order");
const Prescription = require("../models/Prescription");
const TranslationCache = require("../models/TranslationCache");

// Overview Stats
const getOverviewStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalMedicines,
      totalPharmacies,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      prescriptionRequests,
      otcCount,
      prescriptionCount,
      totalCachedTranslations,
    ] = await Promise.all([
      User.countDocuments(),
      Medicine.countDocuments(),
      Pharmacy.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: { $in: ["placed", "confirmed", "packed", "processing"] } }),
      Order.countDocuments({ status: "delivered" }),
      Prescription.countDocuments({ status: "pending" }),
      Medicine.countDocuments({ otc: true }),
      Medicine.countDocuments({ prescriptionRequired: true }),
      TranslationCache.countDocuments(),
    ]);

    // Calculate revenue aggregation
    const revenueStats = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);

    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalMedicines,
        totalPharmacies,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        prescriptionRequests,
        otcCount,
        prescriptionCount,
        totalCachedTranslations,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Error in getOverviewStats:", error);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard stats" });
  }
};

// Users list
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

// Update user status (active / suspended)
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { accountStatus } = req.body;

    if (!["active", "suspended"].includes(accountStatus)) {
      return res.status(400).json({ success: false, message: "Invalid account status" });
    }

    const user = await User.findByIdAndUpdate(id, { accountStatus }, { new: true }).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update user status" });
  }
};

// Admin Add Medicine
const addMedicine = async (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.brand || !data.category || !data.price) {
      return res.status(400).json({ success: false, message: "Name, brand, category, and price are required" });
    }

    if (!data.id) {
      data.id = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4);
    }

    const medicine = await Medicine.create(data);
    res.status(201).json({ success: true, medicine });
  } catch (error) {
    console.error("Error in addMedicine:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to create medicine" });
  }
};

// Admin Update Medicine
const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findOneAndUpdate({ id }, req.body, { new: true });
    if (!medicine) {
      return res.status(404).json({ success: false, message: "Medicine not found" });
    }
    res.status(200).json({ success: true, medicine });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update medicine" });
  }
};

// Admin Toggle / Delete Medicine (Soft Delete)
const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findOneAndUpdate({ id }, { isActive: false }, { new: true });
    if (!medicine) {
      return res.status(404).json({ success: false, message: "Medicine not found" });
    }
    res.status(200).json({ success: true, message: "Medicine deactivated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to deactivate medicine" });
  }
};

// Admin Add Pharmacy
const addPharmacy = async (req, res) => {
  try {
    const data = req.body;
    if (!data.id) {
      data.id = "pharm-" + Date.now().toString().slice(-6);
    }
    const pharmacy = await Pharmacy.create(data);
    res.status(201).json({ success: true, pharmacy });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create pharmacy" });
  }
};

// Admin Update Pharmacy
const updatePharmacy = async (req, res) => {
  try {
    const { id } = req.params;
    const pharmacy = await Pharmacy.findOneAndUpdate({ id }, req.body, { new: true });
    res.status(200).json({ success: true, pharmacy });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update pharmacy" });
  }
};

// Admin List Orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// Admin Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["placed", "confirmed", "packed", "out-for-delivery", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const order = await Order.findOne({ orderId: id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // State machine validation
    const ALLOWED_NEXT_STATES = {
      placed: ["confirmed", "cancelled"],
      confirmed: ["packed", "cancelled"],
      packed: ["out-for-delivery", "cancelled"],
      "out-for-delivery": ["delivered", "cancelled"],
      delivered: [],
      cancelled: [],
    };

    const allowed = ALLOWED_NEXT_STATES[order.status] || [];
    if (!allowed.includes(status) && order.status !== status) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status transition from '${order.status}' to '${status}'`,
      });
    }

    order.status = status;
    order.timeline.push({ status, done: true, timestamp: new Date() });
    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update order status" });
  }
};

// Admin Get Prescriptions
const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch prescriptions" });
  }
};

const Inventory = require("../models/Inventory");
const Review = require("../models/Review");
const Settings = require("../models/Settings");
const AuditLog = require("../models/AuditLog");

// Helper to log admin actions
const logAuditAction = async (req, action, entity, entityId = "", details = {}) => {
  try {
    if (req.user) {
      await AuditLog.create({
        adminId: req.user._id || req.user.id,
        adminEmail: req.user.email,
        action,
        entity,
        entityId,
        details,
      });
    }
  } catch (err) {
    console.error("Failed to log audit action:", err);
  }
};

// Admin List Pharmacies
const getPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, pharmacies });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch pharmacies" });
  }
};

// Admin Delete/Soft-Deactivate Pharmacy
const deletePharmacy = async (req, res) => {
  try {
    const { id } = req.params;
    const pharmacy = await Pharmacy.findOneAndUpdate({ id }, { isActive: false }, { new: true });
    if (!pharmacy) {
      return res.status(404).json({ success: false, message: "Pharmacy not found" });
    }
    await logAuditAction(req, "DEACTIVATE", "PHARMACY", id, { name: pharmacy.name });
    res.status(200).json({ success: true, message: "Pharmacy deactivated successfully", pharmacy });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to deactivate pharmacy" });
  }
};

// Admin Get Inventory
const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ updatedAt: -1 }).lean();

    // Fetch matching medicine and pharmacy metadata
    const medicineIds = [...new Set(inventory.map((i) => i.medicineId))];
    const pharmacyIds = [...new Set(inventory.map((i) => i.pharmacyId))];

    const [medicines, pharmacies] = await Promise.all([
      Medicine.find({ id: { $in: medicineIds } }).lean(),
      Pharmacy.find({ id: { $in: pharmacyIds } }).lean(),
    ]);

    const medMap = new Map(medicines.map((m) => [m.id, m]));
    const pharmMap = new Map(pharmacies.map((p) => [p.id, p]));

    const populated = inventory.map((inv) => ({
      ...inv,
      medicine: medMap.get(inv.medicineId) || { name: inv.medicineId },
      pharmacy: pharmMap.get(inv.pharmacyId) || { name: inv.pharmacyId },
    }));

    res.status(200).json({ success: true, inventory: populated });
  } catch (error) {
    console.error("Error in getInventory:", error);
    res.status(500).json({ success: false, message: "Failed to fetch inventory" });
  }
};

// Admin Add/Update Inventory
const updateInventory = async (req, res) => {
  try {
    const { pharmacyId, medicineId, stock, price, availability, deliveryAvailable } = req.body;
    if (!pharmacyId || !medicineId || stock === undefined || price === undefined) {
      return res.status(400).json({ success: false, message: "pharmacyId, medicineId, stock, and price are required" });
    }

    const computedAvailability = stock === 0 ? "out" : stock <= 5 ? "limited" : "in-stock";

    const inv = await Inventory.findOneAndUpdate(
      { pharmacyId, medicineId },
      {
        stock,
        price,
        availability: availability || computedAvailability,
        deliveryAvailable: deliveryAvailable !== undefined ? deliveryAvailable : true,
      },
      { new: true, upsert: true }
    );

    await logAuditAction(req, "UPDATE_INVENTORY", "INVENTORY", `${pharmacyId}_${medicineId}`, { stock, price });

    res.status(200).json({ success: true, inventory: inv });
  } catch (error) {
    console.error("Error in updateInventory:", error);
    res.status(500).json({ success: false, message: "Failed to update inventory" });
  }
};

// Admin Get Reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};

// Admin Moderate Review
const moderateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'hidden'
    const review = await Review.findByIdAndUpdate(id, { status }, { new: true });
    await logAuditAction(req, "MODERATE", "REVIEW", id, { status });
    res.status(200).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to moderate review" });
  }
};

// Admin Get Analytics (Aggregation)
const getAnalytics = async (req, res) => {
  try {
    const [orderStats, statusDistribution, topMedicines] = await Promise.all([
      Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
            avgOrderValue: { $avg: "$totalAmount" },
            totalOrders: { $sum: 1 },
          },
        },
      ]),
      Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $unwind: "$items" },
        { $group: { _id: "$items.medicineName", totalQty: { $sum: "$items.quantity" }, revenue: { $sum: "$items.price" } } },
        { $sort: { totalQty: -1 } },
        { $limit: 5 },
      ]),
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        revenue: orderStats[0] || { totalRevenue: 0, avgOrderValue: 0, totalOrders: 0 },
        statusDistribution,
        topMedicines,
      },
    });
  } catch (error) {
    console.error("Error in getAnalytics:", error);
    res.status(500).json({ success: false, message: "Failed to fetch analytics" });
  }
};

// Admin Get Settings
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ key: "global_platform_settings" });
    if (!settings) {
      settings = await Settings.create({ key: "global_platform_settings" });
    }
    res.status(200).json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch settings" });
  }
};

// Admin Update Settings
const updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { key: "global_platform_settings" },
      { $set: req.body },
      { new: true, upsert: true }
    );
    await logAuditAction(req, "UPDATE_SETTINGS", "SETTINGS", "global", req.body);
    res.status(200).json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update settings" });
  }
};

// Admin Get Audit Logs
const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(50).lean();
    res.status(200).json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch audit logs" });
  }
};

// Admin Get System Health
const getSystemHealth = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const mongoStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
    const uptimeSeconds = process.uptime();
    const cachedTranslationsCount = await TranslationCache.countDocuments();

    res.status(200).json({
      success: true,
      health: {
        backendApi: { status: "Online", uptime: `${Math.floor(uptimeSeconds / 60)}m ${Math.floor(uptimeSeconds % 60)}s` },
        mongodb: { status: mongoStatus, state: mongoose.connection.readyState },
        translationService: { status: "Available", cachedEntries: cachedTranslationsCount, provider: "Hybrid Translation Engine" },
        paymentGateway: { status: "Sandbox Active", provider: "MediBridge Mock Gateway" },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch system health" });
  }
};

module.exports = {
  getOverviewStats,
  getUsers,
  updateUserStatus,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getPharmacies,
  addPharmacy,
  updatePharmacy,
  deletePharmacy,
  getInventory,
  updateInventory,
  getAllOrders,
  updateOrderStatus,
  getAllPrescriptions,
  getReviews,
  moderateReview,
  getAnalytics,
  getSettings,
  updateSettings,
  getAuditLogs,
  getSystemHealth,
};
