import { useState, useEffect, useRef } from "react";
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
 * Includes stable key tracking to prevent infinite request loops on object re-renders.
 */
export function useDynamicTranslation(content, type = "text", fields = []) {
  const { language } = useLanguage();
  const targetLang = language?.code || "en";

  const [data, setData] = useState(targetLang === "en" ? content : null);
  const [loading, setLoading] = useState(targetLang !== "en" && Boolean(content));
  const [error, setError] = useState(null);

  const contentRef = useRef(content);
  contentRef.current = content;

  // Generate stable content identifier to prevent object reference re-render loops
  const contentKey = typeof content === "object" && content !== null
    ? (content.id || content._id || content.brand || content.name || "")
    : String(content || "");

  const fieldsKey = JSON.stringify(fields);

  useEffect(() => {
    let isMounted = true;
    const activeTargetLang = targetLang;
    const activeContent = contentRef.current;

    // English source language or empty content: immediate return without API overhead
    if (!activeContent || activeTargetLang === "en") {
      setData(activeContent);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);

    async function performTranslation() {
      try {
        let result = activeContent;

        if (type === "text" && typeof activeContent === "string") {
          result = await translateText(activeContent, activeTargetLang);
        } else if (type === "texts" && Array.isArray(activeContent)) {
          result = await translateTexts(activeContent, activeTargetLang);
        } else if (type === "medicine") {
          result = await translateMedicine(activeContent, activeTargetLang);
        } else if (type === "medicines" && Array.isArray(activeContent)) {
          result = await Promise.all(activeContent.map((m) => translateMedicine(m, activeTargetLang)));
        } else if (type === "pharmacy") {
          result = await translatePharmacy(activeContent, activeTargetLang);
        } else if (type === "pharmacies" && Array.isArray(activeContent)) {
          result = await Promise.all(activeContent.map((p) => translatePharmacy(p, activeTargetLang)));
        } else if (type === "emergency") {
          result = await translateEmergencyCard(activeContent, activeTargetLang);
        } else if (type === "emergencies" && Array.isArray(activeContent)) {
          result = await Promise.all(activeContent.map((e) => translateEmergencyCard(e, activeTargetLang)));
        } else if (type === "object" && typeof activeContent === "object") {
          result = await translateObject(activeContent, fields, activeTargetLang);
        }

        if (isMounted && activeTargetLang === targetLang) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        console.warn("useDynamicTranslation error:", err);
        if (isMounted && activeTargetLang === targetLang) {
          setData(activeContent); // Safe fallback to source content
          setError(err.message || "Translation unavailable");
        }
      } finally {
        if (isMounted && activeTargetLang === targetLang) {
          setLoading(false);
        }
      }
    }

    performTranslation();

    return () => {
      isMounted = false;
    };
  }, [contentKey, targetLang, type, fieldsKey]);

  // Handle immediate update if target language is English
  useEffect(() => {
    if (targetLang === "en") {
      setData(content);
      setLoading(false);
    }
  }, [content, targetLang]);

  return { data: targetLang === "en" ? content : data, loading, error };
}
