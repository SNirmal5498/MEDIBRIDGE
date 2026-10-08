const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    genericName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    composition: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    activeIngredients: {
      type: [String],
      default: [],
    },
    strength: {
      type: String,
      default: "",
      trim: true,
    },
    dosageForm: {
      type: String,
      default: "Tablet",
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    manufacturer: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    packSize: {
      type: String,
      default: "1 Strip",
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    prescriptionRequired: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },
    otc: {
      type: Boolean,
      required: true,
      default: true,
      index: true,
    },
    rating: {
      type: Number,
      default: 4.2,
      min: 0,
      max: 5,
    },
    popularity: {
      type: Number,
      default: 50,
      index: true,
    },
    description: {
      type: String,
      default: "",
    },
    uses: {
      type: [String],
      default: [],
    },
    howItWorks: {
      type: String,
      default: "",
    },
    dosage: {
      adults: { type: String, default: "" },
      children: { type: String, default: "" },
      missedDose: { type: String, default: "" },
      overdose: { type: String, default: "" },
    },
    sideEffects: {
      common: { type: [String], default: [] },
      rare: { type: [String], default: [] },
    },
    warnings: {
      pregnancy: { type: String, default: "" },
      breastfeeding: { type: String, default: "" },
      kidneyDisease: { type: String, default: "" },
      liverDisease: { type: String, default: "" },
      alcohol: { type: String, default: "" },
      driving: { type: String, default: "" },
    },
    contraindications: {
      type: [String],
      default: [],
    },
    interactions: {
      type: [String],
      default: [],
    },
    foodInteractions: {
      beforeFood: { type: String, default: "As directed by physician." },
      afterFood: { type: String, default: "Preferred after meals if gastrointestinal discomfort occurs." },
      avoid: { type: [String], default: [] },
    },
    storage: {
      type: String,
      default: "Store below 30°C in a dry place away from direct sunlight.",
    },
    alternatives: {
      type: [String],
      default: [],
    },
    badges: {
      bestSeller: { type: Boolean, default: false },
      topRated: { type: Boolean, default: false },
      lowestPrice: { type: Boolean, default: false },
    },
    image: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for powerful partial / keyword search
medicineSchema.index({
  brand: "text",
  genericName: "text",
  name: "text",
  composition: "text",
  manufacturer: "text",
  category: "text",
});

// Sync otc with prescriptionRequired before validation
medicineSchema.pre("validate", function () {
  if (this.prescriptionRequired !== undefined) {
    this.otc = !this.prescriptionRequired;
  } else if (this.otc !== undefined) {
    this.prescriptionRequired = !this.otc;
  }
});

module.exports = mongoose.model("Medicine", medicineSchema);
