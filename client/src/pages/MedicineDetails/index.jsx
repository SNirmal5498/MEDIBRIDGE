import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Pill, ShoppingCart, Lock, GitCompare, Star, ChevronRight, Loader2 } from "lucide-react";
import { getMedicineById as getLocalMedicineById } from "../../utils/medicineData";
import { medicineService } from "../../services/medicineService";
import { PHARMACIES } from "../../utils/constants";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../hooks/useLanguage";
import { getCategoryTranslation } from "../../i18n/i18n";
import Button from "../../components/common/Button";
import MedicineCard from "../../components/medicine/MedicineCard";
import PharmacyCard from "../../components/common/PharmacyCard";
import NotFound from "../NotFound";
import {
  formatBrandName,
  formatGenericName,
  formatStrength,
  formatManufacturer,
  formatPackSize,
  formatMedicineText,
} from "../../utils/formatters";

import { useDynamicTranslation } from "../../hooks/useDynamicTranslation";

const RECENT_KEY = "medibridge_recently_viewed";

function saveRecentlyViewed(med) {
  try {
    const existing = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    const updated = [med.id, ...existing.filter((x) => x !== med.id)].slice(0, 6);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch (e) {
    // ignore
  }
}

function Section({ title, children }) {
  return (
    <div className="border-t border-border pt-6 mt-6 first:border-0 first:pt-0 first:mt-0">
      <h2 className="font-display font-bold text-lg text-text mb-3">{title}</h2>
      {children}
    </div>
  );
}

export default function MedicineDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();

  const [medicine, setMedicine] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { data: displayMedicine } = useDynamicTranslation(medicine, "medicine");
  const activeMed = displayMedicine || medicine;

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      setError(false);
      try {
        const res = await medicineService.getById(id);
        const med = res?.medicine || res?.data;
        if (isMounted && med && med.id) {
          setMedicine(med);
          saveRecentlyViewed(med);

          // Fetch alternatives
          try {
            const altRes = await medicineService.getAlternatives(id);
            const alts = altRes?.alternatives || altRes?.data;
            if (isMounted && Array.isArray(alts)) {
              setAlternatives(alts);
            }
          } catch (e) {
            // Ignore alternatives error
          }
          return;
        }
      } catch (err) {
        // Fallback to local mock if exists
        const localMed = getLocalMedicineById(id);
        if (isMounted && localMed) {
          setMedicine(localMed);
          saveRecentlyViewed(localMed);
          return;
        }
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleOrderNow = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!medicine || !medicine.otc) return;

    const defaultPharmacy = PHARMACIES[0];
    addToCart(medicine, defaultPharmacy, 1);
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-text-muted">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-sm font-medium">{t("medicine.loading")}</p>
      </div>
    );
  }

  if (error || !medicine) return <NotFound />;

  const isOtc = activeMed.otc === true || activeMed.prescriptionRequired === false;

  const warningLabelMap = {
    pregnancy: t("details.pregnancy"),
    breastfeeding: t("details.breastfeeding"),
    kidneyDisease: t("details.kidneyDisease"),
    liverDisease: t("details.liverDisease"),
    alcohol: t("details.alcohol"),
    driving: t("details.driving"),
  };

  const brand = formatBrandName(activeMed.brand || activeMed.name, language.code);
  const generic = formatGenericName(activeMed.genericName, language.code);
  const strength = formatStrength(activeMed.strength, language.code);
  const mfg = formatManufacturer(activeMed.manufacturer, language.code);
  const pack = formatPackSize(activeMed.packSize, language.code);
  const description = formatMedicineText(activeMed.description, language.code);
  const storage = formatMedicineText(activeMed.storage, language.code);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-1.5 text-sm text-text-muted mb-6">
        <Link to="/medicine" className="hover:text-primary-hover">{t("medicine.title")}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-text font-medium">{brand}</span>
      </div>

      <div className="card p-6 sm:p-8 flex flex-col sm:flex-row gap-8">
        <div className="w-full sm:w-56 aspect-square rounded-2xl bg-primary-50 grid place-items-center shrink-0">
          <Pill className="w-16 h-16 text-primary/40" />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-text-muted">
              {getCategoryTranslation(language.code, activeMed.category)}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                isOtc ? "bg-primary-50 text-primary-hover" : "bg-danger-50 text-danger"
              }`}
            >
              {isOtc ? t("medicine.otc") : t("medicine.prescriptionRequired")}
            </span>
          </div>

          <dl className="space-y-2.5">
            <div className="flex flex-wrap gap-x-2 gap-y-0.5">
              <dt className="text-sm font-semibold text-text-muted w-36 shrink-0">{t("details.brand")}</dt>
              <dd className="font-display font-extrabold text-2xl text-text">{brand}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 items-baseline">
              <dt className="text-sm font-semibold text-text-muted w-36 shrink-0">{t("details.genericName")}</dt>
              <dd className="text-sm text-text">{generic} {strength ? `· ${strength}` : ""}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 items-baseline">
              <dt className="text-sm font-semibold text-text-muted w-36 shrink-0">{t("details.manufacturer")}</dt>
              <dd className="text-sm text-text">{mfg} {pack ? `· ${pack}` : ""}</dd>
            </div>
            {activeMed.rating && (
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 items-center">
                <dt className="text-sm font-semibold text-text-muted w-36 shrink-0">{t("details.rating")}</dt>
                <dd className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-warning fill-warning" />
                  <span className="text-sm font-semibold text-text">{activeMed.rating}</span>
                </dd>
              </div>
            )}
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 items-baseline">
              <dt className="text-sm font-semibold text-text-muted w-36 shrink-0">{t("details.price")}</dt>
              <dd className="font-display font-extrabold text-2xl text-primary-hover">₹{activeMed.price}</dd>
            </div>
          </dl>

          {description && (
            <p className="mt-4 text-sm text-text-muted leading-relaxed">{description}</p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {isOtc ? (
              <Button variant="primary" icon={ShoppingCart} onClick={handleOrderNow}>{t("medicine.orderNow")}</Button>
            ) : (
              <Button variant="secondary" icon={Lock} disabled>{t("medicine.prescriptionRequired")}</Button>
            )}
            <Button variant="secondary" icon={GitCompare} onClick={() => navigate(`/compare?a=${activeMed.id}`)}>
              {t("medicine.compare")}
            </Button>
          </div>
        </div>
      </div>

      <div className="card p-6 sm:p-8 mt-6">
        {activeMed.uses && activeMed.uses.length > 0 && (
          <Section title={t("details.uses")}>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-text">
              {activeMed.uses.map((u) => <li key={u}>{formatMedicineText(u, language.code)}</li>)}
            </ul>
          </Section>
        )}

        {activeMed.dosage && (
          <Section title={t("details.dosage")}>
            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              {activeMed.dosage.adults && <div><dt className="font-semibold text-text">{t("details.adults")}</dt><dd className="text-text-muted mt-1">{formatMedicineText(activeMed.dosage.adults, language.code)}</dd></div>}
              {activeMed.dosage.children && <div><dt className="font-semibold text-text">{t("details.children")}</dt><dd className="text-text-muted mt-1">{formatMedicineText(activeMed.dosage.children, language.code)}</dd></div>}
              {activeMed.dosage.missedDose && <div><dt className="font-semibold text-text">{t("details.missedDose")}</dt><dd className="text-text-muted mt-1">{formatMedicineText(activeMed.dosage.missedDose, language.code)}</dd></div>}
              {activeMed.dosage.overdose && <div><dt className="font-semibold text-text">{t("details.overdose")}</dt><dd className="text-text-muted mt-1">{formatMedicineText(activeMed.dosage.overdose, language.code)}</dd></div>}
            </dl>
          </Section>
        )}

        {activeMed.sideEffects && (
          <Section title={t("details.sideEffects")}>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {activeMed.sideEffects.common && activeMed.sideEffects.common.length > 0 && (
                <div>
                  <p className="font-semibold text-text mb-1.5">{t("details.commonSideEffects")}</p>
                  <ul className="list-disc list-inside space-y-1 text-text-muted">
                    {activeMed.sideEffects.common.map((s) => <li key={s}>{formatMedicineText(s, language.code)}</li>)}
                  </ul>
                </div>
              )}
              {activeMed.sideEffects.rare && activeMed.sideEffects.rare.length > 0 && (
                <div>
                  <p className="font-semibold text-text mb-1.5">{t("details.rareSideEffects")}</p>
                  <ul className="list-disc list-inside space-y-1 text-text-muted">
                    {activeMed.sideEffects.rare.map((s) => <li key={s}>{formatMedicineText(s, language.code)}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </Section>
        )}

        {activeMed.warnings && (
          <Section title={t("details.warnings")}>
            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              {Object.entries(activeMed.warnings).map(([key, value]) => (
                <div key={key}>
                  <dt className="font-semibold text-text capitalize">{warningLabelMap[key] || key}</dt>
                  <dd className="text-text-muted mt-1">{formatMedicineText(value, language.code)}</dd>
                </div>
              ))}
            </dl>
          </Section>
        )}

        {activeMed.interactions && (
          <Section title={t("details.drugInteractions")}>
            {activeMed.interactions.length > 0 ? (
              <ul className="list-disc list-inside space-y-1.5 text-sm text-text-muted">
                {activeMed.interactions.map((i) => <li key={i}>{formatMedicineText(i, language.code)}</li>)}
              </ul>
            ) : (
              <p className="text-sm text-text-muted">{t("details.noInteractions") || "No major interactions reported."}</p>
            )}
          </Section>
        )}

        {activeMed.foodInteractions && (
          <Section title={t("details.foodInteractions")}>
            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              {activeMed.foodInteractions.beforeFood && <div><dt className="font-semibold text-text">{t("details.beforeFood")}</dt><dd className="text-text-muted mt-1">{formatMedicineText(activeMed.foodInteractions.beforeFood, language.code)}</dd></div>}
              {activeMed.foodInteractions.afterFood && <div><dt className="font-semibold text-text">{t("details.afterFood")}</dt><dd className="text-text-muted mt-1">{formatMedicineText(activeMed.foodInteractions.afterFood, language.code)}</dd></div>}
            </dl>
            {activeMed.foodInteractions.avoid && activeMed.foodInteractions.avoid.length > 0 && (
              <p className="mt-3 text-sm text-text-muted">
                <span className="font-semibold text-text">{t("details.foodsToAvoid")}: </span>
                {activeMed.foodInteractions.avoid.map((item) => formatMedicineText(item, language.code)).join(", ")}
              </p>
            )}
          </Section>
        )}

        {storage && (
          <Section title={t("details.storage")}>
            <p className="text-sm text-text-muted">{storage}</p>
          </Section>
        )}
      </div>

      {alternatives.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display font-bold text-lg text-text mb-4">{t("details.alternatives")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {alternatives.map((m) => <MedicineCard key={m.id} medicine={m} onToggleCompare={() => {}} />)}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-display font-bold text-lg text-text mb-4">{t("details.nearbyPharmacies")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PHARMACIES.map((p) => <PharmacyCard key={p.id} pharmacy={p} />)}
        </div>
      </section>
    </div>
  );
}