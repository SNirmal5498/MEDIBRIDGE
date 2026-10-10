const Pharmacy = require("../models/Pharmacy");
const Inventory = require("../models/Inventory");
const Medicine = require("../models/Medicine");
const Order = require("../models/Order");
const Prescription = require("../models/Prescription");
const User = require("../models/User");
const MedicineSubmission = require("../models/MedicineSubmission");
const bcrypt = require("bcrypt");

// Get Assigned Pharmacy Profile
const getPharmacyProfile = async (req, res) => {
  try {
    const pharmacyId = req.user.pharmacyId;
    if (!pharmacyId) {
      return res.status(404).json({ success: false, message: "No pharmacy associated with this owner account." });
    }

    const pharmacy = await Pharmacy.findOne({ id: pharmacyId }).lean();
    if (!pharmacy) {
      return res.status(404).json({ success: false, message: "Assigned pharmacy record not found." });
    }

    res.status(200).json({
      success: true,
      pharmacy,
      isApproved: pharmacy.approvalStatus === "approved",
    });
  } catch (error) {
    console.error("Error in getPharmacyProfile:", error);
    res.status(500).json({ success: false, message: "Failed to fetch pharmacy profile" });
  }
};

// Update Assigned Pharmacy Profile
const updatePharmacyProfile = async (req, res) => {
  try {
    const pharmacyId = req.user.pharmacyId;
    if (!pharmacyId) {
      return res.status(404).json({ success: false, message: "No pharmacy associated with this account." });
    }

    const allowedUpdates = [
      "address",
      "phone",
      "openingTime",
      "closingTime",
      "deliveryAvailable",
      "deliveryFee",
      "licenseNumber",
      "responsiblePharmacist",
    ];

    const updateFields = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updateFields[key] = req.body[key];
      }
    }

    const pharmacy = await Pharmacy.findOneAndUpdate(
      { id: pharmacyId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!pharmacy) {
      return res.status(404).json({ success: false, message: "Pharmacy not found." });
    }

    res.status(200).json({ success: true, pharmacy, message: "Pharmacy profile updated successfully." });
  } catch (error) {
    console.error("Error in updatePharmacyProfile:", error);
    res.status(500).json({ success: false, message: "Failed to update pharmacy profile" });
  }
};

// Get Pharmacy Inventory List (with populating catalog metadata)
const getPharmacyInventory = async (req, res) => {
  try {
    const pharmacyId = req.user.pharmacyId;
    if (!pharmacyId) {
      return res.status(400).json({ success: false, message: "No pharmacy assigned to account." });
    }

    const inventory = await Inventory.find({ pharmacyId }).sort({ updatedAt: -1 }).lean();
    const medicineIds = [...new Set(inventory.map((i) => i.medicineId))];
    const medicines = await Medicine.find({ id: { $in: medicineIds } }).lean();
    const medMap = new Map(medicines.map((m) => [m.id, m]));

    const populated = inventory.map((inv) => ({
      ...inv,
      medicine: medMap.get(inv.medicineId) || { name: inv.medicineId, brand: inv.medicineId, price: inv.price },
    }));

    res.status(200).json({ success: true, inventory: populated });
  } catch (error) {
    console.error("Error in getPharmacyInventory:", error);
    res.status(500).json({ success: false, message: "Failed to fetch pharmacy inventory" });
  }
};

