import { useState, useMemo } from "react";
import { getNearbyPharmacies } from "../../utils/pharmacyData";
import PharmacyDetailCard from "../../components/pharmacy/PharmacyDetailCard";
import PharmacySearchFilterBar from "../../components/pharmacy/PharmacySearchFilterBar";

const AVAILABILITY_RANK = { "in-stock": 0, limited: 1, out: 2 };

export default function Pharmacy() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("distance");

  const filtered = useMemo(() => {
    let list = getNearbyPharmacies();

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.medicineName.toLowerCase().includes(q)
      );
    }

    if (filter === "open") list = list.filter((p) => p.isOpen);
    else if (filter === "in-stock") list = list.filter((p) => p.availability === "in-stock");
    else if (filter === "otc") list = list.filter((p) => p.otc);
    else if (filter === "prescription") list = list.filter((p) => !p.otc);

    const sorted = [...list];
    if (sort === "distance") sorted.sort((a, b) => a.distanceKm - b.distanceKm);
    else if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    else if (sort === "price") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "availability")
      sorted.sort((a, b) => AVAILABILITY_RANK[a.availability] - AVAILABILITY_RANK[b.availability]);

    return sorted;
  }, [query, filter, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-text">Nearby Pharmacies</h1>
        <p className="mt-1.5 text-text-muted">
          Pharmacies stocking your medicine, sorted by distance from you.
        </p>
      </div>

      <PharmacySearchFilterBar
        query={query}
        onQueryChange={setQuery}
        filter={filter}
        onFilterChange={setFilter}
        sort={sort}
        onSortChange={setSort}
      />

      <div className="mt-8">
        {filtered.length === 0 ? (
          <p className="text-text-muted text-sm py-16 text-center">No pharmacies match your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((pharmacy) => (
              <PharmacyDetailCard key={pharmacy.id} pharmacy={pharmacy} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}