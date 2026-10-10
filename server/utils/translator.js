const axios = require("axios");
const TranslationCache = require("../models/TranslationCache");

// In-memory cache map for lightning-fast microsecond lookups
const memoryCache = new Map();

// In-flight request deduplication map (hash -> Promise<string|null>)
const inFlightRequests = new Map();

// Provider cooldown tracking map (providerName -> { cooldownUntil: number, backoffSec: number })
const providerCooldowns = new Map();

// Supported target languages
const SUPPORTED_LANGUAGES = ["en", "hi", "ta", "te", "ml", "kn"];

const COOLDOWN_BASE_SEC = 60;
const COOLDOWN_MAX_SEC = 600;

/**
 * Check if provider is currently on rate-limit cooldown
 */
function isProviderAvailable(providerName) {
  const info = providerCooldowns.get(providerName);
  if (!info) return true;
  return Date.now() >= info.cooldownUntil;
}

/**
 * Put provider on cooldown when encountering HTTP 429 or rate limits
 */
function handleProviderRateLimit(providerName, error) {
  const now = Date.now();
  const current = providerCooldowns.get(providerName) || { backoffSec: COOLDOWN_BASE_SEC };

  let retryAfterSec = null;
  if (error.response?.headers?.["retry-after"]) {
    const val = parseInt(error.response.headers["retry-after"], 10);
    if (!isNaN(val) && val > 0) {
      retryAfterSec = val;
    }
  }

  const rawBackoff = retryAfterSec || current.backoffSec * 2;
  const backoff = Math.min(COOLDOWN_MAX_SEC, Math.max(COOLDOWN_BASE_SEC, rawBackoff));
  const jitter = Math.floor(Math.random() * 5);
  const cooldownSec = backoff + jitter;
  const cooldownUntil = now + cooldownSec * 1000;

  const wasAvailable = isProviderAvailable(providerName);
  providerCooldowns.set(providerName, { cooldownUntil, backoffSec: backoff });

  if (wasAvailable) {
    const status = error.response?.status || "429";
    console.warn(`[Translator] Provider '${providerName}' rate limited (HTTP ${status}). Cooldown for ${cooldownSec}s.`);
  }
}

/**
 * Reset provider backoff on successful response
 */
function resetProviderStatus(providerName) {
  if (providerCooldowns.has(providerName)) {
    providerCooldowns.delete(providerName);
  }
}

/**
 * Check if text contains non-translatable technical content only
 */
