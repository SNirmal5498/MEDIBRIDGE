import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { X, Loader2 } from "lucide-react";
import { getAllMedicines, getMedicineById as getLocalMedicineById } from "../../utils/medicineData";
import { medicineService } from "../../services/medicineService";
import { useLanguage } from "../../hooks/useLanguage";

import {
  formatBrandName,
  formatGenericName,
  formatManufacturer,
  formatStrength,
  formatPackSize,
  formatMedicineText,
} from "../../utils/formatters";

function MedicineSelect({ value, onChange, exclude, options = [], selectPrompt, langCode = "en" }) {
  const filteredOptions = options.filter((m) => m.id !== exclude);
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-sm font-medium text-text border border-border rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-primary shadow-sm"
    >
      <option value="">{selectPrompt}</option>
      {filteredOptions.map((m) => {
        const brand = formatBrandName(m.brand || m.name, langCode);
        const generic = formatGenericName(m.genericName, langCode);
        return (
          <option key={m.id} value={m.id}>
            {brand} ({generic || formatStrength(m.strength, langCode) || ""})
          </option>
        );
      })}
    </select>
  );
}

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, language } = useLanguage();
  const langCode = language.code;
  const idA = searchParams.get("a") || "";
  const idB = searchParams.get("b") || "";

  const [medicineA, setMedicineA] = useState(null);
  const [medicineB, setMedicineB] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const rows = [
    { key: "brand", label: t("compare.brand"), format: (v) => formatBrandName(v, langCode) },
    { key: "genericName", label: t("compare.genericName"), format: (v) => formatGenericName(v, langCode) },
    { key: "manufacturer", label: t("compare.manufacturer"), format: (v) => formatManufacturer(v, langCode) },
    { key: "strength", label: t("compare.strength"), format: (v) => formatStrength(v, langCode) },
    { key: "price", label: t("compare.price"), format: (v) => `₹${v}` },
    {
      key: "uses",
      label: t("compare.uses"),
      format: (v) =>
        Array.isArray(v)
          ? v.map((item) => formatMedicineText(item, langCode)).join(", ")
          : formatMedicineText(v, langCode) || "—",
    },
    {
      key: "sideEffects",
      label: t("compare.sideEffects"),
      format: (v) =>
        v && v.common
          ? v.common.map((item) => formatMedicineText(item, langCode)).join(", ")
          : "—",
    },
    {
      key: "warnings",
      label: t("compare.warnings"),
      format: (v) => (v && v.pregnancy ? formatMedicineText(v.pregnancy, langCode) : "—"),
    },
    {
      key: "otc",
      label: t("compare.prescriptionRequired"),
      format: (v, item) => (v || !item?.prescriptionRequired ? t("medicine.otc") : t("medicine.prescriptionRequired")),
    },
    { key: "packSize", label: t("compare.packSize"), format: (v) => formatPackSize(v, langCode) },
    { key: "rating", label: t("compare.rating"), format: (v) => (v ? `${v} / 5` : "—") },
  ];

  // Load available options
  useEffect(() => {
    let isMounted = true;
    async function loadOptions() {
      try {
        const res = await medicineService.search({ limit: 100 });
        const list = res?.medicines || res?.data;
        if (isMounted && Array.isArray(list) && list.length > 0) {
          setOptions(list);
          return;
        }
      } catch (e) {
        // ignore
      }
      if (isMounted) setOptions(getAllMedicines());
    }
    loadOptions();
    return () => {
      isMounted = false;
    };
  }, []);

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

      // Load A
      if (idA) {
        try {
          const resA = await medicineService.getById(idA);
          const medA = resA?.medicine || resA?.data;
          if (isMounted && medA) setMedicineA(medA);
        } catch (e) {
          const localA = getLocalMedicineById(idA);
          if (isMounted && localA) setMedicineA(localA);
        }
      } else {
        setMedicineA(null);
      }

      // Load B
      if (idB) {
        try {
          const resB = await medicineService.getById(idB);
          const medB = resB?.medicine || resB?.data;
          if (isMounted && medB) setMedicineB(medB);
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
  }, [idA, idB]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-text">{t("compare.title")}</h1>
      <p className="mt-1.5 text-text-muted">{t("compare.subtitle")}</p>

      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <div className="card p-4">
          <p className="text-xs font-semibold text-text-muted uppercase mb-2">{t("compare.medicineA")}</p>
          <MedicineSelect value={idA} onChange={(v) => updateParam("a", v)} exclude={idB} options={options} selectPrompt={t("compare.selectMedicine")} langCode={langCode} />
        </div>
        <div className="card p-4">
          <p className="text-xs font-semibold text-text-muted uppercase mb-2">{t("compare.medicineB")}</p>
          <MedicineSelect value={idB} onChange={(v) => updateParam("b", v)} exclude={idA} options={options} selectPrompt={t("compare.selectMedicine")} langCode={langCode} />
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
              <span className="font-display font-bold text-text">{formatBrandName(medicineA.brand || medicineA.name, langCode)}</span>
              <button onClick={() => updateParam("a", "")} className="text-text-muted hover:text-danger p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="font-display font-bold text-text">{formatBrandName(medicineB.brand || medicineB.name, langCode)}</span>
              <button onClick={() => updateParam("b", "")} className="text-text-muted hover:text-danger p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {rows.map((row, i) => (
            <div key={row.key} className={`grid grid-cols-3 ${i % 2 ? "bg-slate-50/60" : "bg-white"} border-b border-border/40 last:border-0`}>
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
      ) : (
        <div className="mt-12 text-center py-12 card">
          <p className="text-text font-semibold text-base">{t("compare.noSelectionTitle")}</p>
          <p className="text-text-muted text-sm mt-1">{t("compare.noSelectionDesc")}</p>
        </div>
      )}
    </div>
  );
}