const FILTERS = [
  { key: "all", label: "All Medicines" },
  { key: "otc", label: "OTC Only" },
  { key: "prescription", label: "Prescription" },
];

export default function MedicineFilterChips({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors duration-150
            ${
              active === f.key
                ? "bg-primary text-white border-primary"
                : "bg-card text-text-muted border-border hover:text-text hover:border-primary/40"
            }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}