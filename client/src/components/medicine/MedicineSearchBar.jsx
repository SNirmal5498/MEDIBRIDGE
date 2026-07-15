import { Search, X } from "lucide-react";

export default function MedicineSearchBar({ value, onChange, resultCount }) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by medicine, brand, or manufacturer..."
        className="w-full rounded-2xl border border-border bg-card py-4 pl-12 pr-12 text-sm sm:text-base
          text-text placeholder:text-text-muted shadow-card focus:outline-none focus:ring-2 focus:ring-primary/40
          focus:border-primary/40 transition-shadow"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-4 top-1/2 -translate-y-1/2 grid place-items-center w-6 h-6 rounded-full
            text-text-muted hover:text-text hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      {value && (
        <p className="mt-2 ml-1 text-xs text-text-muted">
          {resultCount} result{resultCount === 1 ? "" : "s"} for "{value}"
        </p>
      )}
    </div>
  );
}