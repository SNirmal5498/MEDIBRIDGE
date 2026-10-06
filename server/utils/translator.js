const axios = require("axios");
const TranslationCache = require("../models/TranslationCache");

// In-memory cache map for lightning-fast microsecond lookups
const memoryCache = new Map();

// Supported target languages
const SUPPORTED_LANGUAGES = ["en", "hi", "ta", "te", "ml", "kn"];

/**
 * Check if text contains non-translatable technical content only
 */
function shouldSkipTranslation(text, targetLang) {
  if (!text || typeof text !== "string") return true;
  const trimmed = text.trim();
  if (!trimmed) return true;
  if (targetLang === "en") return true;
  // If text is purely numbers, symbols, emails, or short codes
  if (/^[\d\s.,\/#!$%\^&\*;:{}=\-_`~()]+$/.test(trimmed)) return true;
  if (/^https?:\/\//i.test(trimmed)) return true;
  if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) return true;
  return false;
}

/**
 * Call external Translation API depending on available environment variables & fallback
 */
async function fetchTranslationFromAPI(text, targetLang, sourceLang = "en") {
  const provider = (process.env.TRANSLATION_PROVIDER || "auto").toLowerCase();
  const googleApiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  const libreApiUrl = process.env.LIBRETRANSLATE_API_URL;
  const libreApiKey = process.env.LIBRETRANSLATE_API_KEY;

  // 1. Google Cloud Translation API (if API Key provided)
  if (googleApiKey && (provider === "google" || provider === "auto")) {
    try {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=${googleApiKey}`,
        {
          q: text,
          source: sourceLang,
          target: targetLang,
          format: "text",
        },
        { timeout: 5000 }
      );
      if (response.data?.data?.translations?.[0]?.translatedText) {
        return response.data.data.translations[0].translatedText;
      }
    } catch (err) {
      console.warn("Google Cloud Translation API error:", err.message);
    }
  }

  // 2. LibreTranslate API (if custom URL/Key provided)
  if (libreApiUrl && (provider === "libretranslate" || provider === "auto")) {
    try {
      const response = await axios.post(
        `${libreApiUrl.replace(/\/$/, "")}/translate`,
        {
          q: text,
          source: sourceLang,
          target: targetLang,
          format: "text",
          api_key: libreApiKey || undefined,
        },
        { timeout: 5000 }
      );
      if (response.data?.translatedText) {
        return response.data.translatedText;
      }
    } catch (err) {
      console.warn("LibreTranslate API error:", err.message);
    }
  }

  // 3. MyMemory Translation API (Free Public API requiring no secret key)
  try {
    const langpair = `${sourceLang}|${targetLang}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langpair)}`;
    const response = await axios.get(url, { timeout: 4000 });
    
    if (
      response.data?.responseData?.translatedText &&
      response.data.responseData.match > 0.3 &&
      !response.data.responseData.translatedText.includes("MYMEMORY WARNING")
    ) {
      return response.data.responseData.translatedText;
    }
  } catch (err) {
    console.warn("MyMemory Translation API error:", err.message);
  }

  // 4. Google Translate Public Free Endpoint (Fallback)
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await axios.get(url, { timeout: 4000 });
    if (response.data && Array.isArray(response.data[0])) {
      const translatedParts = response.data[0].map((part) => part[0]).filter(Boolean);
      if (translatedParts.length > 0) {
        return translatedParts.join("");
      }
    }
  } catch (err) {
    console.warn("Google Translate Public endpoint error:", err.message);
  }

  // Ultimate fallback: return original text safely
  return text;
}

/**
 * Translate a single text string with multi-level caching (Memory -> MongoDB -> API)
 */
async function translateText(text, targetLang = "en", sourceLang = "en") {
  if (shouldSkipTranslation(text, targetLang)) {
    return text;
  }

  const cleanText = text.trim();
  const hash = TranslationCache.generateHash(cleanText, targetLang, sourceLang);

  // Level 1: In-memory cache check
  if (memoryCache.has(hash)) {
    return memoryCache.get(hash);
  }

  // Level 2: MongoDB Cache check
  try {
    const cachedDoc = await TranslationCache.findOne({ hash }).lean();
    if (cachedDoc && cachedDoc.translatedText) {
      memoryCache.set(hash, cachedDoc.translatedText);
      return cachedDoc.translatedText;
    }
  } catch (err) {
    console.warn("MongoDB TranslationCache query error:", err.message);
  }

  // Level 3: Call Translation API
  const translated = await fetchTranslationFromAPI(cleanText, targetLang, sourceLang);

  // Store result in memory and DB cache
  memoryCache.set(hash, translated);

  if (translated !== cleanText) {
    TranslationCache.create({
      hash,
      sourceText: cleanText,
      sourceLang,
      targetLang,
      translatedText: translated,
    }).catch(() => {
      // Ignore duplicate key or async db write error
    });
  }

  return translated;
}

/**
 * Translate an array of text strings concurrently
 */
async function translateArray(arr, targetLang = "en", sourceLang = "en") {
  if (!Array.isArray(arr) || arr.length === 0 || targetLang === "en") {
    return arr || [];
  }
  return Promise.all(arr.map((item) => (typeof item === "string" ? translateText(item, targetLang, sourceLang) : item)));
}

/**
 * Translate dynamic fields of an object safely
 */
async function translateObject(obj, fieldKeys, targetLang = "en", sourceLang = "en") {
  if (!obj || typeof obj !== "object" || targetLang === "en") {
    return obj;
  }

  const result = Array.isArray(obj) ? [...obj] : { ...obj };

  for (const key of fieldKeys) {
    if (result[key] !== undefined && result[key] !== null) {
      if (typeof result[key] === "string") {
        result[key] = await translateText(result[key], targetLang, sourceLang);
      } else if (Array.isArray(result[key])) {
        result[key] = await translateArray(result[key], targetLang, sourceLang);
      } else if (typeof result[key] === "object") {
        // Handle nested objects like dosage { adults, children, missedDose, overdose }
        const nestedKeys = Object.keys(result[key]);
        const updatedNested = { ...result[key] };
        for (const nKey of nestedKeys) {
          if (typeof updatedNested[nKey] === "string") {
            updatedNested[nKey] = await translateText(updatedNested[nKey], targetLang, sourceLang);
          } else if (Array.isArray(updatedNested[nKey])) {
            updatedNested[nKey] = await translateArray(updatedNested[nKey], targetLang, sourceLang);
          }
        }
        result[key] = updatedNested;
      }
    }
  }

  return result;
}

/**
 * Translate a complete medicine object for target language
 */
async function translateMedicine(medicine, targetLang = "en") {
  if (!medicine || targetLang === "en") return medicine;

  const fieldsToTranslate = [
    "description",
    "uses",
    "howItWorks",
    "dosage",
    "sideEffects",
    "warnings",
    "contraindications",
    "interactions",
    "foodInteractions",
    "storage",
  ];

  return translateObject(medicine, fieldsToTranslate, targetLang);
}

module.exports = {
  translateText,
  translateArray,
  translateObject,
  translateMedicine,
  SUPPORTED_LANGUAGES,
};
