import { AlertTriangle } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function PrescriptionWarning() {
  const { t } = useLanguage();

  return (
    <div className="card p-6 bg-danger-50 border-danger">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-danger mb-1">{t("checkout.prescriptionRequiredTitle")}</h3>
          <p className="text-sm text-danger/80">
            {t("checkout.prescriptionRequiredDesc")}
          </p>
        </div>
      </div>
    </div>
  );
}

