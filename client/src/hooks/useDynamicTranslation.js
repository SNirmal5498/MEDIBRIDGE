import { useState, useEffect } from "react";
import { useLanguage } from "./useLanguage";
import {
  translateText,
  translateTexts,
  translateObject,
  translateMedicine,
  translatePharmacy,
  translateEmergencyCard,
} from "../services/translationService";

/**
 * React hook to dynamically translate content (strings, arrays, or objects) via MediBridge Translation API
 */
export function useDynamicTranslation(content, type = "text", fields = []) {
  const { language } = useLanguage();
  const targetLang = language?.code || "en";

  const [data, setData] = useState(content);
  const [loading, setLoading] = useState(targetLang !== "en" && Boolean(content));
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // English source language or empty content: immediate return without API overhead
    if (!content || targetLang === "en") {
      setData(content);
      setLoading(false);
      setError(null);
      return;
    }

    async function performTranslation() {
      if (isMounted) setLoading(true);

      try {
        let result = content;

        if (type === "text" && typeof content === "string") {
          result = await translateText(content, targetLang);
        } else if (type === "texts" && Array.isArray(content)) {
          result = await translateTexts(content, targetLang);
        } else if (type === "medicine") {
          result = await translateMedicine(content, targetLang);
        } else if (type === "medicines" && Array.isArray(content)) {
          result = await Promise.all(content.map((m) => translateMedicine(m, targetLang)));
        } else if (type === "pharmacy") {
          result = await translatePharmacy(content, targetLang);
        } else if (type === "pharmacies" && Array.isArray(content)) {
          result = await Promise.all(content.map((p) => translatePharmacy(p, targetLang)));
        } else if (type === "emergency") {
          result = await translateEmergencyCard(content, targetLang);
        } else if (type === "emergencies" && Array.isArray(content)) {
          result = await Promise.all(content.map((e) => translateEmergencyCard(e, targetLang)));
        } else if (type === "object" && typeof content === "object") {
          result = await translateObject(content, fields, targetLang);
        }

        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        console.warn("useDynamicTranslation error:", err);
        if (isMounted) {
          setData(content); // Safe fallback to source content
          setError(err.message || "Translation unavailable");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    performTranslation();

    return () => {
      isMounted = false;
    };
  }, [content, targetLang, type, JSON.stringify(fields)]);

  return { data, loading, error };
}
