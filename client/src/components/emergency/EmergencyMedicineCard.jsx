import { Pill } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { useLanguage } from "../../hooks/useLanguage";
import { formatBrandName } from "../../utils/formatters";

const AVAILABILITY_STYLES = {
  "In Stock": "bg-primary-50 text-primary-hover",
  "Limited Stock": "bg-amber-50 text-amber-700",
  "Out of Stock": "bg-danger-50 text-danger",
};

export default function EmergencyMedicineCard({ medicine }) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const availabilityLabel =
    medicine.availability === "In Stock"
      ? t("pharmacy.inStock")
      : medicine.availability === "Limited Stock"
      ? t("pharmacy.limitedStock")
      : t("pharmacy.outOfStock");

  const name = formatBrandName(medicine.name, language.code);

  return (
    <div className="card card-hover p-5 flex flex-col">
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="grid place-items-center w-10 h-10 rounded-xl bg-primary-50 text-primary-hover shrink-0">
            <Pill className="w-5 h-5" />
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${AVAILABILITY_STYLES[medicine.availability]}`}>
            {availabilityLabel}
          </span>
        </div>

        <h3 className="mt-3 font-display font-bold text-text">{name}</h3>
        <p className="text-sm text-text-muted mt-1">
          {t(`emMedicine.purpose.${medicine.id}`) || medicine.purpose}
        </p>
        <p className="mt-3 font-display font-extrabold text-lg text-primary-hover">₹{medicine.price}</p>
      </div>

      <Button
        variant="secondary"
        size="sm"
        className="w-full mt-4"
        onClick={() => navigate("/medicine?q=" + encodeURIComponent(medicine.name))}
      >
        {t("medicine.viewDetails")}
      </Button>
    </div>
  );
}