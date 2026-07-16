import { Star, MapPin, Phone, Navigation, HeartPulse, Clock } from "lucide-react";
import Button from "../common/Button";

export default function HospitalCard({ hospital }) {
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(hospital.address)}`;

  return (
    <div className="card card-hover p-5 flex flex-col">
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display font-bold text-text leading-snug">{hospital.name}</h3>
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-50 text-primary-hover shrink-0">
            <HeartPulse className="w-3.5 h-3.5" />
            {hospital.emergency}
          </span>
        </div>

        <div className="flex items-center gap-1 mt-2">
          <Star className="w-3.5 h-3.5 text-warning fill-warning" />
          <span className="text-sm font-semibold text-text">{hospital.rating}</span>
        </div>

        <div className="mt-3 space-y-1.5">
          <p className="flex items-center gap-2 text-sm text-text-muted">
            <MapPin className="w-4 h-4 shrink-0" />
            {hospital.address} · {hospital.distance}
          </p>
          <p className="flex items-center gap-2 text-sm text-text-muted">
            <Clock className="w-4 h-4 shrink-0" />
            {hospital.travelTime}
          </p>
          <p className="flex items-center gap-2 text-sm text-text-muted">
            <Phone className="w-4 h-4 shrink-0" />
            {hospital.phone}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex gap-2">
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
          href={`https://maps.google.com/dir/?api=1&destination=${encodeURIComponent(hospital.address)}`}
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
    </div>
  );
}