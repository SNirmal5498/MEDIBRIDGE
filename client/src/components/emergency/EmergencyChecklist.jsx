import { CheckSquare } from "lucide-react";
import { EMERGENCY_CHECKLIST } from "../../utils/emergencyData";
import { useLanguage } from "../../hooks/useLanguage";

export default function EmergencyChecklist() {
  const { t } = useLanguage();

  return (
    <div className="card p-6">
      <h3 className="font-display font-bold text-lg text-text mb-4">
        {t("emergency.checklistTitle")}
      </h3>
      <ul className="space-y-3">
        {EMERGENCY_CHECKLIST.map((item) => (
          <li key={item} className="flex items-center gap-2.5 text-sm text-text">
            <CheckSquare className="w-4 h-4 text-primary-hover shrink-0" />
            {t(`emergency.checklist.${item}`) || item}
          </li>
        ))}
      </ul>
    </div>
  );
}