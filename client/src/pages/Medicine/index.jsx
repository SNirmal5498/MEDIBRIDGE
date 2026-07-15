import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import MedicineSearchBar from "../../components/medicine/MedicineSearchBar";
import MedicineFilterChips from "../../components/medicine/MedicineFilterChips";
import MedicineCard from "../../components/medicine/MedicineCard";
import MedicineDetailPanel from "../../components/medicine/MedicineDetailPanel";
import { OTC_MEDICINES, PRESCRIPTION_MEDICINES } from "../../utils/constants";
import { matchesQuery } from "../../utils/helpers";

const ALL_MEDICINES = [...OTC_MEDICINES, ...PRESCRIPTION_MEDICINES];

export default function Medicine() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const results = useMemo(() => {
    return ALL_MEDICINES.filter((med) => {
      if (filter === "otc" && !med.otc) return false;
      if (filter === "prescription" && med.otc) return false;
      return matchesQuery(med, query);
    });
  }, [query, filter]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold tracking-wider text-primary-hover uppercase">Medicine Search</span>
        <h1 className="mt-2 font-display font-extrabold text-3xl sm:text-4xl text-text">
          Find & compare any medicine
        </h1>
        <p className="mt-3 text-text-muted">
          Search by name or brand, compare alternatives side by side, and order OTC medicines directly.
        </p>
      </div>

      {/* Search + filters */}
      <div className="mt-8 max-w-2xl mx-auto space-y-4">
        <MedicineSearchBar value={query} onChange={setQuery} resultCount={results.length} />
        <div className="flex justify-center">
          <MedicineFilterChips active={filter} onChange={setFilter} />
        </div>
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((med, i) => (
            <MedicineCard key={med.id} medicine={med} onSelect={setSelected} index={i} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <div className="mx-auto grid place-items-center w-14 h-14 rounded-2xl bg-primary-50 text-primary-hover mb-4">
            <SearchX className="w-6 h-6" />
          </div>
          <p className="font-display font-bold text-text">No medicines found</p>
          <p className="mt-1 text-sm text-text-muted">Try a different name, brand, or manufacturer.</p>
        </div>
      )}

      {/* Detail slide-over */}
      <MedicineDetailPanel medicine={selected} allMedicines={ALL_MEDICINES} onClose={() => setSelected(null)} />
    </section>
  );
}