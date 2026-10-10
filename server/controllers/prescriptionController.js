const path = require("path");
const fs = require("fs");
const Prescription = require("../models/Prescription");
const Order = require("../models/Order");

// Handle prescription upload
const uploadPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No prescription file uploaded",
      });
    }

    const { orderId, pharmacyId } = req.body;
    let orderDoc = null;

    if (orderId) {
      orderDoc = await Order.findOne({ orderId });
    }

    const prescription = await Prescription.create({
      user: req.user._id,
      order: orderDoc ? orderDoc._id : null,
      pharmacyId: (pharmacyId || "").trim(),
      filename: req.file.filename,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      status: "pending",
      auditHistory: [
        {
          status: "pending",
          notes: "Prescription uploaded by customer",
          updatedBy: req.user._id,
          timestamp: new Date(),
        },
      ],
    });

    const sanitized = prescription.toObject();
    delete sanitized.filePath; // Hide internal server path

    res.status(201).json({
      success: true,
      message: "Prescription uploaded successfully. Awaiting verification.",
      prescription: sanitized,
    });
  } catch (error) {
    console.error("Error in uploadPrescription:", error);
    res.status(500).json({
      success: false,
      message: "Prescription upload failed",
    });
  }
};

// Get current user's uploaded prescriptions
const getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ user: req.user._id })
      .select("-filePath")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      prescriptions,
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

    if (!fs.existsSync(prescription.filePath)) {
      return res.status(404).json({ success: false, message: "File does not exist on server" });
    }

    res.setHeader("Content-Type", prescription.fileType);
    res.sendFile(path.resolve(prescription.filePath));
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

module.exports = {
  uploadPrescription,
  getMyPrescriptions,
  getPrescriptionFile,
  reviewPrescription,
};
