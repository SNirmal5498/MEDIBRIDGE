import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { X, Loader2 } from "lucide-react";
import { getAllMedicines, getMedicineById as getLocalMedicineById } from "../../utils/medicineData";
import { medicineService } from "../../services/medicineService";

const ROWS = [
  { key: "brand", label: "Brand Name" },
  { key: "genericName", label: "Generic Name" },
  { key: "manufacturer", label: "Manufacturer" },
  { key: "strength", label: "Strength" },
  { key: "price", label: "Price", format: (v) => `₹${v}` },
  { key: "uses", label: "Uses", format: (v) => (Array.isArray(v) ? v.join(", ") : v || "—") },
  { key: "sideEffects", label: "Side Effects", format: (v) => (v && v.common ? v.common.join(", ") : "—") },
  { key: "warnings", label: "Warnings", format: (v) => (v && v.pregnancy ? v.pregnancy : "—") },
  {
    key: "otc",
    label: "Prescription Required",
    format: (v, item) => (v || !item?.prescriptionRequired ? "No (OTC)" : "Yes (Prescription Required)"),
  },
  { key: "packSize", label: "Pack Size" },
  { key: "rating", label: "Rating", format: (v) => (v ? `${v} / 5` : "—") },
];

function MedicineSelect({ value, onChange, exclude, options = [] }) {
  const filteredOptions = options.filter((m) => m.id !== exclude);
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-sm font-medium text-text border border-border rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-primary shadow-sm"
    >
      <option value="">Select a medicine…</option>
      {filteredOptions.map((m) => (
        <option key={m.id} value={m.id}>
          {m.brand} ({m.genericName || m.strength || ""})
        </option>
      ))}
    </select>
  );
}

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const idA = searchParams.get("a") || "";
  const idB = searchParams.get("b") || "";

  const [medicineA, setMedicineA] = useState(null);
  const [medicineB, setMedicineB] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load available options
  useEffect(() => {
    let isMounted = true;
    async function loadOptions() {
      try {
        const res = await medicineService.search({ limit: 100 });
        if (isMounted && res && res.data && res.data.length > 0) {
          setOptions(res.data);
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
          if (isMounted && resA && resA.data) setMedicineA(resA.data);
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
          if (isMounted && resB && resB.data) setMedicineB(resB.data);
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
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-text">Compare Medicines</h1>
      <p className="mt-1.5 text-text-muted">Pick two medicines to see a side-by-side comparison.</p>

      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <div className="card p-4">
          <p className="text-xs font-semibold text-text-muted uppercase mb-2">Medicine A</p>
          <MedicineSelect value={idA} onChange={(v) => updateParam("a", v)} exclude={idB} options={options} />
        </div>
        <div className="card p-4">
          <p className="text-xs font-semibold text-text-muted uppercase mb-2">Medicine B</p>
          <MedicineSelect value={idB} onChange={(v) => updateParam("b", v)} exclude={idA} options={options} />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-muted">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <p className="text-sm">Loading comparison details...</p>
        </div>
      ) : medicineA && medicineB ? (
        <div className="mt-8 card overflow-hidden shadow-card">
          <div className="grid grid-cols-3 bg-primary-50 border-b border-primary/10">
            <div className="p-4 text-xs font-bold text-primary-hover uppercase">Feature</div>
            <div className="p-4 flex items-center justify-between">
              <span className="font-display font-bold text-text">{medicineA.brand}</span>
              <button onClick={() => updateParam("a", "")} className="text-text-muted hover:text-danger p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="font-display font-bold text-text">{medicineB.brand}</span>
              <button onClick={() => updateParam("b", "")} className="text-text-muted hover:text-danger p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {ROWS.map((row, i) => (
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
          <p className="text-text font-semibold text-base">Select two medicines above</p>
          <p className="text-text-muted text-sm mt-1">Choose from the dropdown lists to see side-by-side pricing, composition, and uses.</p>
        </div>
      )}
    </div>
  );
}