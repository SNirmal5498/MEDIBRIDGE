import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  GitCompare,
  X,
  PackageOpen,
} from "lucide-react";
import Hero from "../../components/home/Hero";
import MedicineCard from "../../components/medicine/MedicineCard";
import Button from "../../components/common/Button";
import { medicineService } from "../../services/medicineService";
import { useLanguage } from "../../hooks/useLanguage";

const ITEMS_PER_PAGE = 12;

function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }
  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export default function Home() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const langCode = language?.code || "en";

  const catalogRef = useRef(null);
  const isAppendRef = useRef(false);
  const prevLangRef = useRef(langCode);

  const [medicines, setMedicines] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [compareIds, setCompareIds] = useState([]);

  // Fetch catalog on mount, page change, language change, or retry
  useEffect(() => {
    // If language changed, reset to page 1 to reload catalog in the new language
    if (prevLangRef.current !== langCode) {
      prevLangRef.current = langCode;
      isAppendRef.current = false;
      if (currentPage !== 1) {
        setCurrentPage(1);
        return;
      }
    }

    let isMounted = true;
    const isAppend = isAppendRef.current;
    isAppendRef.current = false;

    if (isAppend) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setFetchError(null);

    medicineService
      .search({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        lang: langCode,
      })
      .then((res) => {
        if (!isMounted) return;
        const rawList = res?.medicines || [];

        if (isAppend) {
          setMedicines((prev) => {
            const seen = new Set(prev.map((m) => m.id || m._id));
            const additions = rawList.filter((m) => {
              const id = m.id || m._id;
              return id && !seen.has(id);
            });
            return [...prev, ...additions];
          });
        } else {
          const seen = new Set();
          const unique = [];
          for (const m of rawList) {
            const id = m.id || m._id;
            if (id && !seen.has(id)) {
              seen.add(id);
              unique.push(m);
            }
          }
          setMedicines(unique);
        }

        if (res?.pagination) {
          setPagination(res.pagination);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error loading medicines on Home page:", err);
        setFetchError(err?.message || "Failed to load medicines from catalog");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
        setLoadingMore(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentPage, langCode, retryCount]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages || newPage === currentPage) return;
    isAppendRef.current = false;
    setCurrentPage(newPage);
    catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleLoadMore = () => {
    if (currentPage >= pagination.totalPages || loading || loadingMore) return;
    isAppendRef.current = true;
    setCurrentPage((prev) => prev + 1);
  };

  const handleRetry = () => {
    setRetryCount((c) => c + 1);
  };

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const pageNumbers = getPageNumbers(currentPage, pagination.totalPages);

  return (
    <div className="pb-16">
      {/* 1. Hero Section - Existing component untouched */}
      <Hero />

      {/* 2. All Medicines Section */}
      <section
        ref={catalogRef}
        id="all-medicines"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14"
        aria-label="All Medicines Catalog"
      >
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border mb-8">
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-text tracking-tight">
              {t("medicine.allMedicines")}
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              {t("medicine.subtitle")}
            </p>
          </div>

          {pagination.total > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-hover border border-primary/20 shrink-0 self-start sm:self-auto">
              {pagination.total} {t("medicine.resultsFound")}
            </span>
          )}
        </div>

        {/* Error Alert */}
        {fetchError && (
          <div className="rounded-2xl border border-danger/20 bg-danger-50 p-6 mb-8 text-center">
            <div className="flex items-center justify-center gap-2 text-danger font-semibold text-base mb-1">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{t("common.error")}</span>
            </div>
            <p className="text-text-muted text-sm max-w-md mx-auto mb-4">{fetchError}</p>
            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              onClick={handleRetry}
              disabled={loading || loadingMore}
            >
              {t("common.tryAgain")}
            </Button>
          </div>
        )}

        {/* Loading Skeleton on Initial Load or Page Switch without cached items */}
        {loading && medicines.length === 0 ? (
          <div>
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-text-muted font-medium mb-4">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>{t("medicine.loading")}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <div key={i} className="card p-5 animate-pulse flex flex-col h-full min-h-[360px]">
                  <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
                  <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-2/3 mb-4" />
                  <div className="h-8 bg-slate-200 rounded w-1/4 mt-auto mb-4" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-9 bg-slate-200 rounded" />
                    <div className="h-9 bg-slate-200 rounded" />
                  </div>
                  <div className="h-9 bg-slate-200 rounded mt-2" />
                </div>
              ))}
            </div>
          </div>
        ) : !loading && !fetchError && medicines.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 card p-8 my-6">
            <PackageOpen className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <h3 className="text-lg font-bold text-text mb-1">{t("medicine.noMedicines")}</h3>
            <p className="text-sm text-text-muted max-w-md mx-auto">{t("medicine.noMedicinesDesc")}</p>
          </div>
        ) : (
          /* Medicine Cards Grid */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {medicines.map((med) => {
                const medId = med.id || med._id;
                return (
                  <MedicineCard
                    key={medId}
                    medicine={med}
                    compareSelected={compareIds.includes(medId)}
                    compareDisabled={compareIds.length >= 2}
                    onToggleCompare={toggleCompare}
                  />
                );
              })}
            </div>

            {/* Catalog Controls: Load More and Pagination */}
            <div className="mt-10 pt-6 border-t border-border flex flex-col items-center gap-6">
              {/* Load More Button */}
              {currentPage < pagination.totalPages && (
                <Button
                  variant="primary"
                  size="md"
                  disabled={loadingMore || loading}
                  onClick={handleLoadMore}
                  className="shadow-sm hover:shadow"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t("common.loading")}
                    </>
                  ) : (
                    t("medicine.loadMore")
                  )}
                </Button>
              )}

              {/* Numbered Pagination Bar */}
              {pagination.totalPages > 1 && (
                <div className="w-full flex flex-col items-center gap-3">
                  <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={currentPage <= 1 || loading || loadingMore}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1 shrink-0" />
                      {t("medicine.previous")}
                    </Button>

                    <div className="flex items-center gap-1">
                      {pageNumbers.map((p, idx) =>
                        p === "..." ? (
                          <span
                            key={`ellipsis-${idx}`}
                            className="px-2 text-text-muted text-sm select-none"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => handlePageChange(p)}
                            disabled={loading || loadingMore}
                            className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                              currentPage === p
                                ? "bg-primary text-white shadow-sm"
                                : "text-text-muted hover:text-text hover:bg-slate-100"
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={currentPage >= pagination.totalPages || loading || loadingMore}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      {t("medicine.next")}
                      <ChevronRight className="w-4 h-4 ml-1 shrink-0" />
                    </Button>
                  </div>

                  <p className="text-xs text-text-muted font-medium">
                    {t("medicine.page")} {currentPage} {t("medicine.of")} {pagination.totalPages}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </section>

      {/* Floating Comparison Drawer */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 card px-5 py-3.5 flex items-center gap-4 shadow-card-hover border border-primary/20 bg-white/95 backdrop-blur-md">
          <span className="text-sm font-semibold text-text">
            {compareIds.length}/2 {t("medicine.compareSelected")}
          </span>
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