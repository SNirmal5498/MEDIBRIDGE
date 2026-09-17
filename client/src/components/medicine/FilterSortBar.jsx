import { Search, ArrowUpDown } from "lucide-react";
import { CATEGORIES } from "../../utils/medicineData";
import { useLanguage } from "../../hooks/useLanguage";
import { getCategoryTranslation } from "../../i18n/i18n";

export default function FilterSortBar({
  query,
  onQueryChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  category,
  onCategoryChange,
}) {
  const { t, language } = useLanguage();

  const filters = [
    { value: "all", label: t("filter.all") },
    { value: "otc", label: t("filter.otc") },
    { value: "prescription", label: t("filter.prescription") },
  ];

  const sorts = [
    { value: "popularity", label: t("sort.popularity") },
    { value: "price-asc", label: t("sort.priceAsc") },
    { value: "price-desc", label: t("sort.priceDesc") },
    { value: "az", label: t("sort.az") },
  ];

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-card">
        <Search className="w-4 h-4 text-text-muted shrink-0" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          type="text"
          placeholder={t("filter.searchPlaceholder")}
          className="w-full text-sm focus:outline-none bg-transparent"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* All/OTC/Prescription filter */}
        <div className="flex gap-1.5 bg-primary-50/60 p-1 rounded-xl w-fit">
          {filters.map((f) => (
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
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange("all")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            category === "all" ? "bg-primary text-white" : "bg-slate-100 text-text-muted hover:bg-slate-200"
          }`}
        >
          {t("filter.allCategories")}
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => onCategoryChange(c)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              category === c ? "bg-primary text-white" : "bg-slate-100 text-text-muted hover:bg-slate-200"
            }`}
          >
            {getCategoryTranslation(language.code, c)}
          </button>
        ))}
      </div>
    </div>
  );
}