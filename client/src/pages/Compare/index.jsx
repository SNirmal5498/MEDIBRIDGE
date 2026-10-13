import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  X,
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowLeftRight,
  Info,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Pill,
  Check,
} from "lucide-react";
import { medicineService } from "../../services/medicineService";
import { useLanguage } from "../../hooks/useLanguage";
import {
  formatBrandName,
  formatGenericName,
  formatManufacturer,
  formatStrength,
  formatPackSize,
  formatDosageForm,
  formatMedicineText,
  formatCompositionPhrase,
} from "../../utils/formatters";
import { getMedicineDetailsPath } from "../../utils/routeHelpers";
import Button from "../../components/common/Button";

/**
 * Indicator component when information is unavailable
 */
function UnavailableIndicator({ text }) {
  const { t } = useLanguage();
  return (
    <span className="inline-flex items-center gap-1 text-xs italic text-text-muted bg-slate-100/90 px-2 py-0.5 rounded border border-slate-200/60 select-none">
      <Info className="w-3 h-3 text-text-muted/70 shrink-0" />
      <span>{text || t("compare.notAvailable") || "Information unavailable"}</span>
    </span>
  );
}

/**
 * Searchable Medicine Selector Combobox Component
 */
function SearchableMedicineSelect({
  value,
  selectedMedicine,
  onChange,
  exclude,
  options = [],
  loading = false,
  placeholder,
  langCode = "en",
  label,
}) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Find currently selected medicine object
  const currentSelected = useMemo(() => {
    if (!value) return null;
    if (selectedMedicine && (selectedMedicine.id === value || selectedMedicine._id === value)) {
      return selectedMedicine;
    }
    return options.find((m) => (m.id || m._id) === value) || null;
  }, [value, selectedMedicine, options]);

  // Filter options based on search query and exclude ID
  const filteredOptions = useMemo(() => {
    const valid = options.filter((m) => {
      const id = m.id || m._id;
      return id && id !== exclude;
    });

    const q = searchQuery.trim().toLowerCase();
    if (!q) return valid.slice(0, 50);

    const terms = q.split(/\s+/).filter(Boolean);
    const matched = valid.filter((m) => {
      const brand = (m.brand || m.name || "").toLowerCase();
      const generic = (m.genericName || "").toLowerCase();
      const composition = (m.composition || "").toLowerCase();
      const strength = (m.strength || "").toLowerCase();
      const form = (m.dosageForm || "").toLowerCase();

      return terms.every(
        (term) =>
          brand.includes(term) ||
          generic.includes(term) ||
          composition.includes(term) ||
          strength.includes(term) ||
          form.includes(term)
      );
    });

    return matched.slice(0, 50);
  }, [options, exclude, searchQuery]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleSelect = (med) => {
    const medId = med.id || med._id;
    onChange(medId);
    setIsOpen(false);
    setSearchQuery("");
    setHighlightedIndex(-1);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setSearchQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Selected Item View (when item is selected and dropdown is closed) */}
      {currentSelected && !isOpen ? (
        <div className="rounded-xl border border-primary/30 bg-primary-50/40 p-3.5 flex items-center justify-between gap-3 shadow-xs transition-all">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display font-bold text-sm sm:text-base text-text truncate">
                {formatBrandName(currentSelected.brand || currentSelected.name, langCode)}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {formatDosageForm(currentSelected.dosageForm, langCode) || "—"}
              </span>
              {currentSelected.strength && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary-100 text-primary-hover">
                  {formatStrength(currentSelected.strength, langCode)}
                </span>
              )}
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  currentSelected.otc ? "bg-emerald-100 text-emerald-800" : "bg-danger-50 text-danger"
                }`}
              >
                {currentSelected.otc ? t("compare.otc") || "OTC" : t("compare.rx") || "Prescription Required"}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1 truncate">
              {formatGenericName(currentSelected.genericName, langCode) || currentSelected.composition || "—"}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsOpen(true);
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-white text-text hover:bg-slate-50 transition-colors shadow-2xs"
            >
              {t("compare.changeMedicine") || "Change"}
            </button>
            <button
              type="button"
              onClick={handleClear}
              aria-label={t("compare.clearSelection") || "Clear"}
              className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger-50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Search Input Box */
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              disabled={loading}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!isOpen) setIsOpen(true);
                setHighlightedIndex(0);
              }}
              onFocus={() => {
                setIsOpen(true);
                setHighlightedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                loading
                  ? t("compare.loadingCatalog") || "Loading medicine catalog..."
                  : placeholder || t("compare.searchPlaceholder") || "Search by brand or generic name..."
              }
              className="w-full text-sm font-medium text-text border border-border rounded-xl pl-10 pr-10 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-xs disabled:bg-slate-50 disabled:text-text-muted transition-all"
            />
            {loading ? (
              <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary" />
            ) : searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  inputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-text-muted hover:text-text"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            )}
          </div>

          {/* Search Dropdown Panel */}
          {isOpen && (
            <div
              role="listbox"
              className="absolute left-0 right-0 top-full mt-1.5 z-50 overflow-hidden rounded-xl border border-border bg-white shadow-xl animate-in fade-in slide-in-from-top-1 duration-150"
            >
              <div className="px-3.5 py-2 bg-slate-50 border-b border-border flex items-center justify-between text-xs font-semibold text-text-muted">
                <span>{label}</span>
                <span className="font-normal text-[11px]">
                  {filteredOptions.length > 0 ? `${filteredOptions.length} available` : "0 matches"}
                </span>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((med, index) => {
                    const medId = med.id || med._id;
                    const brand = formatBrandName(med.brand || med.name, langCode);
                    const generic = formatGenericName(med.genericName, langCode);
                    const strength = formatStrength(med.strength, langCode);
                    const dosageForm = formatDosageForm(med.dosageForm, langCode);
                    const isHighlighted = highlightedIndex === index;
                    const isCurrent = value === medId;

                    return (
                      <div
                        key={medId}
                        role="option"
                        aria-selected={isCurrent}
                        onClick={() => handleSelect(med)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`p-3 text-left flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                          isHighlighted ? "bg-primary-50/70" : isCurrent ? "bg-slate-50" : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-text truncate">{brand}</span>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                          </div>
                          <p className="text-xs text-text-muted truncate mt-0.5">
                            {generic || med.composition || "—"}
                          </p>
                        </div>

                        {/* Attribute Badges: Strength and Dosage Form */}
                        <div className="flex items-center gap-1.5 shrink-0 text-right">
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {dosageForm || "—"}
                          </span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-primary-50 text-primary-hover">
                            {strength || "—"}
                          </span>
                          {med.price !== undefined && (
                            <span className="text-xs font-bold text-text-muted ml-1">₹{med.price}</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-sm text-text-muted">
                    {searchQuery
                      ? t("compare.noMedicinesFound", { query: searchQuery }) || `No medicines found matching "${searchQuery}"`
                      : t("compare.selectPrompt") || "Type to search medicines..."}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, language } = useLanguage();
  const langCode = language?.code || "en";

  const idA = searchParams.get("a") || "";
  const idB = searchParams.get("b") || "";

  const [medicineA, setMedicineA] = useState(null);
  const [medicineB, setMedicineB] = useState(null);
  const [options, setOptions] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [compareError, setCompareError] = useState(null);

  // Load live catalog options from backend API (no mock data)
  const loadOptions = useCallback(async () => {
    setOptionsLoading(true);
    setOptionsError(null);
    try {
      const res = await medicineService.search({
        limit: 1500,
        fields:
          "id,brand,name,genericName,composition,strength,dosageForm,category,manufacturer,price,otc,prescriptionRequired",
        lang: langCode,
      });
      const list = res?.medicines || res?.data;
      if (Array.isArray(list) && list.length > 0) {
        setOptions(list);
      } else {
        setOptionsError(t("compare.catalogError") || "Failed to load medicine catalog.");
      }
    } catch (e) {
      console.warn("Failed to load catalog options from API:", e);
      setOptionsError(e.message || t("compare.catalogError") || "Failed to load medicine list.");
    } finally {
      setOptionsLoading(false);
    }
  }, [langCode, t]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  // Load detailed comparison data for selected medicines
  const loadComparisons = useCallback(async () => {
    if (!idA && !idB) {
      setMedicineA(null);
      setMedicineB(null);
      setCompareError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setCompareError(null);

    // If both IDs are present, call real compare endpoint
    if (idA && idB) {
      try {
        const res = await medicineService.compare(idA, idB, langCode);
        const list = res?.medicines || res?.data || [];
        if (Array.isArray(list)) {
          const medA = list.find((m) => m.id === idA || m._id === idA);
          const medB = list.find((m) => m.id === idB || m._id === idB);

          if (medA) setMedicineA(medA);
          if (medB) setMedicineB(medB);

          if (medA && medB) {
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Compare endpoint failed, falling back to individual getById:", err);
      }
    }

    // Load individual medicine details if compare endpoint did not resolve both
    try {
      const promises = [];
      if (idA) {
        promises.push(
          medicineService
            .getById(idA, langCode)
            .then((res) => res?.medicine || res?.data)
            .catch(() => null)
        );
      } else {
        promises.push(Promise.resolve(null));
      }

      if (idB) {
        promises.push(
          medicineService
            .getById(idB, langCode)
            .then((res) => res?.medicine || res?.data)
            .catch(() => null)
        );
      } else {
        promises.push(Promise.resolve(null));
      }

      const [resA, resB] = await Promise.all(promises);
      setMedicineA(resA);
      setMedicineB(resB);
    } catch (e) {
      setCompareError(t("compare.compareError") || "Failed to load comparison data.");
    } finally {
      setLoading(false);
    }
  }, [idA, idB, langCode, t]);

  useEffect(() => {
    loadComparisons();
  }, [loadComparisons]);

  // Update URL search parameters and prevent duplicate selection
  function updateParam(key, value) {
    if (key === "a" && value && value === idB) return;
    if (key === "b" && value && value === idA) return;

    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  // Swap Medicine A and Medicine B
  function swapMedicines() {
    if (!idA && !idB) return;
    const next = new URLSearchParams(searchParams);
    if (idB) next.set("a", idB);
    else next.delete("a");
    if (idA) next.set("b", idA);
    else next.delete("b");
    setSearchParams(next);
  }

  // Format dosage instructions cleanly
  const formatDosageInfo = useCallback(
    (item) => {
      if (!item) return null;
      if (typeof item.dosage === "string" && item.dosage.trim()) {
        return formatMedicineText(item.dosage, langCode);
      }
      if (item.dosage && typeof item.dosage === "object") {
        const parts = [];
        if (item.dosage.adults) parts.push(`Adults: ${item.dosage.adults}`);
        if (item.dosage.children) parts.push(`Children: ${item.dosage.children}`);
        if (item.dosage.missedDose) parts.push(`Missed: ${item.dosage.missedDose}`);
        if (parts.length > 0) return parts.map((p) => formatMedicineText(p, langCode)).join(" | ");
      }
      return null;
    },
    [langCode]
  );

  // Format side effects safely
  const formatSideEffects = useCallback(
    (item) => {
      if (!item) return null;
      const se = item.sideEffects;
      if (Array.isArray(se) && se.length > 0) {
        return se.map((s) => formatMedicineText(s, langCode)).join(", ");
      }
      if (se && typeof se === "object") {
        const common = Array.isArray(se.common) ? se.common : [];
        if (common.length > 0) {
          return common.map((s) => formatMedicineText(s, langCode)).join(", ");
        }
      }
      if (typeof se === "string" && se.trim()) {
        return formatMedicineText(se, langCode);
      }
      return null;
    },
    [langCode]
  );

  // Format warnings and precautions safely
  const formatWarnings = useCallback(
    (item) => {
      if (!item) return null;
      const w = item.warnings;
      if (typeof w === "string" && w.trim()) {
        return formatMedicineText(w, langCode);
      }
      if (w && typeof w === "object") {
        const parts = [];
        if (w.pregnancy) parts.push(`Pregnancy: ${w.pregnancy}`);
        if (w.breastfeeding) parts.push(`Breastfeeding: ${w.breastfeeding}`);
        if (w.alcohol) parts.push(`Alcohol: ${w.alcohol}`);
        if (w.driving) parts.push(`Driving: ${w.driving}`);
        if (parts.length > 0) return parts.map((p) => formatMedicineText(p, langCode)).join(" | ");
      }
      return null;
    },
    [langCode]
  );

  // Comparison Rows Definition
  const rows = useMemo(() => {
    return [
      {
        key: "brand",
        label: t("compare.brand") || "Brand Name",
        render: (item) => {
          const val = formatBrandName(item.brand || item.name, langCode);
          return val ? <span className="font-semibold text-text">{val}</span> : <UnavailableIndicator />;
        },
        diffCheck: (a, b) => (a?.brand || a?.name || "").trim().toLowerCase() !== (b?.brand || b?.name || "").trim().toLowerCase(),
      },
      {
        key: "genericName",
        label: t("compare.genericName") || "Generic Name",
        render: (item) => {
          const val = formatGenericName(item.genericName, langCode);
          return val ? <span>{val}</span> : <UnavailableIndicator />;
        },
        diffCheck: (a, b) => (a?.genericName || "").trim().toLowerCase() !== (b?.genericName || "").trim().toLowerCase(),
      },
      {
        key: "composition",
        label: t("compare.composition") || "Composition",
        render: (item) => {
          const val = formatCompositionPhrase(item.composition || item.genericName, langCode);
          return val ? <span>{val}</span> : <UnavailableIndicator />;
        },
        diffCheck: (a, b) =>
          (a?.composition || a?.genericName || "").trim().toLowerCase() !==
          (b?.composition || b?.genericName || "").trim().toLowerCase(),
      },
      {
        key: "strength",
        label: t("compare.strength") || "Strength",
        render: (item) => {
          const val = formatStrength(item.strength, langCode);
          return val ? (
            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-hover">
              {val}
            </span>
          ) : (
            <UnavailableIndicator />
          );
        },
        diffCheck: (a, b) => (a?.strength || "").trim().toLowerCase() !== (b?.strength || "").trim().toLowerCase(),
      },
      {
        key: "dosageForm",
        label: t("compare.dosageForm") || "Dosage Form",
        render: (item) => {
          const val = formatDosageForm(item.dosageForm, langCode);
          return val ? (
            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800">
              {val}
            </span>
          ) : (
            <UnavailableIndicator />
          );
        },
        diffCheck: (a, b) => (a?.dosageForm || "").trim().toLowerCase() !== (b?.dosageForm || "").trim().toLowerCase(),
      },
      {
        key: "category",
        label: t("compare.category") || "Category",
        render: (item) => {
          const val = item.category ? formatMedicineText(item.category, langCode) : null;
          return val ? <span>{val}</span> : <UnavailableIndicator />;
        },
        diffCheck: (a, b) => (a?.category || "").trim().toLowerCase() !== (b?.category || "").trim().toLowerCase(),
      },
      {
        key: "manufacturer",
        label: t("compare.manufacturer") || "Manufacturer",
        render: (item) => {
          const val = formatManufacturer(item.manufacturer, langCode);
          return val ? <span>{val}</span> : <UnavailableIndicator />;
        },
        diffCheck: (a, b) => (a?.manufacturer || "").trim().toLowerCase() !== (b?.manufacturer || "").trim().toLowerCase(),
      },
      {
        key: "price",
        label: t("compare.price") || "Price",
        render: (item, other) => {
          if (item?.price === undefined || item?.price === null) return <UnavailableIndicator />;
          const isCheaper = other && other.price !== undefined && item.price < other.price;
          return (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display font-extrabold text-base text-primary-hover">₹{item.price}</span>
              {isCheaper && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  ₹{other.price - item.price} cheaper
                </span>
              )}
            </div>
          );
        },
        diffCheck: (a, b) => Number(a?.price) !== Number(b?.price),
      },
      {
        key: "status",
        label: t("compare.status") || "Classification",
        render: (item) => {
          const isOtc = item.otc || !item?.prescriptionRequired;
          return (
            <span
              className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
                isOtc ? "bg-emerald-50 text-emerald-700" : "bg-danger-50 text-danger"
              }`}
            >
              {isOtc ? t("compare.otc") || "Over-The-Counter (OTC)" : t("compare.rx") || "Prescription Required (Rx)"}
            </span>
          );
        },
        diffCheck: (a, b) => Boolean(a?.otc) !== Boolean(b?.otc),
      },
      {
        key: "uses",
        label: t("compare.uses") || "Uses & Indications",
        render: (item) => {
          const u = item.uses;
          if (Array.isArray(u) && u.length > 0) {
            return (
              <div className="flex flex-wrap gap-1.5">
                {u.map((useText, idx) => (
                  <span
                    key={idx}
                    className="inline-block text-xs bg-slate-100 text-text px-2 py-0.5 rounded-md border border-slate-200/60"
                  >
                    {formatMedicineText(useText, langCode)}
                  </span>
                ))}
              </div>
            );
          }
          if (typeof u === "string" && u.trim()) {
            return <span>{formatMedicineText(u, langCode)}</span>;
          }
          return <UnavailableIndicator />;
        },
        diffCheck: (a, b) => {
          const arrA = Array.isArray(a?.uses) ? a.uses.join("|") : String(a?.uses || "");
          const arrB = Array.isArray(b?.uses) ? b.uses.join("|") : String(b?.uses || "");
          return arrA.toLowerCase() !== arrB.toLowerCase();
        },
      },
      {
        key: "sideEffects",
        label: t("compare.sideEffects") || "Side Effects",
        render: (item) => {
          const str = formatSideEffects(item);
          return str ? <span>{str}</span> : <UnavailableIndicator />;
        },
        diffCheck: (a, b) => formatSideEffects(a) !== formatSideEffects(b),
      },
      {
        key: "warnings",
        label: t("compare.warnings") || "Warnings & Precautions",
        render: (item) => {
          const str = formatWarnings(item);
          return str ? <span>{str}</span> : <UnavailableIndicator />;
        },
        diffCheck: (a, b) => formatWarnings(a) !== formatWarnings(b),
      },
      {
        key: "dosage",
        label: t("compare.dosage") || "Dosage Instructions",
        render: (item) => {
          const str = formatDosageInfo(item);
          return str ? <span>{str}</span> : <UnavailableIndicator />;
        },
        diffCheck: (a, b) => formatDosageInfo(a) !== formatDosageInfo(b),
      },
      {
        key: "packSize",
        label: t("compare.packSize") || "Pack Size",
        render: (item) => {
          const val = formatPackSize(item.packSize, langCode);
          return val ? <span>{val}</span> : <UnavailableIndicator />;
        },
        diffCheck: (a, b) => (a?.packSize || "").trim().toLowerCase() !== (b?.packSize || "").trim().toLowerCase(),
      },
      {
        key: "rating",
        label: t("compare.rating") || "Rating",
        render: (item) => {
          return item?.rating ? (
            <span className="font-semibold text-text">⭐ {item.rating} / 5</span>
          ) : (
            <UnavailableIndicator />
          );
        },
        diffCheck: (a, b) => Number(a?.rating) !== Number(b?.rating),
      },
    ];
  }, [t, langCode, formatDosageInfo, formatSideEffects, formatWarnings]);

  // Compute number of differences highlighted
  const differencesCount = useMemo(() => {
    if (!medicineA || !medicineB) return 0;
    return rows.filter((r) => r.diffCheck(medicineA, medicineB)).length;
  }, [rows, medicineA, medicineB]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-text">{t("compare.title")}</h1>
        <p className="mt-1.5 text-text-muted">{t("compare.subtitle")}</p>
      </div>

      {/* Catalog Load Error Alert */}
      {optionsError && (
        <div className="mt-6 p-4 rounded-xl border border-warning/30 bg-amber-50/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-sm text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{optionsError}</span>
          </div>
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={loadOptions}>
            {t("common.tryAgain") || "Retry"}
          </Button>
        </div>
      )}

      {/* Selectors Grid: Medicine A and Medicine B */}
      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        {/* Selector A */}
        <div className="card p-5">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">
            {t("compare.medicineA")}
          </p>
          <SearchableMedicineSelect
            label={t("compare.medicineA")}
            value={idA}
            selectedMedicine={medicineA}
            onChange={(v) => updateParam("a", v)}
            exclude={idB}
            options={options}
            loading={optionsLoading}
            langCode={langCode}
            placeholder={t("compare.searchPlaceholder")}
          />
        </div>

        {/* Selector B */}
        <div className="card p-5">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">
            {t("compare.medicineB")}
          </p>
          <SearchableMedicineSelect
            label={t("compare.medicineB")}
            value={idB}
            selectedMedicine={medicineB}
            onChange={(v) => updateParam("b", v)}
            exclude={idA}
            options={options}
            loading={optionsLoading}
            langCode={langCode}
            placeholder={t("compare.searchPlaceholder")}
          />
        </div>
      </div>

      {/* Loading State during comparison fetch */}
      {loading ? (
        <div className="mt-12 flex flex-col items-center justify-center py-20 card">
          <Loader2 className="w-9 h-9 animate-spin text-primary mb-3.5" />
          <p className="text-sm font-semibold text-text">{t("compare.loadingComparison") || "Loading comparison data..."}</p>
          <p className="text-xs text-text-muted mt-1">Retrieving formulations, indications, and pricing from catalog.</p>
        </div>
      ) : compareError ? (
        /* Comparison Error State */
        <div className="mt-8 p-6 card border-danger/20 bg-danger-50 text-center">
          <AlertCircle className="w-8 h-8 text-danger mx-auto mb-2" />
          <p className="text-sm font-bold text-danger">{compareError}</p>
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={loadComparisons} className="mt-4">
            {t("common.tryAgain") || "Retry"}
          </Button>
        </div>
      ) : medicineA && medicineB ? (
        /* Side-by-Side Comparison Container */
        <div className="mt-8 space-y-4">
          {/* Action and Highlights Bar */}
          <div className="card px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-primary-50/20 border-border">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                {t("compare.differencesCount", { count: differencesCount }) || `${differencesCount} Differences Highlighted`}
              </span>
              <span className="text-xs text-text-muted">
                Side-by-side comparison of active ingredients, warnings, and costs
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={ArrowLeftRight}
                onClick={swapMedicines}
                className="text-xs"
              >
                {t("compare.swap") || "Swap"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  updateParam("a", "");
                  updateParam("b", "");
                }}
                className="text-xs text-text-muted hover:text-danger"
              >
                {t("compare.clearSelection") || "Clear Both"}
              </Button>
            </div>
          </div>

          {/* Side-by-side Comparison Table */}
          <div className="card overflow-hidden shadow-card border border-border">
            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                {/* Comparison Header Row */}
                <div className="grid grid-cols-12 bg-primary-50/90 border-b border-primary/20">
                  <div className="col-span-3 p-4 text-xs font-extrabold text-primary-hover uppercase tracking-wider flex items-center">
                    {t("compare.feature")}
                  </div>

                  {/* Header Card: Medicine A */}
                  <div className="col-span-4 sm:col-span-4 p-4 border-l border-primary/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-display font-extrabold text-base text-text">
                          {formatBrandName(medicineA.brand || medicineA.name, langCode)}
                        </span>
                        <button
                          onClick={() => updateParam("a", "")}
                          className="text-text-muted hover:text-danger p-1 rounded-md transition-colors"
                          aria-label="Remove medicine A"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5 truncate">
                        {formatGenericName(medicineA.genericName, langCode) || medicineA.composition || "—"}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-primary/10 flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-primary-hover">₹{medicineA.price}</span>
                      <Link
                        to={getMedicineDetailsPath(medicineA.id || medicineA._id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        <span>{t("compare.viewDetails") || "View Details"}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Header Card: Medicine B */}
                  <div className="col-span-5 sm:col-span-5 p-4 border-l border-primary/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-display font-extrabold text-base text-text">
                          {formatBrandName(medicineB.brand || medicineB.name, langCode)}
                        </span>
                        <button
                          onClick={() => updateParam("b", "")}
                          className="text-text-muted hover:text-danger p-1 rounded-md transition-colors"
                          aria-label="Remove medicine B"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5 truncate">
                        {formatGenericName(medicineB.genericName, langCode) || medicineB.composition || "—"}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-primary/10 flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-primary-hover">₹{medicineB.price}</span>
                      <Link
                        to={getMedicineDetailsPath(medicineB.id || medicineB._id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        <span>{t("compare.viewDetails") || "View Details"}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Attribute Comparison Rows */}
                {rows.map((row, i) => {
                  const isDiff = row.diffCheck(medicineA, medicineB);
                  return (
                    <div
                      key={row.key}
                      className={`grid grid-cols-12 border-b border-border/50 last:border-b-0 transition-colors ${
                        isDiff
                          ? "bg-amber-50/25 hover:bg-amber-50/40"
                          : i % 2
                          ? "bg-slate-50/40 hover:bg-slate-50"
                          : "bg-white hover:bg-slate-50/60"
                      }`}
                    >
                      {/* Property Label Column */}
                      <div className="col-span-3 p-4 flex flex-col justify-center">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-text-muted">{row.label}</span>
                          {isDiff && (
                            <span className="inline-block text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider">
                              {t("compare.different") || "Differs"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Medicine A Column */}
                      <div className="col-span-4 sm:col-span-4 p-4 border-l border-border/40 text-sm text-text flex items-center">
                        {row.render(medicineA, medicineB)}
                      </div>

                      {/* Medicine B Column */}
                      <div className="col-span-5 sm:col-span-5 p-4 border-l border-border/40 text-sm text-text flex items-center">
                        {row.render(medicineB, medicineA)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : idA || idB ? (
        /* Partial Selection Empty State (Only one selected) */
        <div className="mt-12 text-center py-14 card p-8 border-dashed border-2 border-border">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 grid place-items-center text-primary mx-auto mb-3.5">
            <Pill className="w-6 h-6" />
          </div>
          <p className="text-text font-bold text-lg">
            {t("compare.selectSecondMedicine") || "Please select a second medicine to compare"}
          </p>
          <p className="text-text-muted text-sm max-w-md mx-auto mt-1.5">
            {t("compare.selectSecondMedicineDesc") ||
              "Choose another medicine in the field above to see the side-by-side comparison of composition, indications, warnings, and prices."}
          </p>
        </div>
      ) : (
        /* Empty State (Neither selected) */
        <div className="mt-12 text-center py-16 card p-8 border-dashed border-2 border-border">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 grid place-items-center text-text-muted mx-auto mb-4">
            <ArrowLeftRight className="w-7 h-7 text-text-muted" />
          </div>
          <p className="text-text font-bold text-lg">{t("compare.noSelectionTitle") || "Compare Any Two Medicines"}</p>
          <p className="text-text-muted text-sm max-w-lg mx-auto mt-2 leading-relaxed">
            {t("compare.noSelectionDesc") ||
              "Search and select any two medicines from our verified catalog to compare their active ingredients, dosage forms, warnings, and costs."}
          </p>
        </div>
      )}
    </div>
  );
}