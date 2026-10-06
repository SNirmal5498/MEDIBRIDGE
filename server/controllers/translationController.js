const { translateText, translateArray, translateObject, SUPPORTED_LANGUAGES } = require("../utils/translator");
const TranslationCache = require("../models/TranslationCache");

/**
 * Translate single or batch text
 * POST /api/translation/translate
 * Body: { text: "...", targetLang: "ta", sourceLang: "en" }
 * OR:   { texts: ["...", "..."], targetLang: "hi" }
 */
const translate = async (req, res) => {
  try {
    const { text, texts, targetLang = "en", sourceLang = "en" } = req.body;

    if (!targetLang || targetLang === "en") {
      return res.status(200).json({
        success: true,
        targetLang: "en",
        translated: text || texts || "",
      });
    }

    if (texts && Array.isArray(texts)) {
      const translatedList = await translateArray(texts, targetLang, sourceLang);
      return res.status(200).json({
        success: true,
        targetLang,
        translated: translatedList,
      });
    }

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        success: false,
        message: "String 'text' or array 'texts' is required in request body",
      });
    }

    const translatedText = await translateText(text, targetLang, sourceLang);

    res.status(200).json({
      success: true,
      targetLang,
      translated: translatedText,
    });
  } catch (error) {
    console.error("Error in translationController.translate:", error);
    res.status(500).json({
      success: false,
      message: "Translation failed",
      fallback: req.body.text || req.body.texts || "",
      error: error.message,
    });
  }
};

/**
 * Translate dynamic object fields
 * POST /api/translation/object
 * Body: { object: { ... }, fields: ["description", "uses"], targetLang: "ta" }
 */
const translateObjectEndpoint = async (req, res) => {
  try {
    const { object, fields, targetLang = "en", sourceLang = "en" } = req.body;

    if (!object || typeof object !== "object" || !Array.isArray(fields)) {
      return res.status(400).json({
        success: false,
        message: "'object' and 'fields' array are required",
      });
    }

    if (targetLang === "en") {
      return res.status(200).json({
        success: true,
        targetLang: "en",
        translatedObject: object,
      });
    }

    const translatedObj = await translateObject(object, fields, targetLang, sourceLang);

    res.status(200).json({
      success: true,
      targetLang,
      translatedObject: translatedObj,
    });
  } catch (error) {
    console.error("Error in translateObjectEndpoint:", error);
    res.status(500).json({
      success: false,
      message: "Object translation failed",
      fallback: req.body.object || {},
      error: error.message,
    });
  }
};

/**
 * GET /api/translation/stats
 * Get cache stats and supported languages
 */
const getTranslationStats = async (req, res) => {
  try {
    const cacheCount = await TranslationCache.countDocuments();
    const activeProvider = process.env.GOOGLE_TRANSLATE_API_KEY
      ? "Google Cloud Translation API"
      : process.env.LIBRETRANSLATE_API_URL
      ? "LibreTranslate API"
      : "MyMemory / Google Free Translation Engine";

    res.status(200).json({
      success: true,
      supportedLanguages: SUPPORTED_LANGUAGES,
      totalCachedTranslations: cacheCount,
      activeProvider,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    });
  }
};

module.exports = {
  translate,
  translateObjectEndpoint,
  getTranslationStats,
};
