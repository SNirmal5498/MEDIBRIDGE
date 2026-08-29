import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Pill, ShoppingCart, Lock, GitCompare, Star, ChevronRight, Loader2 } from "lucide-react";
import { getMedicineById as getLocalMedicineById } from "../../utils/medicineData";
import { medicineService } from "../../services/medicineService";
import { PHARMACIES } from "../../utils/constants";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import MedicineCard from "../../components/medicine/MedicineCard";
import PharmacyCard from "../../components/common/PharmacyCard";
import NotFound from "../NotFound";

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

  const [medicine, setMedicine] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      setError(false);
      try {
        const res = await medicineService.getById(id);
        if (isMounted && res && res.data) {
          setMedicine(res.data);
          saveRecentlyViewed(res.data);

          // Fetch alternatives
          try {
            const altRes = await medicineService.getAlternatives(id);
            if (isMounted && altRes && altRes.data) {
              setAlternatives(altRes.data);
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
        <p className="text-sm font-medium">Loading medicine details...</p>
      </div>
    );
  }

  if (error || !medicine) return <NotFound />;

  const isOtc = medicine.otc === true || medicine.prescriptionRequired === false;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-1.5 text-sm text-text-muted mb-6">
        <Link to="/medicine" className="hover:text-primary-hover">Compare Medicines</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-text font-medium">{medicine.brand}</span>
      </div>

      <div className="card p-6 sm:p-8 flex flex-col sm:flex-row gap-8">
        <div className="w-full sm:w-56 aspect-square rounded-2xl bg-primary-50 grid place-items-center shrink-0">
          <Pill className="w-16 h-16 text-primary/40" />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-text-muted">
              {medicine.category}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                isOtc ? "bg-primary-50 text-primary-hover" : "bg-danger-50 text-danger"
              }`}
            >
              {isOtc ? "OTC" : "Prescription Required"}
            </span>
          </div>

          <dl className="space-y-2.5">
            <div className="flex flex-wrap gap-x-2 gap-y-0.5">
              <dt className="text-sm font-semibold text-text-muted w-36 shrink-0">Medicine Name</dt>
              <dd className="font-display font-extrabold text-2xl text-text">{medicine.brand}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 items-baseline">
              <dt className="text-sm font-semibold text-text-muted w-36 shrink-0">Generic Name</dt>
              <dd className="text-sm text-text">{medicine.genericName} {medicine.strength ? `· ${medicine.strength}` : ""}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 items-baseline">
              <dt className="text-sm font-semibold text-text-muted w-36 shrink-0">Manufacturer</dt>
              <dd className="text-sm text-text">{medicine.manufacturer} {medicine.packSize ? `· ${medicine.packSize}` : ""}</dd>
            </div>
            {medicine.rating && (
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 items-center">
                <dt className="text-sm font-semibold text-text-muted w-36 shrink-0">Rating</dt>
                <dd className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-warning fill-warning" />
                  <span className="text-sm font-semibold text-text">{medicine.rating}</span>
                </dd>
              </div>
            )}
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 items-baseline">
              <dt className="text-sm font-semibold text-text-muted w-36 shrink-0">Price</dt>
              <dd className="font-display font-extrabold text-2xl text-primary-hover">₹{medicine.price}</dd>
            </div>
          </dl>

          {medicine.description && (
            <p className="mt-4 text-sm text-text-muted leading-relaxed">{medicine.description}</p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {isOtc ? (
              <Button variant="primary" icon={ShoppingCart} onClick={handleOrderNow}>Order Now</Button>
            ) : (
              <Button variant="secondary" icon={Lock} disabled>Prescription Required</Button>
            )}
            <Button variant="secondary" icon={GitCompare} onClick={() => navigate(`/compare?a=${medicine.id}`)}>
              Compare
            </Button>
          </div>
        </div>
      </div>

      <div className="card p-6 sm:p-8 mt-6">
        {medicine.uses && medicine.uses.length > 0 && (
          <Section title="Uses">
            <ul className="list-disc list-inside space-y-1.5 text-sm text-text">
              {medicine.uses.map((u) => <li key={u}>{u}</li>)}
            </ul>
          </Section>
        )}

        {medicine.dosage && (
          <Section title="Dosage">
            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              {medicine.dosage.adults && <div><dt className="font-semibold text-text">Adults</dt><dd className="text-text-muted mt-1">{medicine.dosage.adults}</dd></div>}
              {medicine.dosage.children && <div><dt className="font-semibold text-text">Children</dt><dd className="text-text-muted mt-1">{medicine.dosage.children}</dd></div>}
              {medicine.dosage.missedDose && <div><dt className="font-semibold text-text">Missed dose</dt><dd className="text-text-muted mt-1">{medicine.dosage.missedDose}</dd></div>}
              {medicine.dosage.overdose && <div><dt className="font-semibold text-text">Overdose</dt><dd className="text-text-muted mt-1">{medicine.dosage.overdose}</dd></div>}
            </dl>
          </Section>
        )}

        {medicine.sideEffects && (
          <Section title="Side Effects">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {medicine.sideEffects.common && medicine.sideEffects.common.length > 0 && (
                <div>
                  <p className="font-semibold text-text mb-1.5">Common</p>
                  <ul className="list-disc list-inside space-y-1 text-text-muted">
                    {medicine.sideEffects.common.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              )}
              {medicine.sideEffects.rare && medicine.sideEffects.rare.length > 0 && (
                <div>
                  <p className="font-semibold text-text mb-1.5">Rare</p>
                  <ul className="list-disc list-inside space-y-1 text-text-muted">
                    {medicine.sideEffects.rare.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </Section>
        )}

        {medicine.warnings && (
          <Section title="Warnings">
            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              {Object.entries(medicine.warnings).map(([key, value]) => (
                <div key={key}>
                  <dt className="font-semibold text-text capitalize">{key.replace(/([A-Z])/g, " $1")}</dt>
                  <dd className="text-text-muted mt-1">{value}</dd>
                </div>
              ))}
            </dl>
          </Section>
        )}

        {medicine.interactions && (
          <Section title="Drug Interactions">
            {medicine.interactions.length > 0 ? (
              <ul className="list-disc list-inside space-y-1.5 text-sm text-text-muted">
                {medicine.interactions.map((i) => <li key={i}>{i}</li>)}
              </ul>
            ) : (
              <p className="text-sm text-text-muted">No major interactions reported.</p>
            )}
          </Section>
        )}

        {medicine.foodInteractions && (
          <Section title="Food Interactions">
            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              {medicine.foodInteractions.beforeFood && <div><dt className="font-semibold text-text">Before food</dt><dd className="text-text-muted mt-1">{medicine.foodInteractions.beforeFood}</dd></div>}
              {medicine.foodInteractions.afterFood && <div><dt className="font-semibold text-text">After food</dt><dd className="text-text-muted mt-1">{medicine.foodInteractions.afterFood}</dd></div>}
            </dl>
            {medicine.foodInteractions.avoid && medicine.foodInteractions.avoid.length > 0 && (
              <p className="mt-3 text-sm text-text-muted">
                <span className="font-semibold text-text">Foods to avoid: </span>
                {medicine.foodInteractions.avoid.join(", ")}
              </p>
            )}
          </Section>
        )}

        {medicine.storage && (
          <Section title="Storage Instructions">
            <p className="text-sm text-text-muted">{medicine.storage}</p>
          </Section>
        )}
      </div>

      {alternatives.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display font-bold text-lg text-text mb-4">Alternative Generic Formulations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {alternatives.map((m) => <MedicineCard key={m.id} medicine={m} onToggleCompare={() => {}} />)}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-display font-bold text-lg text-text mb-4">Nearby Pharmacies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PHARMACIES.map((p) => <PharmacyCard key={p.id} pharmacy={p} />)}
        </div>
      </section>
    </div>
  );
}