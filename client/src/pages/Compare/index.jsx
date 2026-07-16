import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import { getAllMedicines, getMedicineById } from "../../utils/medicineData";

const ROWS = [
  { key: "brand", label: "Brand Name" },
  { key: "genericName", label: "Generic Name" },
  { key: "manufacturer", label: "Manufacturer" },
  { key: "strength", label: "Strength" },
  { key: "price", label: "Price", format: (v) => `₹${v}` },
  { key: "uses", label: "Uses", format: (v) => v.join(", ") },
  { key: "sideEffects", label: "Side Effects", format: (v) => v.common.join(", ") },
  { key: "warnings", label: "Warnings", format: (v) => v.pregnancy },
  { key: "otc", label: "Prescription Required", format: (v) => (v ? "No" : "Yes") },
  { key: "packSize", label: "Pack Size" },
  { key: "rating", label: "Rating", format: (v) => `${v} / 5` },
];

function MedicineSelect({ value, onChange, exclude }) {
  const options = getAllMedicines().filter((m) => m.id !== exclude);
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-sm font-medium text-text border border-border rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-primary"
    >
      <option value="">Select a medicine…</option>
      {options.map((m) => (
        <option key={m.id} value={m.id}>{m.brand} ({m.genericName})</option>
      ))}
    </select>
  );
}

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const idA = searchParams.get("a") || "";
  const idB = searchParams.get("b") || "";

  const medicineA = useMemo(() => getMedicineById(idA), [idA]);
  const medicineB = useMemo(() => getMedicineById(idB), [idB]);

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
          <MedicineSelect value={idA} onChange={(v) => updateParam("a", v)} exclude={idB} />
        </div>
        <div className="card p-4">
          <p className="text-xs font-semibold text-text-muted uppercase mb-2">Medicine B</p>
          <MedicineSelect value={idB} onChange={(v) => updateParam("b", v)} exclude={idA} />
        </div>
      </div>

      {medicineA && medicineB ? (
        <div className="mt-8 card overflow-hidden">
          <div className="grid grid-cols-3 bg-primary-50">
            <div className="p-4 text-xs font-bold text-primary-hover uppercase">Feature</div>
            <div className="p-4 flex items-center justify-between">
              <span className="font-display font-bold text-text">{medicineA.brand}</span>
              <button onClick={() => updateParam("a", "")} className="text-text-muted hover:text-danger">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="font-display font-bold text-text">{medicineB.brand}</span>
              <button onClick={() => updateParam("b", "")} className="text-text-muted hover:text-danger">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {ROWS.map((row, i) => (
            <div key={row.key} className={`grid grid-cols-3 ${i % 2 ? "bg-slate-50/60" : ""}`}>
              <div className="p-4 text-sm font-semibold text-text-muted">{row.label}</div>
              <div className="p-4 text-sm text-text">
                {row.format ? row.format(medicineA[row.key]) : medicineA[row.key]}
              </div>
              <div className="p-4 text-sm text-text">
                {row.format ? row.format(medicineB[row.key]) : medicineB[row.key]}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-text-muted text-sm">Select two medicines above to compare.</p>
      )}
    </div>
  );
}