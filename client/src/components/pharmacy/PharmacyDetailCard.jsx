import {
  Star,
  MapPin,
  Phone,
  Navigation,
  Clock,
  Car,
  Footprints,
  ShoppingCart,
  Lock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../hooks/useLanguage";
import { getMedicineById } from "../../utils/medicineData";
import { formatAddress, formatPharmacyName, formatTravelTime } from "../../utils/formatters";
import Button from "../common/Button";

export default function PharmacyDetailCard({ pharmacy }) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const availabilityMap = {
    "in-stock": {
      label: t("pharmacy.inStock"),
      icon: CheckCircle2,
      className: "bg-primary-50 text-primary-hover",
    },
    limited: {
      label: t("pharmacy.limitedStock"),
      icon: AlertTriangle,
      className: "bg-amber-50 text-amber-700",
    },
    out: {
      label: t("pharmacy.outOfStock"),
      icon: XCircle,
      className: "bg-danger-50 text-danger",
    },
  };

  const isOut = pharmacy.availability === "out" || (pharmacy.stock !== undefined && pharmacy.stock <= 0);
  const currentAvailKey = isOut ? "out" : pharmacy.availability || "in-stock";
  const availability = availabilityMap[currentAvailKey] || availabilityMap["in-stock"];
  const AvailabilityIcon = availability.icon;

  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(pharmacy.address)}`;
  const pharmacyName = formatPharmacyName(pharmacy.name, language.code);
  const pharmacyAddress = formatAddress(pharmacy.address, language.code);

  const displayDistance = pharmacy.distanceKm !== undefined ? `${pharmacy.distanceKm} km` : pharmacy.distance || "1.0 km";
  const driveTime = pharmacy.travelTimeDrive || pharmacy.travelTime?.drive;
  const walkTime = pharmacy.travelTimeWalk || pharmacy.travelTime?.walk;

  const handleOrderNow = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isOut) return;
    if (pharmacy.otc === false) return;

    const medicine = getMedicineById(pharmacy.medicineName || pharmacy.name) || {
      id: pharmacy.medicineId || "med-paracetamol",
      name: pharmacy.medicineName || pharmacy.name || "Paracetamol",
      brand: pharmacy.medicineName || pharmacy.name || "Paracetamol",
      genericName: pharmacy.genericName || "Paracetamol",
      price: pharmacy.price || 20,
      otc: pharmacy.otc !== false,
    };

    addToCart(medicine, pharmacy, 1);
    navigate("/checkout");
  };

  return (
    <div className="card card-hover p-5 flex flex-col justify-between">
      <div className="flex-1">
        {/* Header: logo + name + rating + open/closed */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="grid place-items-center w-11 h-11 rounded-xl bg-primary-50 text-primary-hover shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-text leading-snug">{pharmacyName}</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                <span className="text-xs font-semibold text-text">{pharmacy.rating ?? 4.5}</span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {pharmacy.stockType === "sample" ? t("pharmacy.demoData") : t("pharmacy.verifiedStock")}
                </span>
              </div>
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

        {/* Availability badge */}
        <div className="mt-3 flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full ${availability.className}`}>
            <AvailabilityIcon className="w-3.5 h-3.5" />
            {availability.label}
          </span>
          {pharmacy.price !== undefined && (
            <span className="font-display font-extrabold text-lg text-primary-hover">₹{pharmacy.price}</span>
          )}
        </div>

        {/* Distance / travel time */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-muted">
          <span className="flex items-center gap-1.5 font-semibold text-text">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            {displayDistance}
          </span>
          {driveTime && (
            <span className="flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 shrink-0" />
              {driveTime}
            </span>
          )}
          {walkTime && (
            <span className="flex items-center gap-1.5">
              <Footprints className="w-3.5 h-3.5 shrink-0" />
              {walkTime}
            </span>
          )}
        </div>

        {/* Closing/opening time */}
        <p className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          {pharmacy.isOpen ? `${t("pharmacy.closesAt")} ${pharmacy.closingTime || "10:00 PM"}` : `${t("pharmacy.opensAt")} ${pharmacy.openingTime || "08:00 AM"}`}
        </p>

        {/* Address + phone */}
        <div className="mt-2 space-y-1 text-xs text-text-muted">
          <p className="line-clamp-2">{pharmacyAddress}</p>
          <p className="flex items-center gap-1.5 font-mono text-[11px] pt-1">
            <Phone className="w-3.5 h-3.5 shrink-0 text-text-muted" />
            {pharmacy.phone}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 pt-4 border-t border-border space-y-2">
        <div className="flex gap-2">
          <Button
            as="a"
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            variant="secondary"
            size="sm"
            icon={MapPin}
            className="flex-1 !bg-primary-50 hover:!bg-primary-100 text-xs"
          >
            {t("pharmacy.viewMap")}
          </Button>
          <Button
            as="a"
            href={`https://maps.google.com/dir/?api=1&destination=${encodeURIComponent(pharmacy.address)}`}
            target="_blank"
            rel="noreferrer"
            variant="secondary"
            size="sm"
            icon={Navigation}
            className="flex-1 text-xs"
          >
            {t("pharmacy.getDirections")}
          </Button>
        </div>

        {isOut ? (
          <div className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 rounded-xl py-2 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-500" /> {t("pharmacy.outOfStockOrderUnavailable")}
          </div>
        ) : pharmacy.otc === false ? (
          <div className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl py-2">
            <Lock className="w-3.5 h-3.5" /> {t("medicine.prescriptionRequired")}
          </div>
        ) : (
          <Button variant="primary" size="sm" icon={ShoppingCart} onClick={handleOrderNow} className="w-full text-xs">
            {t("medicine.orderNow")}
          </Button>
        )}
      </div>
    </div>
  );
}