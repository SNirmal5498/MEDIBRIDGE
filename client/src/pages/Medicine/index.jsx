import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { GitCompare, X } from "lucide-react";
import { getAllMedicines, getPopularMedicines, getRecentlyViewed } from "../../utils/medicineData";
import FilterSortBar from "../../components/medicine/FilterSortBar";
import MedicineCard from "../../components/medicine/MedicineCard";
import Button from "../../components/common/Button";

export default function Medicine() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("popularity");
  const [category, setCategory] = useState("all");
  const [compareIds, setCompareIds] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    setRecentlyViewed(getRecentlyViewed(4));
  }, []);

  function toggleCompare(id) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  }

  const filtered = useMemo(() => {
    let list = getAllMedicines();

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (m) => m.brand.toLowerCase().includes(q) || m.genericName.toLowerCase().includes(q)
      );
    }
    if (filter === "otc") list = list.filter((m) => m.otc);
    if (filter === "prescription") list = list.filter((m) => !m.otc);
    if (category !== "all") list = list.filter((m) => m.category === category);

    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "az") sorted.sort((a, b) => a.brand.localeCompare(b.brand));
    else sorted.sort((a, b) => b.popularity - a.popularity);

    return sorted;
  }, [query, filter, sort, category]);

  const popular = useMemo(() => getPopularMedicines(4), []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28">
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-text">Compare Medicines</h1>
        <p className="mt-1.5 text-text-muted">Search, filter, and compare brands to find the right medicine.</p>
      </div>

      <FilterSortBar
        query={query}
        onQueryChange={setQuery}
        filter={filter}
        onFilterChange={setFilter}
        sort={sort}
        onSortChange={setSort}
        category={category}
        onCategoryChange={setCategory}
      />

      {recentlyViewed.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display font-bold text-lg text-text mb-4">Recently Viewed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentlyViewed.map((m) => (
              <MedicineCard
                key={m.id}
                medicine={m}
                compareSelected={compareIds.includes(m.id)}
                compareDisabled={compareIds.length >= 2}
                onToggleCompare={toggleCompare}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-display font-bold text-lg text-text mb-4">
          {query || category !== "all" || filter !== "all" ? `${filtered.length} results` : "All Medicines"}
        </h2>
        {filtered.length === 0 ? (
          <p className="text-text-muted text-sm py-10 text-center">No medicines match your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((m) => (
              <MedicineCard
                key={m.id}
                medicine={m}
                compareSelected={compareIds.includes(m.id)}
                compareDisabled={compareIds.length >= 2}
                onToggleCompare={toggleCompare}
              />
            ))}
          </div>
        )}
      </section>

      {category === "all" && !query && (
        <section className="mt-12">
          <h2 className="font-display font-bold text-lg text-text mb-4">Popular Medicines</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popular.map((m) => (
              <MedicineCard
                key={m.id}
                medicine={m}
                compareSelected={compareIds.includes(m.id)}
                compareDisabled={compareIds.length >= 2}
                onToggleCompare={toggleCompare}
              />
            ))}
          </div>
        </section>
      )}

      {compareIds.length > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 card px-5 py-3.5 flex items-center gap-4 shadow-card-hover">
          <span className="text-sm font-semibold text-text">{compareIds.length}/2 selected</span>
          <Button
            variant="primary"
            size="sm"
            icon={GitCompare}
            disabled={compareIds.length < 2}
            onClick={() => navigate(`/compare?a=${compareIds[0]}&b=${compareIds[1]}`)}
          >
            Compare now
          </Button>
          <button onClick={() => setCompareIds([])} className="text-text-muted hover:text-text" aria-label="Clear selection">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}