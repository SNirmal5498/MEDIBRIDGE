import { Link } from "react-router-dom";
import { Building2, MapPin, Phone, Navigation, Star } from "lucide-react";
import Button from "../common/Button";
import { useLanguage } from "../../hooks/useLanguage";
import { formatAddress, formatPharmacyName } from "../../utils/formatters";

export default function SavedPharmacies({ pharmacies, onRemove }) {
  const { t } = useLanguage();

  return (
    <section>
      <div className="flex items-end justify-between gap-3 mb-5">
        <div>
          <h2 className="font-display font-bold text-xl text-text">{t("profile.savedPharmacies")}</h2>
          <p className="mt-1 text-sm text-text-muted">{t("profile.savedPharmaciesSubtitle")}</p>
        </div>
        <Button as={Link} to="/pharmacy" variant="ghost" size="sm">
          {t("categories.viewAll")}
        </Button>
      </div>

      {pharmacies.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="mx-auto grid place-items-center w-12 h-12 rounded-2xl bg-primary-50 text-primary-hover mb-3">
            <Building2 className="w-5 h-5" />
          </div>
          <p className="text-sm text-text-muted">{t("profile.noSavedPharmacies")}</p>
          <Button as={Link} to="/pharmacy" variant="primary" size="sm" className="mt-4 inline-flex">
            {t("pharmacy.findPharmacies")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pharmacies.map((pharmacy) => {
            const directionsUrl = `https://maps.google.com/dir/?api=1&destination=${encodeURIComponent(
              pharmacy.address
            )}`;
            const name = formatPharmacyName(pharmacy.name, t);
            const address = formatAddress(pharmacy.address, t);

            return (
              <article key={pharmacy.id} className="card p-5 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display font-bold text-text">{name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                      <span className="text-sm font-semibold text-text">{pharmacy.rating}</span>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                      pharmacy.isOpen ? "bg-primary-50 text-primary-hover" : "bg-danger-50 text-danger"
                    }`}
                  >
                    {pharmacy.isOpen ? t("pharmacy.open") : t("pharmacy.closed")}
                  </span>
                </div>

                <div className="mt-4 space-y-2 flex-1">
                  <p className="flex items-center gap-2 text-sm text-text-muted">
                    <MapPin className="w-4 h-4 shrink-0" />
                    {address} · {pharmacy.distance}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-text-muted">
                    <Phone className="w-4 h-4 shrink-0" />
                    {pharmacy.phone}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  <div className="flex gap-2">
                    <Button as={Link} to="/pharmacy" variant="primary" size="sm" className="flex-1">
                      {t("profile.viewPharmacy")}
                    </Button>
                    <Button
                      as="a"
                      href={directionsUrl}
                      target="_blank"
                      rel="noreferrer"
                      variant="secondary"
                      size="sm"
                      icon={Navigation}
                      className="flex-1"
                    >
                      {t("pharmacy.getDirections")}
                    </Button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(pharmacy.id)}
                    className="w-full text-xs font-semibold text-text-muted hover:text-danger py-1 transition-colors"
                  >
                    {t("compare.remove")}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

