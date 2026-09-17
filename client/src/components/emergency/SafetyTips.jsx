import { ShieldAlert } from "lucide-react";
import { SAFETY_TIPS } from "../../utils/emergencyData";
import { useLanguage } from "../../hooks/useLanguage";

export default function SafetyTips() {
  const { t } = useLanguage();

  return (
    <div className="card p-6">
      <h3 className="font-display font-bold text-lg text-text mb-4">
        {t("emergency.safetyTipsTitle")}
      </h3>
      <ul className="space-y-3">
        {SAFETY_TIPS.map((tip) => (
          <li key={tip} className="flex items-start gap-2.5 text-sm text-text">
            <ShieldAlert className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            {t(`emergency.safety.${tip}`) || tip}
          </li>
        ))}
      </ul>
    </div>
  );
}