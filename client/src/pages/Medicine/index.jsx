import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { GitCompare, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getAllMedicines, getPopularMedicines, getRecentlyViewed } from "../../utils/medicineData";
import { medicineService } from "../../services/medicineService";
import FilterSortBar from "../../components/medicine/FilterSortBar";
import MedicineCard from "../../components/medicine/MedicineCard";
import Button from "../../components/common/Button";
import { useLanguage } from "../../hooks/useLanguage";

const ITEMS_PER_PAGE = 12;

export default function Medicine() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("popularity");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [compareIds, setCompareIds] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Server state
  const [medicines, setMedicines] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [popularMedicines, setPopularMedicines] = useState([]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Reset to page 1 on filter/category/sort change
  const handleFilterChange = (val) => {
    setFilter(val);
    setPage(1);
  };
  const handleCategoryChange = (val) => {
    setCategory(val);
    setPage(1);
  };
  const handleSortChange = (val) => {
    setSort(val);
    setPage(1);
  };

  useEffect(() => {
    setRecentlyViewed(getRecentlyViewed(4));
  }, []);

  // Fetch medicines from backend API
  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const response = await medicineService.search({
        q: debouncedQuery,
        filter,
        sort,
        category,
        page,
        limit: ITEMS_PER_PAGE,
      });

      console.log("API response:", response);
      console.log("Medicines received:", response.medicines);
      console.log("Medicine count:", response.medicines?.length);

      if (response && Array.isArray(response.medicines)) {
        setMedicines(response.medicines);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      console.warn("Backend API unavailable, falling back to local dataset:", err);
      // Fallback to local filtering
      let list = getAllMedicines();
      if (debouncedQuery.trim()) {
        const q = debouncedQuery.toLowerCase();
        list = list.filter(
          (m) =>
            m.brand?.toLowerCase().includes(q) ||
            m.genericName?.toLowerCase().includes(q) ||
            m.name?.toLowerCase().includes(q)
        );
      }
      if (filter === "otc") list = list.filter((m) => m.otc);
      if (filter === "prescription") list = list.filter((m) => !m.otc);
      if (category !== "all") list = list.filter((m) => m.category === category);

      const sorted = [...list];
      if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
      else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
      else if (sort === "az") sorted.sort((a, b) => a.brand.localeCompare(b.brand));
      else sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

      const total = sorted.length;
      const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;
      const start = (page - 1) * ITEMS_PER_PAGE;
      setMedicines(sorted.slice(start, start + ITEMS_PER_PAGE));
      setPagination({ page, limit: ITEMS_PER_PAGE, total, totalPages });
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, filter, sort, category, page]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  // Fetch popular medicines
  useEffect(() => {
    let isMounted = true;
    async function loadPopular() {
      try {
        const res = await medicineService.getPopular(4);
        if (isMounted && res && Array.isArray(res.medicines) && res.medicines.length > 0) {
          setPopularMedicines(res.medicines);
          return;
        }
      } catch (e) {
        // fallback
      }
      if (isMounted) {
        setPopularMedicines(getPopularMedicines(4));
      }
    }
    loadPopular();
    return () => {
      isMounted = false;
    };
  }, []);

  function toggleCompare(id) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28">
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-text">{t("medicine.title")}</h1>
        <p className="mt-1.5 text-text-muted">{t("medicine.subtitle")}</p>
      </div>

      <FilterSortBar
        query={query}
        onQueryChange={setQuery}
        filter={filter}
        onFilterChange={handleFilterChange}
        sort={sort}
        onSortChange={handleSortChange}
        category={category}
        onCategoryChange={handleCategoryChange}
      />

      {recentlyViewed.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display font-bold text-lg text-text mb-4">{t("medicine.recentlyViewed")}</h2>
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-text">
            {loading ? (
              t("medicine.loading")
            ) : query || category !== "all" || filter !== "all" ? (
              `${pagination.total} ${t("medicine.resultsFound")}`
            ) : (
              `${t("medicine.allMedicines")} (${pagination.total})`
            )}
          </h2>
          {pagination.totalPages > 1 && (
            <span className="text-xs text-text-muted">
              {t("medicine.page")} {pagination.page} {t("medicine.of")} {pagination.totalPages}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
            <p className="text-sm">{t("medicine.loading")}</p>
          </div>
        ) : medicines.length === 0 ? (
          <div className="text-center py-16 card">
            <p className="text-text font-semibold text-base">{t("medicine.noMedicines")}</p>
            <p className="text-text-muted text-sm mt-1">{t("medicine.noMedicinesDesc")}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {medicines.map((m) => (
                <MedicineCard
                  key={m.id}
                  medicine={m}
                  compareSelected={compareIds.includes(m.id)}
                  compareDisabled={compareIds.length >= 2}
                  onToggleCompare={toggleCompare}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={ChevronLeft}
                  disabled={pagination.page <= 1}
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 300, behavior: "smooth" });
                  }}
                >
                  {t("medicine.previous")}
                </Button>

                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setPage(pageNum);
                          window.scrollTo({ top: 300, behavior: "smooth" });
                        }}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                          pagination.page === pageNum
                            ? "bg-primary text-white shadow-sm"
                            : "text-text-muted hover:text-text hover:bg-slate-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => {
                    setPage((p) => Math.min(pagination.totalPages, p + 1));
                    window.scrollTo({ top: 300, behavior: "smooth" });
                  }}
                >
                  {t("medicine.next")}
                  <ChevronRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {category === "all" && !query && popularMedicines.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display font-bold text-lg text-text mb-4">{t("medicine.popularMedicines")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularMedicines.map((m) => (
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
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 card px-5 py-3.5 flex items-center gap-4 shadow-card-hover border border-primary/20 bg-white/95 backdrop-blur-md">
          <span className="text-sm font-semibold text-text">{compareIds.length}/2 {t("medicine.compareSelected")}</span>
          <Button
            variant="primary"
            size="sm"
            icon={GitCompare}
            disabled={compareIds.length < 2}
            onClick={() => navigate(`/compare?a=${compareIds[0]}&b=${compareIds[1]}`)}
          >
            {t("medicine.compareNow")}
          </Button>
          <button
            onClick={() => setCompareIds([])}
            className="text-text-muted hover:text-text p-1 rounded-md hover:bg-slate-100 transition-colors"
            aria-label="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}