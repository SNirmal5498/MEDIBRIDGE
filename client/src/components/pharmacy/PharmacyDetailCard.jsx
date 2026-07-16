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
import Button from "../common/Button";

const AVAILABILITY = {
  "in-stock": {
    label: "In Stock",
    icon: CheckCircle2,
    className: "bg-primary-50 text-primary-hover",
  },
  limited: {
    label: "Limited Stock",
    icon: AlertTriangle,
    className: "bg-amber-50 text-amber-700",
  },
  out: {
    label: "Out of Stock",
    icon: XCircle,
    className: "bg-danger-50 text-danger",
  },
};

export default function PharmacyDetailCard({ pharmacy }) {
  const availability = AVAILABILITY[pharmacy.availability];
  const AvailabilityIcon = availability.icon;
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(pharmacy.address)}`;

  return (
    <div className="card card-hover p-5 flex flex-col">
      <div className="flex-1">
        {/* Header: logo + name + rating + open/closed */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="grid place-items-center w-11 h-11 rounded-xl bg-primary-50 text-primary-hover shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-text leading-snug">{pharmacy.name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                <span className="text-sm font-semibold text-text">{pharmacy.rating}</span>
              </div>
            </div>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
              pharmacy.isOpen ? "bg-primary-50 text-primary-hover" : "bg-danger-50 text-danger"
            }`}
          >
            {pharmacy.isOpen ? "Open" : "Closed"}
          </span>
        </div>

        {/* Availability badge */}
        <div className="mt-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full ${availability.className}`}>
            <AvailabilityIcon className="w-3.5 h-3.5" />
            {availability.label}
          </span>
        </div>

        {/* Distance / travel time */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-text-muted">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 shrink-0" />
            {pharmacy.distance}
          </span>
          <span className="flex items-center gap-1.5">
            <Car className="w-4 h-4 shrink-0" />
            {pharmacy.travelTime.drive}
          </span>
          <span className="flex items-center gap-1.5">
            <Footprints className="w-4 h-4 shrink-0" />
            {pharmacy.travelTime.walk}
          </span>
        </div>

        {/* Closing/opening time */}
        <p className="mt-2 flex items-center gap-1.5 text-sm text-text-muted">
          <Clock className="w-4 h-4 shrink-0" />
          {pharmacy.isOpen ? `Closes ${pharmacy.closingTime}` : `Opens ${pharmacy.openingTime}`}
        </p>

        {/* Address + phone */}
        <div className="mt-2 space-y-1.5">
          <p className="flex items-center gap-1.5 text-sm text-text-muted">
            <MapPin className="w-4 h-4 shrink-0 opacity-0" />
            <span className="-ml-[22px]">{pharmacy.address}</span>
          </p>
          <p className="flex items-center gap-1.5 text-sm text-text-muted">
            <Phone className="w-4 h-4 shrink-0" />
            {pharmacy.phone}
          </p>
        </div>

        {/* Price */}
        <p className="mt-3 font-display font-extrabold text-xl text-primary-hover">₹{pharmacy.price}</p>
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
            className="flex-1 !bg-primary-50 hover:!bg-primary-100"
          >
            View on Map
          </Button>
          <Button
            as="a"
            href={`https://maps.google.com/dir/?api=1&destination=${encodeURIComponent(pharmacy.address)}`}
            target="_blank"
            rel="noreferrer"
            variant="secondary"
            size="sm"
            icon={Navigation}
            className="flex-1"
          >
            Get Directions
          </Button>
        </div>

        {pharmacy.otc ? (
          <Button variant="primary" size="sm" icon={ShoppingCart} className="w-full">
            Order Now
          </Button>
        ) : (
          <div className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-text-muted bg-slate-100 rounded-xl py-2.5">
            <Lock className="w-3.5 h-3.5" /> Prescription Required
          </div>
        )}
      </div>
    </div>
  );
}