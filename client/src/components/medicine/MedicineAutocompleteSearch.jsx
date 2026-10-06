import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Pill, ArrowRight, SearchX, Loader2 } from "lucide-react";
import { getAllMedicines } from "../../utils/medicineData";
import { medicineService } from "../../services/medicineService";
import { useLanguage } from "../../hooks/useLanguage";
import {
  formatBrandName,
  formatGenericName,
  formatStrength,
  formatManufacturer,
} from "../../utils/formatters";

// Helper to escape regex special characters safely
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// Highlight matching search term in medicine text
function HighlightedText({ text, query, className = "" }) {
  if (!text) return null;
  if (!query || !query.trim()) return <span className={className}>{text}</span>;

  const safeQuery = escapeRegex(query.trim());
  const regex = new RegExp(`(${safeQuery})`, "gi");
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary/20 text-primary-hover font-extrabold px-0.5 rounded">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export default function MedicineAutocompleteSearch({
  value = "",
  onChange,
  onSelect,
  onSubmit,
  placeholder,
  className = "",
  autoFocus = false,
}) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [query, setQuery] = useState(value);
  const [debouncedQuery, setDebouncedQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  // Sync external value prop with internal query state
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Debounce user input (250ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Compute suggestions based on query
  const searchMedicines = useCallback(
    async (searchTerm) => {
      const q = searchTerm.trim().toLowerCase();
      if (!q || q.length < 1) {
        setSuggestions([]);
        setIsOpen(false);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const langCode = language.code;
        const allLocal = getAllMedicines();

        // 1. Filter local dataset with priority scoring
        const scoredLocal = [];
        const safeQ = escapeRegex(q);
        const regex = new RegExp(safeQ, "i");

        for (const med of allLocal) {
          const brandEn = (med.brand || med.name || "").toLowerCase();
          const genericEn = (med.genericName || "").toLowerCase();
          const brandLoc = formatBrandName(med.brand || med.name, langCode).toLowerCase();
          const genericLoc = formatGenericName(med.genericName, langCode).toLowerCase();
          const manufacturer = (med.manufacturer || "").toLowerCase();
          const category = (med.category || "").toLowerCase();
          const strength = (med.strength || "").toLowerCase();
          const usesStr = Array.isArray(med.uses) ? med.uses.join(" ").toLowerCase() : "";

          let score = 0;

          // Priority 1: Brand name starts with query
          if (brandEn.startsWith(q) || brandLoc.startsWith(q)) {
            score = 100;
          }
          // Priority 2: Generic name starts with query
          else if (genericEn.startsWith(q) || genericLoc.startsWith(q)) {
            score = 90;
          }
          // Priority 3: Brand contains query
          else if (brandEn.includes(q) || brandLoc.includes(q)) {
            score = 70;
          }
          // Priority 4: Generic contains query
          else if (genericEn.includes(q) || genericLoc.includes(q)) {
            score = 60;
          }
          // Priority 5: Manufacturer / category / strength
          else if (manufacturer.includes(q) || category.includes(q) || strength.includes(q)) {
            score = 40;
          }
          // Priority 6: Uses / description
          else if (usesStr.includes(q) || (med.description || "").toLowerCase().includes(q)) {
            score = 30;
          }

          if (score > 0) {
            scoredLocal.push({ med, score, popularity: med.popularity || 0 });
          }
        }

        // Sort by score DESC, popularity DESC, brand ASC
        scoredLocal.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          if (b.popularity !== a.popularity) return b.popularity - a.popularity;
          return (a.med.brand || "").localeCompare(b.med.brand || "");
        });

        let localResults = scoredLocal.map((s) => s.med);

        // 2. Fetch from backend API if available
        let apiResults = [];
        try {
          const res = await medicineService.search({ q: searchTerm, limit: 8 });
          if (res && Array.isArray(res.medicines)) {
            apiResults = res.medicines;
          }
        } catch (e) {
          // Graceful fallback to local results
        }

        // 3. Merge & deduplicate by ID
        const mergedMap = new Map();
        localResults.forEach((m) => mergedMap.set(m.id || m._id, m));
        apiResults.forEach((m) => {
          const key = m.id || m._id;
          if (!mergedMap.has(key)) {
            mergedMap.set(key, m);
          }
        });

        const finalSuggestions = Array.from(mergedMap.values()).slice(0, 8);
        setSuggestions(finalSuggestions);
        setIsOpen(true);
        setSelectedIndex(-1);
      } catch (err) {
        console.error("Autocomplete search error:", err);
      } finally {
        setLoading(false);
      }
    },
    [language.code]
  );

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= 1) {
      searchMedicines(debouncedQuery);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [debouncedQuery, searchMedicines]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const newVal = e.target.value;
    setQuery(newVal);
    if (onChange) onChange(newVal);
    if (!newVal.trim()) {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  // Select a suggestion
  const handleSelectMedicine = (med) => {
    const medName = formatBrandName(med.brand || med.name, language.code);
    setQuery(medName);
    if (onChange) onChange(medName);
    setIsOpen(false);
    setSelectedIndex(-1);

    if (onSelect) {
      onSelect(med);
    } else {
      // Default behavior: navigate to medicine details
      navigate(`/medicine/${med.id || med._id}`);
    }
  };

  // Submit search query
  const handlePerformSearch = (searchQuery) => {
    setIsOpen(false);
    setSelectedIndex(-1);
    if (onSubmit) {
      onSubmit(searchQuery);
    } else {
      navigate(searchQuery ? `/medicine?q=${encodeURIComponent(searchQuery)}` : "/medicine");
    }
  };

  // Keyboard Navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen && suggestions.length > 0) {
        setIsOpen(true);
        return;
      }
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) return;
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (isOpen && selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelectMedicine(suggestions[selectedIndex]);
      } else {
        handlePerformSearch(query);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const clearInput = () => {
    setQuery("");
    if (onChange) onChange("");
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-text-muted shrink-0 pointer-events-none" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim().length >= 1 && suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder={placeholder || t("filter.searchPlaceholder")}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          className="w-full rounded-2xl border border-border bg-card py-3.5 pl-11 pr-11 text-sm sm:text-base
            text-text placeholder:text-text-muted shadow-card focus:outline-none focus:ring-2 focus:ring-primary/40
            focus:border-primary transition-all duration-150"
        />

        {loading ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          </div>
        ) : query ? (
          <button
            type="button"
            onClick={clearInput}
            aria-label={t("common.close") || "Clear"}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 grid place-items-center w-6 h-6 rounded-full
              text-text-muted hover:text-text hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {/* Suggestion Dropdown */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-2xl border border-border
            bg-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {suggestions.length > 0 ? (
            <div>
              <div className="px-4 py-2 bg-slate-50/80 border-b border-border flex items-center justify-between text-xs font-semibold text-text-muted">
                <span>{t("autocomplete.suggestionsHeader")}</span>
                <span className="text-[11px] font-normal text-text-muted">{t("medicine.resultsFound", { count: suggestions.length })}</span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {suggestions.map((med, index) => {
                  const brandFormatted = formatBrandName(med.brand || med.name, language.code);
                  const genericFormatted = formatGenericName(med.genericName, language.code);
                  const strengthFormatted = formatStrength(med.strength, language.code);
                  const isHighlighted = selectedIndex === index;

                  return (
                    <div
                      key={med.id || med._id || index}
                      role="option"
                      aria-selected={isHighlighted}
                      onClick={() => handleSelectMedicine(med)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors ${
                        isHighlighted
                          ? "bg-primary-50 text-primary-hover border-l-4 border-primary pl-3"
                          : "hover:bg-slate-50 text-text"
                      }`}
                    >
                      {/* Medicine Icon */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isHighlighted ? "bg-primary text-white" : "bg-primary-50 text-primary"
                        }`}
                      >
                        <Pill className="w-4 h-4" />
                      </div>

                      {/* Medicine Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-semibold text-text truncate">
                            <HighlightedText text={brandFormatted} query={query} />
                          </h4>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                              med.otc ? "bg-primary-50 text-primary-hover" : "bg-danger-50 text-danger"
                            }`}
                          >
                            {med.otc ? t("medicine.otc") : t("medicine.prescription")}
                          </span>
                        </div>

                        <p className="text-xs text-text-muted truncate mt-0.5">
                          <HighlightedText text={genericFormatted} query={query} />
                          {strengthFormatted ? ` · ${strengthFormatted}` : ""}
                          {med.manufacturer ? ` (${formatManufacturer(med.manufacturer, language.code)})` : ""}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-primary">₹{med.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View All Results Footer */}
              <button
                type="button"
                onClick={() => handlePerformSearch(query)}
                className="w-full px-4 py-3 bg-slate-50 hover:bg-primary-50 text-primary hover:text-primary-hover text-xs font-semibold flex items-center justify-between border-t border-border transition-colors"
              >
                <span>{t("autocomplete.viewAllResults")} &quot;{query}&quot;</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : query.trim().length >= 2 && !loading ? (
            /* No Results Found State */
            <div className="p-6 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-slate-100 flex items-center justify-center text-text-muted">
                <SearchX className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-text">{t("autocomplete.noResults")}</p>
              <p className="text-xs text-text-muted mt-1">{t("autocomplete.noResultsDesc")}</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
