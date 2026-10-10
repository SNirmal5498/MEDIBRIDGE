import api from "./api.js";

// Client-side in-memory cache map
const clientCache = new Map();

// Client-side in-flight request deduplication map
const clientInFlight = new Map();

// Helper hash generator: includes sourceLang and targetLang
function getCacheKey(text, targetLang, sourceLang = "en") {
  if (typeof text !== "string") return "";
  const s = (sourceLang || "en").toLowerCase().trim();
  const t = (targetLang || "en").toLowerCase().trim();
  return `${s}:${t}:${text.trim()}`;
}

/**
 * Translate a single string using backend Translation API with client-side caching
 */
export async function translateText(text, targetLang = "en", sourceLang = "en") {
  if (!text || typeof text !== "string" || !text.trim() || targetLang === "en") {
    return text || "";
  }

  const cacheKey = getCacheKey(text, targetLang, sourceLang);

  // 1. Check in-memory cache
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey);
  }

  // 2. Check sessionStorage
  try {
    const cachedSession = sessionStorage.getItem(`mb_trans_${cacheKey}`);
    if (cachedSession) {
      clientCache.set(cacheKey, cachedSession);
      return cachedSession;
    }
  } catch (e) {
    // ignore session storage error
  }

  // 3. Check in-flight request deduplication
  if (clientInFlight.has(cacheKey)) {
    return await clientInFlight.get(cacheKey);
  }

  // 4. Call MediBridge Backend Translation Endpoint
  const requestPromise = (async () => {
    try {
      const response = await api.post("/translation/translate", {
        text: text.trim(),
        targetLang,
        sourceLang,
      });

      if (response.data && response.data.translated) {
        const result = response.data.translated;
        // Only cache if valid non-empty translation was returned
        if (result && (result !== text.trim() || targetLang === "en")) {
          clientCache.set(cacheKey, result);
          try {
            sessionStorage.setItem(`mb_trans_${cacheKey}`, result);
          } catch (e) {
            // ignore storage quota error
          }
        }
        return result;
      }
    } catch (error) {
      console.warn("Backend Translation API call failed, falling back to source text:", error.message);
    } finally {
      clientInFlight.delete(cacheKey);
    }

    return text;
  })();

  clientInFlight.set(cacheKey, requestPromise);
  return await requestPromise;
}

/**
 * Translate an array of text strings
 */
export async function translateTexts(texts, targetLang = "en", sourceLang = "en") {
  if (!Array.isArray(texts) || texts.length === 0 || targetLang === "en") {
    return texts || [];
  }

  try {
    const response = await api.post("/translation/translate", {
      texts,
      targetLang,
      sourceLang,
    });

    if (response.data && Array.isArray(response.data.translated)) {
      return response.data.translated;
    }
  } catch (error) {
    console.warn("Backend Translation Batch API call failed:", error.message);
  }

  return texts;
}

/**
 * Translate an object's dynamic fields with object-level caching
 */
export async function translateObject(object, fields, targetLang = "en", sourceLang = "en") {
  if (!object || typeof object !== "object" || targetLang === "en" || !Array.isArray(fields)) {
    return object;
  }

  const objId = object.id || object._id || object.brand || object.name || "";
  const objectCacheKey = `obj:${sourceLang.toLowerCase()}:${targetLang.toLowerCase()}:${objId}:${JSON.stringify(fields)}`;

  if (clientCache.has(objectCacheKey)) {
    return clientCache.get(objectCacheKey);
  }

  if (clientInFlight.has(objectCacheKey)) {
    return await clientInFlight.get(objectCacheKey);
  }

  const requestPromise = (async () => {
    try {
      const response = await api.post("/translation/object", {
        object,
        fields,
        targetLang,
        sourceLang,
      });

      if (response.data && response.data.translatedObject) {
        const result = response.data.translatedObject;
        if (response.data.success && !response.data.fallback) {
          clientCache.set(objectCacheKey, result);
        }
        return result;
      }
    } catch (error) {
      console.warn("Backend Translate Object API call failed:", error.message);
    } finally {
      clientInFlight.delete(objectCacheKey);
    }

    return object;
  })();

  clientInFlight.set(objectCacheKey, requestPromise);
  return await requestPromise;
}

/**
 * Translate full Medicine object
 */
export async function translateMedicine(medicine, targetLang = "en") {
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

/**
 * Translate Pharmacy object
 */
export async function translatePharmacy(pharmacy, targetLang = "en") {
  if (!pharmacy || targetLang === "en") return pharmacy;
  return translateObject(pharmacy, ["addressText", "openingHoursText", "availabilityText", "deliveryInfo", "instructions"], targetLang);
}

/**
 * Translate First Aid / Emergency card
 */
export async function translateEmergencyCard(card, targetLang = "en") {
  if (!card || targetLang === "en") return card;
  return translateObject(card, ["title", "description", "steps", "precautions"], targetLang);
}

export const translationService = {
  translateText,
  translateTexts,
  translateObject,
  translateMedicine,
  translatePharmacy,
  translateEmergencyCard,
};