// Add or Update Pharmacy Inventory Record (Compound Index Safe)
const addOrUpdateInventoryItem = async (req, res) => {
  try {
    const pharmacyId = req.user.pharmacyId;
    if (!pharmacyId) {
      return res.status(400).json({ success: false, message: "No pharmacy assigned to account." });
    }

    const {
      medicineId,
      stock,
      price,
      lowStockThreshold,
      stockType,
      verificationSource,
      batchNumber,
      expiryDate,
      reason,
    } = req.body;

    if (!medicineId || stock === undefined || price === undefined) {
      return res.status(400).json({ success: false, message: "medicineId, stock, and price are required." });
    }

    const numStock = Number(stock);
    const numPrice = Number(price);
    const numThreshold = lowStockThreshold !== undefined ? Number(lowStockThreshold) : 10;

    if (isNaN(numStock) || numStock < 0) {
      return res.status(400).json({ success: false, message: "Stock must be a non-negative number." });
    }
    if (isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({ success: false, message: "Price must be a non-negative number." });
    }

    // Verify target medicine exists in central catalog
    const catalogItem = await Medicine.findOne({ id: medicineId });
    if (!catalogItem) {
      return res.status(404).json({ success: false, message: `Medicine catalog item '${medicineId}' not found.` });
    }

    const invBefore = await Inventory.findOne({ pharmacyId, medicineId });
    const oldStock = invBefore ? invBefore.stock : 0;
    const computedAvailability = numStock === 0 ? "out" : numStock <= numThreshold ? "limited" : "in-stock";

    const historyEntry = {
      date: new Date(),
      oldStock,
      newStock: numStock,
      change: numStock - oldStock,
      reason: reason || (invBefore ? "Pharmacy Owner Inventory Update" : "Initial Stock Created"),
      source: verificationSource || "pharmacy_owner_portal",
    };

    const updateFields = {
      stock: numStock,
      price: numPrice,
      availability: computedAvailability,
      lowStockThreshold: numThreshold,
      stockType: stockType || (invBefore?.stockType || "verified"),
      lastVerifiedAt: new Date(),
      verificationSource: verificationSource || "pharmacy_owner_portal",
    };

    if (batchNumber) updateFields.batchNumber = batchNumber.trim();
    if (expiryDate) updateFields.expiryDate = new Date(expiryDate);

    const inv = await Inventory.findOneAndUpdate(
      { pharmacyId, medicineId },
      {
        $set: updateFields,
        $push: { adjustmentHistory: historyEntry },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      inventory: inv,
      message: `Stock record for ${catalogItem.brand || catalogItem.name} saved successfully.`,
    });
  } catch (error) {
    console.error("Error in addOrUpdateInventoryItem:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to update inventory record" });
  }
};

// Quick Stock / Price Adjustment with Mandatory Reason Logging
const updateStockAndPrice = async (req, res) => {
  try {
    const pharmacyId = req.user.pharmacyId;
    const { medicineId, stock, price, reason } = req.body;

    if (!medicineId || (stock === undefined && price === undefined)) {
      return res.status(400).json({ success: false, message: "medicineId and stock or price are required." });
    }

    const invBefore = await Inventory.findOne({ pharmacyId, medicineId });
    if (!invBefore) {
      return res.status(404).json({ success: false, message: "Inventory record not found." });
    }

    const newStock = stock !== undefined ? Number(stock) : invBefore.stock;
    const newPrice = price !== undefined ? Number(price) : invBefore.price;
    const numThreshold = invBefore.lowStockThreshold || 10;
    const computedAvailability = newStock === 0 ? "out" : newStock <= numThreshold ? "limited" : "in-stock";

    const historyEntry = {
      date: new Date(),
      oldStock: invBefore.stock,
      newStock,
      change: newStock - invBefore.stock,
      reason: reason || "Pharmacy Stock Quick Adjustment",
      source: "pharmacy_owner_portal",
    };

    const inv = await Inventory.findOneAndUpdate(
      { pharmacyId, medicineId },
      {
        $set: {
          stock: newStock,
          price: newPrice,
          availability: computedAvailability,
          lastVerifiedAt: new Date(),
          verificationSource: "pharmacy_owner_portal",
        },
        $push: { adjustmentHistory: historyEntry },
      },
      { new: true }
    );

    res.status(200).json({ success: true, inventory: inv, message: "Stock and price updated successfully." });
  } catch (error) {
    console.error("Error in updateStockAndPrice:", error);
    res.status(500).json({ success: false, message: "Failed to adjust stock and price" });
  }
};

