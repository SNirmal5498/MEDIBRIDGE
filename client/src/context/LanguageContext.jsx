import { useState, useCallback, useMemo, useContext } from "react";
import { LANGUAGES } from "../utils/constants";
import { translate } from "../i18n/translations";
import { LanguageContext } from "./LanguageContextObject";

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const stored = localStorage.getItem("medibridge_language");
    return LANGUAGES.find((l) => l.code === stored) || LANGUAGES[0];
  });

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    localStorage.setItem("medibridge_language", lang.code);
  }, []);

  const t = useCallback((key, params) => translate(language.code, key, params), [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}