const mongoose = require("mongoose");
const crypto = require("crypto");

const translationCacheSchema = new mongoose.Schema(
  {
    hash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    sourceText: {
      type: String,
      required: true,
    },
    sourceLang: {
      type: String,
      default: "en",
    },
    targetLang: {
      type: String,
      required: true,
      index: true,
    },
    translatedText: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      default: "api",
    },
  },
  {
    timestamps: true,
  }
);

// Helper function to generate hash for text + targetLang
translationCacheSchema.statics.generateHash = function (text, targetLang, sourceLang = "en") {
  const normText = (text || "").trim();
  const normTarget = (targetLang || "").trim().toLowerCase();
  const normSource = (sourceLang || "en").trim().toLowerCase();
  return crypto.createHash("sha256").update(`${normSource}:${normTarget}:${normText}`).digest("hex");
};

module.exports = mongoose.model("TranslationCache", translationCacheSchema);
