import { Star, MapPin, Phone, Clock, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

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

export default function PharmacySummary({ pharmacy }) {
  const availability = AVAILABILITY["in-stock"];
  const AvailabilityIcon = availability.icon;

  return (
    <div className="card p-6">
      <h3 className="font-display font-bold text-lg text-text mb-4">Pharmacy Information</h3>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="grid place-items-center w-10 h-10 rounded-xl bg-primary-50 text-primary-hover shrink-0">
            <Star className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-text">{pharmacy.name}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3.5 h-3.5 text-warning fill-warning" />
              <span className="text-sm font-semibold text-text">{pharmacy.rating}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <MapPin className="w-4 h-4 shrink-0" />
          <span>{pharmacy.address}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Phone className="w-4 h-4 shrink-0" />
          <span>{pharmacy.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <MapPin className="w-4 h-4 shrink-0 opacity-0" />
          <span>{pharmacy.distance}</span>
        </div>
        <div className="flex items-center gap-2">
          <AvailabilityIcon className="w-4 h-4" />
          <span className={`text-sm font-semibold ${availability.className} px-2.5 py-1 rounded-full`}>
            {availability.label}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Clock className="w-4 h-4 shrink-0" />
          <span>Preparation: 15–20 minutes</span>
        </div>
      </div>
    </div>
  );
}