function shouldSkipTranslation(text, targetLang) {
  if (!text || typeof text !== "string") return true;
  const trimmed = text.trim();
  if (!trimmed) return true;
  if (targetLang === "en") return true;
  if (/^[\d\s.,\/#!$%\^&\*;:{}=\-_`~()]+$/.test(trimmed)) return true;
  if (/^https?:\/\//i.test(trimmed)) return true;
  if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) return true;
  return false;
}

/**
 * Call external Translation API with eligible provider fallback sequence
 */
async function fetchTranslationFromAPI(text, targetLang, sourceLang = "en") {
  const providerConfig = (process.env.TRANSLATION_PROVIDER || "auto").toLowerCase();
  const googleApiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  const libreApiUrl = process.env.LIBRETRANSLATE_API_URL;
  const libreApiKey = process.env.LIBRETRANSLATE_API_KEY;

  // 1. Google Cloud Translation API (if API Key provided)
  if (googleApiKey && (providerConfig === "google" || providerConfig === "auto") && isProviderAvailable("google_cloud")) {
    try {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=${googleApiKey}`,
        { q: text, source: sourceLang, target: targetLang, format: "text" },
        { timeout: 5000 }
      );
      if (response.data?.data?.translations?.[0]?.translatedText) {
        resetProviderStatus("google_cloud");
        return response.data.data.translations[0].translatedText;
      }
    } catch (err) {
      if (err.response?.status === 429 || err.response?.status === 403) {
        handleProviderRateLimit("google_cloud", err);
      }
    }
  }

  // 2. LibreTranslate API (if custom URL provided)
  if (libreApiUrl && (providerConfig === "libretranslate" || providerConfig === "auto") && isProviderAvailable("libretranslate")) {
    try {
      const response = await axios.post(
        `${libreApiUrl.replace(/\/$/, "")}/translate`,
        { q: text, source: sourceLang, target: targetLang, format: "text", api_key: libreApiKey || undefined },
        { timeout: 5000 }
      );
      if (response.data?.translatedText) {
        resetProviderStatus("libretranslate");
        return response.data.translatedText;
      }
    } catch (err) {
      if (err.response?.status === 429) {
        handleProviderRateLimit("libretranslate", err);
      }
    }
  }

  // 3. MyMemory Translation API (Public Fallback)
  if (isProviderAvailable("mymemory")) {
    try {
      const langpair = `${sourceLang}|${targetLang}`;
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langpair)}`;
      const response = await axios.get(url, { timeout: 4000 });
      if (
        response.data?.responseData?.translatedText &&
        response.data.responseData.match > 0.3 &&
        !response.data.responseData.translatedText.includes("MYMEMORY WARNING")
      ) {
        resetProviderStatus("mymemory");
        return response.data.responseData.translatedText;
      }
    } catch (err) {
      if (err.response?.status === 429) {
        handleProviderRateLimit("mymemory", err);
      }
    }
  }

  // 4. Google Translate Public Free Endpoint (Fallback)
  if (isProviderAvailable("google_free")) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      const response = await axios.get(url, { timeout: 4000 });
      if (response.data && Array.isArray(response.data[0])) {
        const translatedParts = response.data[0].map((part) => part[0]).filter(Boolean);
        if (translatedParts.length > 0) {
          resetProviderStatus("google_free");
          return translatedParts.join("");
        }
      }
    } catch (err) {
      if (err.response?.status === 429) {
        handleProviderRateLimit("google_free", err);
      }
    }
  }

  // Every provider is either on cooldown or failed -> return null to signal failure
  return null;
}

/**
 * Translate a single text string with multi-level caching & in-flight deduplication
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
    // Ignore DB query error
  }

  // Level 3: In-flight deduplication check
  if (inFlightRequests.has(hash)) {
    const inFlightResult = await inFlightRequests.get(hash);
    return inFlightResult || cleanText;
  }

  // Level 4: Execute Call to Translation API providers
  const fetchPromise = (async () => {
    try {
      return await fetchTranslationFromAPI(cleanText, targetLang, sourceLang);
    } catch (e) {
      return null;
    } finally {
      inFlightRequests.delete(hash);
    }
  })();

  inFlightRequests.set(hash, fetchPromise);
  const translated = await fetchPromise;

  // Cache ONLY valid successful translations
  if (translated && typeof translated === "string" && translated !== cleanText) {
    memoryCache.set(hash, translated);
    TranslationCache.create({
      hash,
      sourceText: cleanText,
      sourceLang,
      targetLang,
      translatedText: translated,
    }).catch(() => {});
    return translated;
  }

  // Fallback: return original text without caching failure
  return cleanText;
}

/**
 * Translate an array of text strings concurrently with deduplication
 */
async function translateArray(arr, targetLang = "en", sourceLang = "en") {
  if (!Array.isArray(arr) || arr.length === 0 || targetLang === "en") {
    return arr || [];
  }
  return Promise.all(arr.map((item) => (typeof item === "string" ? translateText(item, targetLang, sourceLang) : item)));
}

/**
 * Translate dynamic fields of an object with string deduplication
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
    "name",
    "brand",
    "genericName",
    "composition",
    "activeIngredients",
    "manufacturer",
    "dosageForm",
    "form",
    "strength",
    "packSize",
    "category",
    "shortDescription",
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

