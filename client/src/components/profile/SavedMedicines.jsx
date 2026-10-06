import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import Button from "../common/Button";
import { formatINR } from "../../utils/helpers";
import { useLanguage } from "../../hooks/useLanguage";
import { formatBrandName, formatGenericName, formatStrength } from "../../utils/formatters";

export default function SavedMedicines({ medicines, onRemove }) {
  const { t, language } = useLanguage();

  return (
    <section>
      <div className="flex items-end justify-between gap-3 mb-5">
        <div>
          <h2 className="font-display font-bold text-xl text-text">{t("profile.savedMedicines")}</h2>
          <p className="mt-1 text-sm text-text-muted">{t("profile.savedMedicinesSubtitle")}</p>
        </div>
        <Button as={Link} to="/favorites" variant="ghost" size="sm">
          {t("categories.viewAll")}
        </Button>
      </div>

      {medicines.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="mx-auto grid place-items-center w-12 h-12 rounded-2xl bg-primary-50 text-primary-hover mb-3">
            <Heart className="w-5 h-5" />
          </div>
          <p className="text-sm text-text-muted">{t("favorites.empty")}</p>
          <Button as={Link} to="/medicine" variant="primary" size="sm" className="mt-4 inline-flex">
            {t("favorites.browse")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {medicines.map((medicine) => {
            const brand = formatBrandName(medicine.brand || medicine.name, language.code);
            const generic = formatGenericName(medicine.genericName, language.code);
            const strength = formatStrength(medicine.strength, language.code);

            return (
              <article key={medicine.id} className="card p-5 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-bold text-text">{brand}</h3>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                      medicine.otc ? "bg-primary-50 text-primary-hover" : "bg-danger-50 text-danger"
                    }`}
                  >
                    {medicine.otc ? t("medicine.otc") : t("medicine.prescription")}
                  </span>
                </div>
                <p className="mt-1 text-sm text-text-muted">
                  {generic} {strength ? `· ${strength}` : ""}
                </p>
                <p className="mt-3 font-display font-extrabold text-lg text-primary-hover">
                  {formatINR(medicine.price)}
                </p>
                <div className="mt-auto pt-4 flex gap-2">
                  <Button as={Link} to={`/medicine/${medicine.id}`} variant="primary" size="sm" className="flex-1">
                    {t("medicine.viewDetails")}
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                    onClick={() => onRemove(medicine.id)}
                    aria-label={`Remove ${brand}`}
                  >
                    {t("compare.remove")}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

