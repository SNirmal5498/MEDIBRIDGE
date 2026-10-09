import { useState, useEffect, useMemo } from "react";
import pharmacyService from "../../services/pharmacyService";
import PharmacyDetailCard from "../../components/pharmacy/PharmacyDetailCard";
import PharmacySearchFilterBar from "../../components/pharmacy/PharmacySearchFilterBar";
import { useLanguage } from "../../hooks/useLanguage";
import { MapPin, Navigation, Loader2, AlertCircle, RefreshCw } from "lucide-react";

const AVAILABILITY_RANK = { "in-stock": 0, limited: 1, out: 2 };

export default function Pharmacy() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("distance");
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Geolocation & Manual Location state
  const [userCoords, setUserCoords] = useState(null); // { lat, lng }
  const [locationStatus, setLocationStatus] = useState("idle"); // idle, locating, success, denied, error
  const [locationLabel, setLocationLabel] = useState("Coimbatore, Tamil Nadu");

  const { t } = useLanguage();

  // Request browser geolocation on mount
  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }
    setLocationStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus("success");
        setLocationLabel(`GPS Location (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`);
      },
      (err) => {
        console.warn("Geolocation permission denied or unavailable:", err.message);
        setLocationStatus("denied");
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  };

  // Fetch real pharmacies from backend API
  const fetchPharmacies = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        search: query.trim() || undefined,
        filter: filter !== "all" ? filter : undefined,
        sort,
      };
      if (userCoords?.lat && userCoords?.lng) {
        params.lat = userCoords.lat;
        params.lng = userCoords.lng;
      }
      const res = await pharmacyService.getPharmacies(params);
      setPharmacies(res.pharmacies || []);
    } catch (err) {
      console.error("Failed to fetch nearby pharmacies:", err);
      setError("Unable to load live pharmacy directory. Please check network connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacies();
  }, [userCoords, query, filter, sort]);

  const filteredAndSorted = useMemo(() => {
    let list = [...pharmacies];

    if (filter === "open") list = list.filter((p) => p.isOpen);
    else if (filter === "in-stock") list = list.filter((p) => p.availability === "in-stock" || (p.stock && p.stock > 0));

    if (sort === "distance") list.sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));
    else if (sort === "rating") list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    else if (sort === "price") list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    else if (sort === "availability")
      list.sort((a, b) => (AVAILABILITY_RANK[a.availability] ?? 0) - (AVAILABILITY_RANK[b.availability] ?? 0));

    return list;
  }, [pharmacies, filter, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-text">{t("pharmacy.title")}</h1>
          <p className="mt-1.5 text-text-muted">
            {t("pharmacy.subtitle")}
          </p>
        </div>

        {/* Location Status Badge */}
        <div className="flex items-center gap-2 bg-surface p-2.5 rounded-2xl border border-border shrink-0">
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs font-semibold text-text truncate max-w-[200px]">
            {locationLabel}
          </span>
          <button
            onClick={requestLocation}
            disabled={locationStatus === "locating"}
            className="p-1 rounded-lg hover:bg-primary-50 text-primary transition-colors ml-1"
            title="Refresh GPS Location"
          >
            {locationStatus === "locating" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
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
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm font-semibold text-text-muted">{t("pharmacy.locating")}</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-2xl max-w-lg mx-auto space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-xs font-bold text-rose-800">{error}</p>
            <button
              onClick={fetchPharmacies}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> {t("common.tryAgain")}
            </button>
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="p-12 text-center text-sm text-text-muted bg-surface rounded-2xl border border-border space-y-2">
            <p className="font-bold text-text">{t("pharmacy.noPharmacies")}</p>
            <p className="text-xs">{t("pharmacy.noPharmaciesDesc")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAndSorted.map((pharmacy) => (
              <PharmacyDetailCard key={pharmacy.id || pharmacy._id} pharmacy={pharmacy} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}