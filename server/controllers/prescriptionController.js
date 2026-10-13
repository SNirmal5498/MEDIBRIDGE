const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const Prescription = require("../models/Prescription");
const Order = require("../models/Order");
const Pharmacy = require("../models/Pharmacy");

// Handle prescription upload
const uploadPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No prescription file uploaded",
      });
    }

    const { orderId, pharmacyId, medicineId, medicineName, customerNotes } = req.body;

    // Validate pharmacy selection
    const cleanPharmId = (pharmacyId || "").trim();
    if (!cleanPharmId) {
      if (req.file?.path && fs.existsSync(req.file.path)) {
        try { fs.unlinkSync(req.file.path); } catch (_) {}
      }
      return res.status(400).json({
        success: false,
        message: "A partner pharmacy must be selected for prescription review.",
      });
    }

    const pharmacyDoc = await Pharmacy.findOne({ id: cleanPharmId });
    if (!pharmacyDoc || pharmacyDoc.approvalStatus !== "approved" || pharmacyDoc.isActive === false) {
      if (req.file?.path && fs.existsSync(req.file.path)) {
        try { fs.unlinkSync(req.file.path); } catch (_) {}
      }
      return res.status(400).json({
        success: false,
        message: "The selected pharmacy is not currently eligible to accept prescription requests.",
      });
    }

    let orderDoc = null;
    if (orderId) {
      orderDoc = await Order.findOne({ orderId });
    }

    const prescription = await Prescription.create({
      user: req.user._id,
      order: orderDoc ? orderDoc._id : null,
      pharmacyId: pharmacyDoc.id,
      pharmacyName: pharmacyDoc.name,
      medicineId: (medicineId || "").trim(),
      medicineName: (medicineName || "").trim(),
      customerNotes: (customerNotes || "").trim().slice(0, 500),
      originalName: req.file.originalname,
      filename: req.file.filename,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      status: "pending",
      auditHistory: [
        {
          status: "pending",
          notes: "Prescription submitted by customer",
          updatedBy: req.user._id,
          timestamp: new Date(),
        },
      ],
    });

    const sanitized = prescription.toObject();
    delete sanitized.filePath; // Hide internal server path

    res.status(201).json({
      success: true,
      message: "Prescription submitted successfully. Awaiting pharmacy verification.",
      prescription: sanitized,
      reference: prescription._id,
    });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (_) {}
    }
    console.error("Error in uploadPrescription:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Prescription upload failed",
    });
  }
};

// Get current user's uploaded prescriptions
const getMyPrescriptions = async (req, res) => {
  try {
    const query = { user: req.user._id };
    if (req.query.medicineId) {
      query.medicineId = req.query.medicineId;
    }

    const prescriptions = await Prescription.find(query)
      .select("-filePath")
      .populate("order", "orderId status totalAmount createdAt")
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 })
      .lean();

    // Ensure pharmacyName is present
    const Pharmacy = require("../models/Pharmacy");
    const enhanced = await Promise.all(
      prescriptions.map(async (rx) => {
        if (!rx.pharmacyName && rx.pharmacyId) {
          const pharm = await Pharmacy.findOne({
            $or: [{ id: rx.pharmacyId }, { pharmacyId: rx.pharmacyId }],
          }).lean();
          if (pharm) rx.pharmacyName = pharm.name;
        }
        return rx;
      })
    );

    res.status(200).json({
      success: true,
      prescriptions: enhanced,
    });
  } catch (error) {
    console.error("Error in getMyPrescriptions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch prescriptions",
    });
  }
};

// Securely view/download prescription file
const getPrescriptionFile = async (req, res) => {
  try {
    const { id } = req.params;
    const prescription = await Prescription.findById(id);

    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription not found" });
    }

    // Access Authorization check:
    // 1. Customer who uploaded the prescription
    // 2. System Admin
    // 3. Authorized Pharmacy Owner or Staff assigned to this prescription's pharmacyId
    const isOwnerUser = prescription.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    const isAssignedPharmacyStaff =
      ["pharmacy_owner", "pharmacy_staff"].includes(req.user.role) &&
      req.user.pharmacyId &&
      prescription.pharmacyId &&
      req.user.pharmacyId === prescription.pharmacyId;

    if (!isOwnerUser && !isAdmin && !isAssignedPharmacyStaff) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission to view this prescription document.",
      });
    }

    const safeBaseDir = path.resolve(__dirname, "../uploads/prescriptions");
    const targetPath = path.resolve(prescription.filePath);

    // Prevent path traversal
    if (!targetPath.startsWith(safeBaseDir)) {
      return res.status(403).json({ success: false, message: "Invalid file path." });
    }

    if (!fs.existsSync(targetPath)) {
      return res.status(404).json({ success: false, message: "File does not exist on server" });
    }

    res.setHeader("Content-Type", prescription.fileType);
    res.setHeader("Content-Disposition", `inline; filename="${prescription.filename}"`);
    res.sendFile(targetPath);
  } catch (error) {
    console.error("Error in getPrescriptionFile:", error);
    res.status(500).json({ success: false, message: "Failed to access prescription file" });
  }
};

// Admin review prescription: approve or reject
const reviewPrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription not found" });
    }

    prescription.status = status;
    prescription.rejectionReason = status === "rejected" ? rejectionReason || "Invalid prescription document" : "";
    prescription.reviewedBy = req.user._id;
    prescription.reviewedAt = new Date();

    await prescription.save();

    // If tied to an order, update order timeline
    if (prescription.order) {
      const order = await Order.findById(prescription.order);
      if (order) {
        if (status === "approved") {
          order.status = "confirmed";
          order.timeline.push({ status: "confirmed", done: true, timestamp: new Date() });
        } else if (status === "rejected") {
          order.status = "cancelled";
          order.timeline.push({ status: "cancelled", done: true, timestamp: new Date() });
        }
        await order.save();
      }
    }

    res.status(200).json({
      success: true,
      message: `Prescription ${status} successfully`,
      prescription,
    });
  } catch (error) {
    console.error("Error in reviewPrescription:", error);
    res.status(500).json({ success: false, message: "Prescription review failed" });
  }
};

