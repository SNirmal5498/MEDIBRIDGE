const mongoose = require("mongoose");
const Medicine = require("../models/Medicine");
const { translateMedicine } = require("../utils/translator");

// Helper to sanitize regex input
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const getMedicines = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const {
      q,
      search,
      category,
      filter,
      sort,
      manufacturer,
    } = req.query;

    const searchTerm = (q || search || "").trim();
    const query = { isActive: true };

    // Search logic: case-insensitive partial matching across multiple fields
    if (searchTerm) {
      const safeSearch = escapeRegex(searchTerm);
      const regex = new RegExp(safeSearch, "i");
      query.$or = [
        { brand: regex },
        { genericName: regex },
        { name: regex },
        { composition: regex },
        { manufacturer: regex },
        { category: regex },
      ];
    }

    // Category filter
    if (category && category !== "all") {
      query.category = category;
    }

    // OTC / Prescription filter
    if (filter === "otc") {
      query.otc = true;
    } else if (filter === "prescription") {
      query.otc = false;
    }

    // Manufacturer filter
    if (manufacturer && manufacturer !== "all") {
      query.manufacturer = new RegExp(`^${escapeRegex(manufacturer)}$`, "i");
    }

    // Sorting
    let sortObj = { popularity: -1, rating: -1, brand: 1 };
    if (sort === "price-asc") {
      sortObj = { price: 1, brand: 1 };
    } else if (sort === "price-desc") {
      sortObj = { price: -1, brand: 1 };
    } else if (sort === "az") {
      sortObj = { brand: 1 };
    } else if (sort === "rating") {
      sortObj = { rating: -1, popularity: -1 };
    }

    const [medicines, total] = await Promise.all([
      Medicine.find(query).sort(sortObj).skip(skip).limit(limit).lean(),
      Medicine.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      success: true,
      medicines,
      total,
      page,
      totalPages,
      limit,
    });
  } catch (error) {
    console.error("Error in getMedicines:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve medicines",
      error: error.message,
    });
  }
};

const getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;

    const conditions = [{ id: id }];
    if (mongoose.Types.ObjectId.isValid(id)) {
      conditions.push({ _id: id });
    }

    const medicine = await Medicine.findOne({ $or: conditions }).lean();

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    const lang = (req.query.lang || "en").toLowerCase();
    let finalMedicine = medicine;
    if (lang !== "en") {
      finalMedicine = await translateMedicine(medicine, lang);
    }

    res.status(200).json({
      success: true,
      medicine: finalMedicine,
    });
  } catch (error) {
    console.error("Error in getMedicineById:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getAlternatives = async (req, res) => {
  try {
    const { id } = req.params;

    const conditions = [{ id: id }];
    if (mongoose.Types.ObjectId.isValid(id)) {
      conditions.push({ _id: id });
    }

    const medicine = await Medicine.findOne({ $or: conditions }).lean();

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    // Find medicines sharing the same genericName or composition, or in explicit alternatives array
    const altConditions = [
      { genericName: new RegExp(`^${escapeRegex(medicine.genericName)}$`, "i") },
    ];

    if (medicine.alternatives && medicine.alternatives.length > 0) {
      altConditions.push({ id: { $in: medicine.alternatives } });
    }

    const alternatives = await Medicine.find({
      isActive: true,
      id: { $ne: medicine.id },
      _id: { $ne: medicine._id },
      $or: altConditions,
    })
      .sort({ popularity: -1, price: 1 })
      .limit(8)
      .lean();

    res.status(200).json({
      success: true,
      alternatives,
    });
  } catch (error) {
    console.error("Error in getAlternatives:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getPopularMedicines = async (req, res) => {
  try {
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit, 10) || 8));
    const medicines = await Medicine.find({ isActive: true })
      .sort({ popularity: -1, rating: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      medicines,
    });
  } catch (error) {
    console.error("Error in getPopularMedicines:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Medicine.distinct("category", { isActive: true });
    const sorted = categories.filter(Boolean).sort();

    res.status(200).json({
      success: true,
      categories: sorted,
    });
  } catch (error) {
    console.error("Error in getCategories:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const compareMedicines = async (req, res) => {
  try {
    const { a, b } = req.query;
    if (!a && !b) {
      return res.status(400).json({
        success: false,
        message: "At least one medicine ID ('a' or 'b') must be specified for comparison",
      });
    }

    const ids = [a, b].filter(Boolean);
    const conditions = ids.flatMap((id) => {
      const match = [{ id }];
      if (mongoose.Types.ObjectId.isValid(id)) match.push({ _id: id });
      return match;
    });

    const medicines = await Medicine.find({ $or: conditions }).lean();

    res.status(200).json({
      success: true,
      medicines,
    });
  } catch (error) {
    console.error("Error in compareMedicines:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getMedicines,
  getMedicineById,
  getAlternatives,
  getPopularMedicines,
  getCategories,
  compareMedicines,
};
