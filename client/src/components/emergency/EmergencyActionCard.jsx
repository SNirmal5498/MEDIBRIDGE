import { Ambulance, Shield, Flame, AlertTriangle, Phone } from "lucide-react";
import Button from "../common/Button";

const ICONS = { Ambulance, Shield, Flame, AlertTriangle };

export default function EmergencyActionCard({ action }) {
  const Icon = ICONS[action.icon];

  return (
    <div className="card card-hover p-6 text-center flex flex-col items-center h-full">
      <div className="flex-1 flex flex-col items-center">
        <div className="grid place-items-center w-14 h-14 rounded-2xl bg-danger-50 text-danger mb-4">
          <Icon className="w-7 h-7" />
        </div>
        <h3 className="font-display font-bold text-text">{action.label}</h3>
        <p className="mt-1.5 font-display font-extrabold text-2xl text-danger">{action.number}</p>
        <p className="mt-1.5 text-xs text-text-muted leading-snug">{action.description}</p>
      </div>
      <Button
        as="a"
        href={`tel:${action.number.replace(/[^0-9]/g, "")}`}
        variant="danger"
        size="sm"
        icon={Phone}
        className="w-full mt-4"
      >
        {action.buttonLabel}
      </Button>
    </div>
  );
}