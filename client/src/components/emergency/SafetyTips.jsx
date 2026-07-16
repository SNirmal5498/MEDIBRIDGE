import { ShieldAlert } from "lucide-react";
import { SAFETY_TIPS } from "../../utils/emergencyData";

export default function SafetyTips() {
  return (
    <div className="card p-6">
      <h3 className="font-display font-bold text-lg text-text mb-4">Safety Tips</h3>
      <ul className="space-y-3">
        {SAFETY_TIPS.map((tip) => (
          <li key={tip} className="flex items-start gap-2.5 text-sm text-text">
            <ShieldAlert className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}