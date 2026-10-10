import { useState, useEffect } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import pharmacyService from "../../services/pharmacyService";
import PharmacyCard from "../common/PharmacyCard";
import Button from "../common/Button";
import { useLanguage } from "../../hooks/useLanguage";

export default function PharmacySection() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadPharmacies() {
      try {
        const res = await pharmacyService.getPharmacies();
        if (isMounted) {
          setPharmacies(res?.pharmacies || []);
        }
      } catch (e) {
        if (isMounted) setPharmacies([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadPharmacies();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-wider text-primary-hover uppercase">{t("pharmacy.nearbyPharmaciesTag")}</span>
          <h2 className="mt-2 font-display font-extrabold text-2xl sm:text-3xl text-text">
            {t("pharmacy.stockingTitle")}
          </h2>
        </div>
        <Button variant="secondary" icon={ArrowRight} iconPosition="right" onClick={() => navigate("/pharmacy")}>
          {t("pharmacy.viewAll")}
        </Button>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex items-center gap-2 text-text-muted text-sm py-4">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span>{t("pharmacy.loading")}</span>
          </div>
        ) : pharmacies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pharmacies.map((pharmacy) => (
              <PharmacyCard key={pharmacy.id || pharmacy._id} pharmacy={pharmacy} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted py-4 bg-slate-50 rounded-xl px-4 border border-border">
            {t("pharmacy.noPharmacies")}
          </p>
        )}
      </div>
    </section>
  );
}