// Customer creates an order request for an approved prescription
const createPrescriptionOrderRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryAddress, paymentMethod = "cod", quantity = 1 } = req.body;

    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription not found" });
    }

    // Ownership check
    if (prescription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create an order request for this prescription.",
      });
    }

    // Must be approved or reviewed
    if (!["approved", "reviewed"].includes(prescription.status)) {
      return res.status(400).json({
        success: false,
        message: `Prescription has status '${prescription.status}'. Only verified and approved prescriptions can proceed to order dispensing.`,
      });
    }

    // Check if an order already exists for this prescription
    if (prescription.order) {
      const Order = require("../models/Order");
      const existingOrder = await Order.findById(prescription.order);
      if (existingOrder) {
        return res.status(400).json({
          success: false,
          message: `An order request has already been placed for this prescription (Order ID: ${existingOrder.orderId}).`,
          orderId: existingOrder.orderId,
        });
      }
    }

    // Validate Pharmacy
    const Pharmacy = require("../models/Pharmacy");
    const targetPharmacy = await Pharmacy.findOne({
      $or: [{ id: prescription.pharmacyId }, { pharmacyId: prescription.pharmacyId }],
    });
    if (!targetPharmacy || targetPharmacy.isActive === false || targetPharmacy.approvalStatus !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Assigned partner pharmacy is currently not available for dispensing fulfillment.",
      });
    }

    // Validate delivery address
    if (!deliveryAddress || !deliveryAddress.phone || !deliveryAddress.pincode) {
      return res.status(400).json({
        success: false,
        message: "Delivery address with phone and pincode is required",
      });
    }

    // Medicine lookup
    const Medicine = require("../models/Medicine");
    const isObjectId = mongoose.Types.ObjectId.isValid(prescription.medicineId);
    const medicine = await Medicine.findOne(
      isObjectId
        ? { $or: [{ id: prescription.medicineId }, { _id: prescription.medicineId }] }
        : { id: prescription.medicineId }
    ).lean();

    const unitPrice = medicine?.price || 100;
    const qty = Math.max(1, Number(quantity) || 1);
    const subtotal = unitPrice * qty;
    const deliveryFee = targetPharmacy.deliveryFee ?? 40;
    const totalAmount = subtotal + deliveryFee;

    // Check and deduct inventory if tracked
    const Inventory = require("../models/Inventory");
    if (prescription.pharmacyId && prescription.medicineId) {
      const inv = await Inventory.findOne({
        pharmacyId: prescription.pharmacyId,
        medicineId: prescription.medicineId,
      });
      if (inv && inv.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Pharmacy inventory currently does not have sufficient stock (${inv.stock} available).`,
        });
      }
      if (inv) {
        inv.stock -= qty;
        const lowThresh = inv.lowStockThreshold || 10;
        inv.availability = inv.stock === 0 ? "out" : inv.stock <= lowThresh ? "limited" : "in-stock";
        await inv.save();
      }
    }

    const generateOrderId = () => {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
      const randomNum = Math.floor(Math.random() * 999) + 1;
      const paddedNum = randomNum.toString().padStart(3, "0");
      return `MB-RX-${dateStr}-${paddedNum}`;
    };

    const Order = require("../models/Order");
    const orderId = generateOrderId();
    const order = new Order({
      user: req.user._id,
      prescription: prescription._id,
      orderId,
      items: [
        {
          medicineId: prescription.medicineId || "rx-medicine",
          medicineName: prescription.medicineName || medicine?.name || "Prescription Medicine",
          genericName: medicine?.genericName || "",
          strength: medicine?.strength || "",
          quantity: qty,
          unitPrice,
          totalPrice: subtotal,
          otc: false, // Verified prescription order item
        },
      ],
      pharmacy: {
        id: targetPharmacy.id,
        name: targetPharmacy.name,
        address: targetPharmacy.address,
        phone: targetPharmacy.phone,
        rating: targetPharmacy.rating || 4.5,
        distance: targetPharmacy.distanceKm ? `${targetPharmacy.distanceKm} km` : "2.0 km",
      },
      deliveryAddress,
      paymentMethod: paymentMethod || "cod",
      subtotal,
      deliveryFee,
      discount: 0,
      totalAmount,
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: "placed",
      timeline: [
        {
          status: "placed",
          timestamp: new Date(),
          done: true,
        },
      ],
      stockDeducted: true,
      stockRestored: false,
    });

    await order.save();

    // Link order to prescription
    prescription.order = order._id;
    prescription.auditHistory.push({
      status: prescription.status,
      notes: `Prescription order request placed (Order: ${orderId})`,
      updatedBy: req.user._id,
      timestamp: new Date(),
    });
    await prescription.save();

    res.status(201).json({
      success: true,
      message: "Prescription order request successfully created and sent to pharmacy for fulfillment.",
      order,
      orderId: order.orderId,
    });
  } catch (error) {
    console.error("Error in createPrescriptionOrderRequest:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create prescription order request",
    });
  }
};

module.exports = {
  uploadPrescription,
  getMyPrescriptions,
  getPrescriptionFile,
  reviewPrescription,
  createPrescriptionOrderRequest,
};
