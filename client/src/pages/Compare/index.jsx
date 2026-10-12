import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { X, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { getAllMedicines, getMedicineById as getLocalMedicineById } from "../../utils/medicineData";
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
import Button from "../../components/common/Button";

function MedicineSelect({
  value,
  onChange,
  exclude,
  options = [],
  selectPrompt,
  langCode = "en",
  loading = false,
  disabled = false,
}) {
  const filteredOptions = useMemo(() => {
    return options.filter((m) => {
      const id = m.id || m._id;
      return id && id !== exclude;
    });
  }, [options, exclude]);

  return (
    <div className="relative">
      <select
        value={value || ""}
        disabled={disabled || loading}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm font-medium text-text border border-border rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-primary shadow-sm disabled:bg-slate-50 disabled:text-text-muted transition-colors"
      >
        <option value="">{loading ? "Loading medicines..." : selectPrompt}</option>
        {filteredOptions.map((m) => {
          const id = m.id || m._id;
          const brand = formatBrandName(m.brand || m.name, langCode);
          const generic = formatGenericName(m.genericName, langCode);
          const strength = formatStrength(m.strength, langCode);
          const detailStr = [generic, strength].filter(Boolean).join(" · ");
          return (
            <option key={id} value={id}>
              {brand} {detailStr ? `(${detailStr})` : ""}
            </option>
          );
        })}
      </select>
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin text-primary absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none" />
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

  const formatDosageInfo = useCallback((item) => {
    if (!item) return "—";
    if (typeof item.dosage === "string") return formatMedicineText(item.dosage, langCode);
    if (item.dosage && typeof item.dosage === "object") {
      const parts = [];
      if (item.dosage.adults) parts.push(item.dosage.adults);
      if (item.dosage.children) parts.push(item.dosage.children);
      if (parts.length > 0) return parts.map((p) => formatMedicineText(p, langCode)).join(" | ");
    }
    if (item.dosageForm) return formatDosageForm(item.dosageForm, langCode);
    return "—";
  }, [langCode]);

  const rows = useMemo(() => [
    { key: "brand", label: t("compare.brand"), format: (v, item) => formatBrandName(item.brand || item.name || v, langCode) },
    { key: "genericName", label: t("compare.genericName"), format: (v) => formatGenericName(v, langCode) },
    { key: "composition", label: t("compare.composition") || "Composition", format: (v, item) => formatCompositionPhrase(item.composition || item.genericName || v, langCode) || "—" },
    { key: "strength", label: t("compare.strength"), format: (v) => formatStrength(v, langCode) || "—" },
    { key: "dosage", label: t("details.dosage") || "Dosage Information", format: (v, item) => formatDosageInfo(item) },
    { key: "price", label: t("compare.price"), format: (v) => (v !== undefined && v !== null ? `₹${v}` : "—") },
    {
      key: "uses",
      label: t("compare.uses"),
      format: (v) =>
        Array.isArray(v) && v.length > 0
          ? v.map((item) => formatMedicineText(item, langCode)).join(", ")
          : typeof v === "string" && v
          ? formatMedicineText(v, langCode)
          : "—",
    },
    {
      key: "sideEffects",
      label: t("compare.sideEffects"),
      format: (v) =>
        v && v.common && Array.isArray(v.common) && v.common.length > 0
          ? v.common.map((item) => formatMedicineText(item, langCode)).join(", ")
          : typeof v === "string" && v
          ? formatMedicineText(v, langCode)
          : "—",
    },
    {
      key: "warnings",
      label: t("compare.warnings"),
      format: (v) => (v && v.pregnancy ? formatMedicineText(v.pregnancy, langCode) : typeof v === "string" && v ? formatMedicineText(v, langCode) : "—"),
    },
    {
      key: "otc",
      label: t("compare.prescriptionRequired"),
      format: (v, item) => (item.otc || !item?.prescriptionRequired ? t("medicine.otc") : t("medicine.prescriptionRequired")),
    },
    { key: "manufacturer", label: t("compare.manufacturer"), format: (v) => formatManufacturer(v, langCode) || "—" },
    { key: "packSize", label: t("compare.packSize"), format: (v) => formatPackSize(v, langCode) || "—" },
    { key: "rating", label: t("compare.rating"), format: (v) => (v ? `${v} / 5` : "—") },
  ], [t, langCode, formatDosageInfo]);

  // Load available options (all catalog medicines)
  const loadOptions = useCallback(async () => {
    setOptionsLoading(true);
    setOptionsError(null);
    try {
      const res = await medicineService.search({
        limit: 1500,
        fields: "id,brand,name,genericName,composition,strength,price,otc",
        lang: langCode,
      });
      const list = res?.medicines || res?.data;
      if (Array.isArray(list) && list.length > 0) {
        setOptions(list);
        return;
      }
    } catch (e) {
      console.warn("Failed to load catalog options from API, falling back to local dataset:", e);
      setOptionsError(e.message || "Failed to load medicine list");
    } finally {
      setOptionsLoading(false);
    }

    // Fallback to local dataset
    const local = getAllMedicines();
    if (local && local.length > 0) {
      setOptions(local);
    }
  }, [langCode]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  // Fetch compared medicines
  useEffect(() => {
    let isMounted = true;

    async function loadComparisons() {
      if (!idA && !idB) {
        setMedicineA(null);
        setMedicineB(null);
        return;
      }

      setLoading(true);

      // Prefer compare endpoint if both IDs are provided
      if (idA && idB) {
        try {
          const res = await medicineService.compare(idA, idB, langCode);
          const list = res?.medicines || res?.data || [];
          if (isMounted && Array.isArray(list)) {
            const medA = list.find((m) => (m.id === idA || m._id === idA));
            const medB = list.find((m) => (m.id === idB || m._id === idB));
            if (medA) setMedicineA(medA);
            if (medB) setMedicineB(medB);

            // Merge into options if missing
            setOptions((prev) => {
              const prevIds = new Set(prev.map((p) => p.id || p._id));
              const additions = [];
              if (medA && !prevIds.has(medA.id || medA._id)) additions.push(medA);
              if (medB && !prevIds.has(medB.id || medB._id)) additions.push(medB);
              return additions.length > 0 ? [...prev, ...additions] : prev;
            });

            if (medA && medB) {
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          // fallback to individual fetches
        }
      }

      // Load A individually if not resolved
      if (idA) {
        try {
          const resA = await medicineService.getById(idA, langCode);
          const medA = resA?.medicine || resA?.data;
          if (isMounted && medA) {
            setMedicineA(medA);
            setOptions((prev) => {
              const exists = prev.some((p) => (p.id || p._id) === (medA.id || medA._id));
              return exists ? prev : [...prev, medA];
            });
          }
        } catch (e) {
          const localA = getLocalMedicineById(idA);
          if (isMounted && localA) setMedicineA(localA);
        }
      } else {
        setMedicineA(null);
      }

      // Load B individually if not resolved
      if (idB) {
        try {
          const resB = await medicineService.getById(idB, langCode);
          const medB = resB?.medicine || resB?.data;
          if (isMounted && medB) {
            setMedicineB(medB);
            setOptions((prev) => {
              const exists = prev.some((p) => (p.id || p._id) === (medB.id || medB._id));
              return exists ? prev : [...prev, medB];
            });
          }
        } catch (e) {
          const localB = getLocalMedicineById(idB);
          if (isMounted && localB) setMedicineB(localB);
        }
      } else {
        setMedicineB(null);
      }

      if (isMounted) setLoading(false);
    }

    loadComparisons();

    return () => {
      isMounted = false;
    };
  }, [idA, idB, langCode]);

  function updateParam(key, value) {
    // Prevent selecting the same medicine twice
    if (key === "a" && value && value === idB) return;
    if (key === "b" && value && value === idA) return;

    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-text">{t("compare.title")}</h1>
      <p className="mt-1.5 text-text-muted">{t("compare.subtitle")}</p>

      {optionsError && options.length === 0 && (
        <div className="mt-4 p-4 rounded-xl border border-warning/30 bg-amber-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{optionsError}</span>
          </div>
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={loadOptions}>
            {t("common.retry") || "Retry"}
          </Button>
        </div>
      )}

      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <div className="card p-4">
          <p className="text-xs font-semibold text-text-muted uppercase mb-2">{t("compare.medicineA")}</p>
          <MedicineSelect
            value={idA}
            onChange={(v) => updateParam("a", v)}
            exclude={idB}
            options={options}
            selectPrompt={t("compare.selectMedicine")}
            langCode={langCode}
            loading={optionsLoading}
          />
        </div>
        <div className="card p-4">
          <p className="text-xs font-semibold text-text-muted uppercase mb-2">{t("compare.medicineB")}</p>
          <MedicineSelect
            value={idB}
            onChange={(v) => updateParam("b", v)}
            exclude={idA}
            options={options}
            selectPrompt={t("compare.selectMedicine")}
            langCode={langCode}
            loading={optionsLoading}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-muted">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <p className="text-sm">{t("compare.loading")}</p>
        </div>
      ) : medicineA && medicineB ? (
        <div className="mt-8 card overflow-hidden shadow-card">
          <div className="grid grid-cols-3 bg-primary-50 border-b border-primary/10">
            <div className="p-4 text-xs font-bold text-primary-hover uppercase">{t("compare.feature")}</div>
            <div className="p-4 flex items-center justify-between">
              <span className="font-display font-bold text-text">
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
            <div className="p-4 flex items-center justify-between">
              <span className="font-display font-bold text-text">
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
          </div>

          {rows.map((row, i) => (
            <div
              key={row.key}
              className={`grid grid-cols-3 ${i % 2 ? "bg-slate-50/60" : "bg-white"} border-b border-border/40 last:border-0`}
            >
              <div className="p-4 text-sm font-semibold text-text-muted">{row.label}</div>
              <div className="p-4 text-sm text-text">
                {row.format ? row.format(medicineA[row.key], medicineA) : medicineA[row.key] || "—"}
              </div>
              <div className="p-4 text-sm text-text">
                {row.format ? row.format(medicineB[row.key], medicineB) : medicineB[row.key] || "—"}
              </div>
            </div>
          ))}
        </div>
      ) : idA || idB ? (
        <div className="mt-12 text-center py-12 card">
          <p className="text-text font-semibold text-base">
            {t("compare.selectSecondMedicine") || "Please select a second medicine to compare"}
          </p>
          <p className="text-text-muted text-sm mt-1">{t("compare.noSelectionDesc")}</p>
        </div>
      ) : (
        <div className="mt-12 text-center py-12 card">
          <p className="text-text font-semibold text-base">{t("compare.noSelectionTitle")}</p>
          <p className="text-text-muted text-sm mt-1">{t("compare.noSelectionDesc")}</p>
        </div>
      )}
    </div>
  );
}