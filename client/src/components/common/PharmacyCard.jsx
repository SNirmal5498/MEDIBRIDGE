import { Star, MapPin, Phone, Navigation } from "lucide-react";
import Button from "./Button";
import { useLanguage } from "../../hooks/useLanguage";
import { formatAddress, formatPharmacyName } from "../../utils/formatters";

export default function PharmacyCard({ pharmacy }) {
  const { t } = useLanguage();
  const name = formatPharmacyName(pharmacy.name, t);
  const address = formatAddress(pharmacy.address, t);

  return (
    <div className="card card-hover p-5 flex flex-col">
      <div className="flex-1">
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

        <div className="mt-4 space-y-2">
          <p className="flex items-center gap-2 text-sm text-text-muted">
            <MapPin className="w-4 h-4 shrink-0" />
            {address} · {pharmacy.distance}
          </p>
          <p className="flex items-center gap-2 text-sm text-text-muted">
            <Phone className="w-4 h-4 shrink-0" />
            {pharmacy.phone}
          </p>
        </div>
      </div>

      <Button
        as="a"
        href={`https://maps.google.com/?q=${encodeURIComponent(pharmacy.address)}`}
        target="_blank"
        rel="noreferrer"
        variant="secondary"
        size="sm"
        icon={Navigation}
        className="w-full mt-auto pt-2 !bg-primary-50 hover:!bg-primary-100"
      >
        {t("pharmacy.viewMap")}
      </Button>
    </div>
  );
}