// Get Orders Assigned to Pharmacy
const getPharmacyOrders = async (req, res) => {
  try {
    const pharmacyId = req.user.pharmacyId;
    if (!pharmacyId) {
      return res.status(400).json({ success: false, message: "No pharmacy assigned to account." });
    }

    const orders = await Order.find({ "pharmacy.id": pharmacyId }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error in getPharmacyOrders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// Update Order Status for Assigned Pharmacy
const updatePharmacyOrderStatus = async (req, res) => {
  try {
    const pharmacyId = req.user.pharmacyId;
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["placed", "confirmed", "packed", "out-for-delivery", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const order = await Order.findOne({ orderId: id, "pharmacy.id": pharmacyId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found for this pharmacy." });
    }

    // State machine check
    const ALLOWED_NEXT = {
      placed: ["confirmed", "cancelled"],
      confirmed: ["packed", "cancelled"],
      packed: ["out-for-delivery", "cancelled"],
      "out-for-delivery": ["delivered", "cancelled"],
      delivered: [],
      cancelled: [],
    };

    const allowed = ALLOWED_NEXT[order.status] || [];
    if (!allowed.includes(status) && order.status !== status) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status transition from '${order.status}' to '${status}'.`,
      });
    }

    // Restore stock if cancelled
    if (status === "cancelled" && !order.stockRestored) {
      for (const item of order.items) {
        const invBefore = await Inventory.findOne({ pharmacyId, medicineId: item.medicineId });
        const oldStock = invBefore ? invBefore.stock : 0;
        const restoredStock = oldStock + item.quantity;
        const lowThresh = invBefore?.lowStockThreshold || 10;
        const newAvail = restoredStock === 0 ? "out" : restoredStock <= lowThresh ? "limited" : "in-stock";

        await Inventory.updateOne(
          { pharmacyId, medicineId: item.medicineId },
          {
            $inc: { stock: item.quantity },
            $set: { availability: newAvail, lastVerifiedAt: new Date() },
            $push: {
              adjustmentHistory: {
                date: new Date(),
                oldStock,
                newStock: restoredStock,
                change: item.quantity,
                reason: `Pharmacy Order Cancellation (${order.orderId})`,
                source: "pharmacy_cancellation",
              },
            },
          }
        );
      }
      order.stockRestored = true;
    }

    order.status = status;
    order.timeline.push({ status, done: true, timestamp: new Date() });
    await order.save();

    res.status(200).json({ success: true, order, message: `Order #${order.orderId} status updated to ${status}.` });
  } catch (error) {
    console.error("Error in updatePharmacyOrderStatus:", error);
    res.status(500).json({ success: false, message: "Failed to update order status" });
  }
};

// Get Prescription Review Requests Assigned to Pharmacy
const getPharmacyPrescriptions = async (req, res) => {
  try {
    const pharmacyId = req.user.pharmacyId;
    if (!pharmacyId) {
      return res.status(400).json({ success: false, message: "No pharmacy assigned to account." });
    }

    const prescriptions = await Prescription.find({ pharmacyId })
      .populate("user", "name email phone")
      .populate("reviewedBy", "name email role")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, prescriptions });
  } catch (error) {
    console.error("Error in getPharmacyPrescriptions:", error);
    res.status(500).json({ success: false, message: "Failed to fetch prescriptions" });
  }
};

// Review Prescription Request
const reviewPharmacyPrescription = async (req, res) => {
  try {
    const pharmacyId = req.user.pharmacyId;
    const { id } = req.params;
    const { status, reviewNotes, rejectionReason } = req.body;

    const allowedStatuses = ["under-review", "clarification-required", "reviewed", "rejected", "approved"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid prescription status." });
    }

    const prescription = await Prescription.findOne({
      _id: id,
      $or: [{ pharmacyId }, { pharmacyId: "" }, { pharmacyId: null }],
    });

    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription record not found." });
    }

    prescription.status = status;
    prescription.reviewNotes = reviewNotes || "";
    prescription.rejectionReason = status === "rejected" ? rejectionReason || reviewNotes || "Rejected" : "";
    prescription.reviewedBy = req.user._id;
    prescription.reviewedAt = new Date();

    prescription.auditHistory.push({
      status,
      notes: reviewNotes || rejectionReason || `Status updated to ${status}`,
      updatedBy: req.user._id,
      timestamp: new Date(),
    });

    await prescription.save();

    res.status(200).json({ success: true, prescription, message: `Prescription review updated to '${status}'.` });
  } catch (error) {
    console.error("Error in reviewPharmacyPrescription:", error);
    res.status(500).json({ success: false, message: "Failed to review prescription" });
  }
};

// Submit New Catalog Addition Request to Admin
const submitNewMedicine = async (req, res) => {
  try {
    const pharmacyId = req.user.pharmacyId;
    const { name, brand, genericName, category, manufacturer, price, prescriptionRequired, description, composition, strength } = req.body;

    if (!name || !brand || !category || price === undefined) {
      return res.status(400).json({ success: false, message: "Name, brand, category, and price are required." });
    }

    const submission = await MedicineSubmission.create({
      submittedBy: req.user._id,
      pharmacyId,
      name: name.trim(),
      brand: brand.trim(),
      genericName: (genericName || "").trim(),
      category: category.trim(),
      manufacturer: (manufacturer || "").trim(),
      price: Number(price),
      prescriptionRequired: Boolean(prescriptionRequired),
      description: description || "",
      composition: composition || "",
      strength: strength || "",
      status: "pending",
    });

    res.status(201).json({
      success: true,
      submission,
      message: "Medicine catalog submission created successfully. Awaiting System Admin approval.",
    });
  } catch (error) {
    console.error("Error in submitNewMedicine:", error);
    res.status(500).json({ success: false, message: "Failed to submit new medicine" });
  }
};

// Get Pharmacy Staff Members
const getPharmacyStaff = async (req, res) => {
  try {
    const pharmacyId = req.user.pharmacyId;
    const staff = await User.find({ pharmacyId, role: "pharmacy_staff" })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, staff });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch staff members" });
  }
};

