import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Pill, ShoppingCart, Lock, GitCompare, Star, ChevronRight, Loader2 } from "lucide-react";
import { getMedicineById as getLocalMedicineById } from "../../utils/medicineData";
import pharmacyService from "../../services/pharmacyService";
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
import { useMedicineCardLocalization } from "../../hooks/useMedicineCardLocalization";

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
  const langCode = language?.code || "en";

  const [medicine, setMedicine] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [nearbyPharmacies, setNearbyPharmacies] = useState([]);
  const [pharmaciesLoading, setPharmaciesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { data: displayMedicine, loading: translationLoading } = useDynamicTranslation(medicine, "medicine");

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

  useEffect(() => {
    let isMounted = true;
    async function loadPharmacies() {
      setPharmaciesLoading(true);
      try {
        if (id) {
          const availRes = await pharmacyService.getMedicineAvailability(id);
          const availPharmacies = availRes?.pharmacies || availRes?.data || [];
          if (isMounted && Array.isArray(availPharmacies) && availPharmacies.length > 0) {
            setNearbyPharmacies(availPharmacies);
            setPharmaciesLoading(false);
            return;
          }
        }
        // Fallback to all active pharmacies in DB
        const allRes = await pharmacyService.getPharmacies();
        const allPharmacies = allRes?.pharmacies || allRes?.data || [];
        if (isMounted) {
          setNearbyPharmacies(allPharmacies);
        }
      } catch (e) {
        if (isMounted) setNearbyPharmacies([]);
      } finally {
        if (isMounted) setPharmaciesLoading(false);
      }
    }
    loadPharmacies();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleOrderNow = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!medicine || !medicine.otc) return;

    let defaultPharmacy = nearbyPharmacies[0];
    if (!defaultPharmacy) {
      try {
        const res = await pharmacyService.getPharmacies();
        defaultPharmacy = res?.pharmacies?.[0] || null;
      } catch (e) {
        // ignore
      }
    }

    if (!defaultPharmacy) return;

    addToCart(medicine, defaultPharmacy, 1);
    navigate("/checkout");
  };

  const loc = useMedicineCardLocalization(medicine);
  const isPending = loading || loc.loading;

  if (isPending) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-text-muted">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-sm font-medium">{t("medicine.loading")}</p>
      </div>
    );
  }

  if (error || !medicine) return <NotFound />;

  const activeMed = (langCode === "en" ? medicine : (displayMedicine || medicine));
  const isOtc = loc.isOtc;

  const warningLabelMap = {
    pregnancy: t("details.pregnancy"),
    breastfeeding: t("details.breastfeeding"),
    kidneyDisease: t("details.kidneyDisease"),
    liverDisease: t("details.liverDisease"),
    alcohol: t("details.alcohol"),
    driving: t("details.driving"),
  };

  const brand = loc.brand;
  const generic = loc.genericName;
  const strength = loc.strength;
  const mfg = loc.manufacturer;
  const pack = loc.packSize;
  const category = loc.category;
  const description = loc.description || activeMed.description || "";
  const storage = activeMed.storage || "";

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
              {category}
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
              {activeMed.uses.map((u) => <li key={u}>{u}</li>)}
            </ul>
          </Section>
        )}

        {activeMed.dosage && (
          <Section title={t("details.dosage")}>
            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              {activeMed.dosage.adults && <div><dt className="font-semibold text-text">{t("details.adults")}</dt><dd className="text-text-muted mt-1">{activeMed.dosage.adults}</dd></div>}
              {activeMed.dosage.children && <div><dt className="font-semibold text-text">{t("details.children")}</dt><dd className="text-text-muted mt-1">{activeMed.dosage.children}</dd></div>}
              {activeMed.dosage.missedDose && <div><dt className="font-semibold text-text">{t("details.missedDose")}</dt><dd className="text-text-muted mt-1">{activeMed.dosage.missedDose}</dd></div>}
              {activeMed.dosage.overdose && <div><dt className="font-semibold text-text">{t("details.overdose")}</dt><dd className="text-text-muted mt-1">{activeMed.dosage.overdose}</dd></div>}
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
                    {activeMed.sideEffects.common.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              )}
              {activeMed.sideEffects.rare && activeMed.sideEffects.rare.length > 0 && (
                <div>
                  <p className="font-semibold text-text mb-1.5">{t("details.rareSideEffects")}</p>
                  <ul className="list-disc list-inside space-y-1 text-text-muted">
                    {activeMed.sideEffects.rare.map((s) => <li key={s}>{s}</li>)}
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
                  <dd className="text-text-muted mt-1">{value}</dd>
                </div>
              ))}
            </dl>
          </Section>
        )}

        {activeMed.interactions && (
          <Section title={t("details.drugInteractions")}>
            {activeMed.interactions.length > 0 ? (
              <ul className="list-disc list-inside space-y-1.5 text-sm text-text-muted">
                {activeMed.interactions.map((i) => <li key={i}>{i}</li>)}
              </ul>
            ) : (
              <p className="text-sm text-text-muted">{t("details.noInteractions") || "No major interactions reported."}</p>
            )}
          </Section>
        )}

        {activeMed.foodInteractions && (
          <Section title={t("details.foodInteractions")}>
            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              {activeMed.foodInteractions.beforeFood && <div><dt className="font-semibold text-text">{t("details.beforeFood")}</dt><dd className="text-text-muted mt-1">{activeMed.foodInteractions.beforeFood}</dd></div>}
              {activeMed.foodInteractions.afterFood && <div><dt className="font-semibold text-text">{t("details.afterFood")}</dt><dd className="text-text-muted mt-1">{activeMed.foodInteractions.afterFood}</dd></div>}
            </dl>
            {activeMed.foodInteractions.avoid && activeMed.foodInteractions.avoid.length > 0 && (
              <p className="mt-3 text-sm text-text-muted">
                <span className="font-semibold text-text">{t("details.foodsToAvoid")}: </span>
                {activeMed.foodInteractions.avoid.join(", ")}
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
        {pharmaciesLoading ? (
          <div className="flex items-center gap-2 text-text-muted text-sm py-4">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span>{t("pharmacy.loading")}</span>
          </div>
        ) : nearbyPharmacies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {nearbyPharmacies.map((p) => <PharmacyCard key={p.id || p._id} pharmacy={p} />)}
          </div>
        ) : (
          <p className="text-sm text-text-muted py-4 bg-slate-50 rounded-xl px-4 border border-border">
            {t("pharmacy.noPharmacies")}
          </p>
        )}
      </section>
    </div>
  );
}