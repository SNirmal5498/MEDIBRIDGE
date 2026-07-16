import { Search, ArrowUpDown } from "lucide-react";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "open", label: "Open Now" },
  { value: "in-stock", label: "In Stock" },
  { value: "otc", label: "OTC" },
  { value: "prescription", label: "Prescription" },
];

const SORTS = [
  { value: "distance", label: "Distance" },
  { value: "rating", label: "Rating" },
  { value: "price", label: "Price" },
  { value: "availability", label: "Availability" },
];

export default function PharmacySearchFilterBar({
  query,
  onQueryChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
}) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-card">
        <Search className="w-4 h-4 text-text-muted shrink-0" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          type="text"
          placeholder="Search by pharmacy, area, or medicine name..."
          className="w-full text-sm focus:outline-none bg-transparent"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Filters */}
        <div className="flex flex-wrap gap-1.5 bg-primary-50/60 p-1 rounded-xl w-fit">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === f.value ? "bg-white text-primary-hover shadow-card" : "text-text-muted hover:text-text"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 sm:ml-auto">
          <ArrowUpDown className="w-4 h-4 text-text-muted shrink-0" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-sm font-medium text-text border border-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-primary"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                Sort: {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}