// Add / Invite Pharmacy Staff Member
const addPharmacyStaff = async (req, res) => {
  try {
    const pharmacyId = req.user.pharmacyId;
    const { name, email, password, phone, permissions } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required for staff account." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ success: false, message: "User account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const staffUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: (phone || "").trim(),
      role: "pharmacy_staff",
      pharmacyId,
      staffPermissions: permissions || [
        "inventory_read",
        "inventory_write",
        "orders_read",
        "orders_update",
        "prescriptions_read",
        "prescriptions_review",
      ],
      accountStatus: "active",
    });

    const sanitized = staffUser.toObject();
    delete sanitized.password;

    res.status(201).json({ success: true, staff: sanitized, message: "Pharmacy staff account created successfully." });
  } catch (error) {
    console.error("Error in addPharmacyStaff:", error);
    res.status(500).json({ success: false, message: "Failed to create staff account" });
  }
};

// Update Staff Member Permissions
const updateStaffPermissions = async (req, res) => {
  try {
    const pharmacyId = req.user.pharmacyId;
    const { staffId } = req.params;
    const { permissions, accountStatus } = req.body;

    const staffUser = await User.findOne({ _id: staffId, pharmacyId, role: "pharmacy_staff" });
    if (!staffUser) {
      return res.status(404).json({ success: false, message: "Staff member not found." });
    }

    if (permissions && Array.isArray(permissions)) {
      staffUser.staffPermissions = permissions;
    }
    if (accountStatus && ["active", "suspended"].includes(accountStatus)) {
      staffUser.accountStatus = accountStatus;
    }

    await staffUser.save();
    const sanitized = staffUser.toObject();
    delete sanitized.password;

    res.status(200).json({ success: true, staff: sanitized, message: "Staff permissions updated successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update staff permissions" });
  }
};

// Get Inventory Audit History Logs for Pharmacy
const getInventoryAuditLogs = async (req, res) => {
  try {
    const pharmacyId = req.user.pharmacyId;
    const inventory = await Inventory.find({ pharmacyId }).lean();

    const historyLogs = [];
    for (const inv of inventory) {
      for (const entry of inv.adjustmentHistory || []) {
        historyLogs.push({
          ...entry,
          medicineId: inv.medicineId,
          pharmacyId: inv.pharmacyId,
        });
      }
    }

    historyLogs.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({ success: true, logs: historyLogs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch audit logs" });
  }
};

module.exports = {
  getPharmacyProfile,
  updatePharmacyProfile,
  getPharmacyInventory,
  addOrUpdateInventoryItem,
  updateStockAndPrice,
  getPharmacyOrders,
  updatePharmacyOrderStatus,
  getPharmacyPrescriptions,
  reviewPharmacyPrescription,
  submitNewMedicine,
  getPharmacyStaff,
  addPharmacyStaff,
  updateStaffPermissions,
  getInventoryAuditLogs,
};
