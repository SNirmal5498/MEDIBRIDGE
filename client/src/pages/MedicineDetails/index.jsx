import { useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Pill, ShoppingCart, Lock, GitCompare, Star, ChevronRight } from "lucide-react";
import {
  getMedicineById,
  getAlternatives,
  getRelatedMedicines,
  addRecentlyViewed,
} from "../../utils/medicineData";
import { PHARMACIES } from "../../utils/constants";
import Button from "../../components/common/Button";
import MedicineCard from "../../components/medicine/MedicineCard";
import PharmacyCard from "../../components/common/PharmacyCard";
import NotFound from "../NotFound";

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
  const medicine = getMedicineById(id);

  useEffect(() => {
    if (medicine) addRecentlyViewed(medicine.id);
  }, [medicine]);

  const alternatives = useMemo(() => getAlternatives(medicine), [medicine]);
  const related = useMemo(() => getRelatedMedicines(medicine, 4), [medicine]);

  if (!medicine) return <NotFound />;

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
                medicine.otc ? "bg-primary-50 text-primary-hover" : "bg-danger-50 text-danger"
              }`}
            >
              {medicine.otc ? "OTC" : "Prescription"}
            </span>
          </div>

          <dl className="space-y-2.5">
            <div className="flex flex-wrap gap-x-2 gap-y-0.5">
              <dt className="text-sm font-semibold text-text-muted w-36 shrink-0">Medicine Name</dt>
              <dd className="font-display font-extrabold text-2xl text-text">{medicine.brand}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 items-baseline">
              <dt className="text-sm font-semibold text-text-muted w-36 shrink-0">Generic Name</dt>
              <dd className="text-sm text-text">{medicine.genericName} · {medicine.strength}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 items-baseline">
              <dt className="text-sm font-semibold text-text-muted w-36 shrink-0">Manufacturer</dt>
              <dd className="text-sm text-text">{medicine.manufacturer} · {medicine.packSize}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 items-center">
              <dt className="text-sm font-semibold text-text-muted w-36 shrink-0">Rating</dt>
              <dd className="flex items-center gap-1">
                <Star className="w-4 h-4 text-warning fill-warning" />
                <span className="text-sm font-semibold text-text">{medicine.rating}</span>
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 items-baseline">
              <dt className="text-sm font-semibold text-text-muted w-36 shrink-0">Price</dt>
              <dd className="font-display font-extrabold text-2xl text-primary-hover">₹{medicine.price}</dd>
            </div>
          </dl>

          <p className="mt-4 text-sm text-text-muted leading-relaxed">{medicine.description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {medicine.otc ? (
              <Button variant="primary" icon={ShoppingCart}>Order Now</Button>
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
        <Section title="Uses">
          <ul className="list-disc list-inside space-y-1.5 text-sm text-text">
            {medicine.uses.map((u) => <li key={u}>{u}</li>)}
          </ul>
        </Section>

        <Section title="Dosage">
          <dl className="grid sm:grid-cols-2 gap-4 text-sm">
            <div><dt className="font-semibold text-text">Adults</dt><dd className="text-text-muted mt-1">{medicine.dosage.adults}</dd></div>
            <div><dt className="font-semibold text-text">Children</dt><dd className="text-text-muted mt-1">{medicine.dosage.children}</dd></div>
            <div><dt className="font-semibold text-text">Missed dose</dt><dd className="text-text-muted mt-1">{medicine.dosage.missedDose}</dd></div>
            <div><dt className="font-semibold text-text">Overdose</dt><dd className="text-text-muted mt-1">{medicine.dosage.overdose}</dd></div>
          </dl>
        </Section>

        <Section title="Side Effects">
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-text mb-1.5">Common</p>
              <ul className="list-disc list-inside space-y-1 text-text-muted">
                {medicine.sideEffects.common.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-text mb-1.5">Rare</p>
              <ul className="list-disc list-inside space-y-1 text-text-muted">
                {medicine.sideEffects.rare.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
          </div>
        </Section>

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

        <Section title="Drug Interactions">
          {medicine.interactions.length ? (
            <ul className="list-disc list-inside space-y-1.5 text-sm text-text-muted">
              {medicine.interactions.map((i) => <li key={i}>{i}</li>)}
            </ul>
          ) : (
            <p className="text-sm text-text-muted">No major interactions reported.</p>
          )}
        </Section>

        <Section title="Food Interactions">
          <dl className="grid sm:grid-cols-2 gap-4 text-sm">
            <div><dt className="font-semibold text-text">Before food</dt><dd className="text-text-muted mt-1">{medicine.foodInteractions.beforeFood}</dd></div>
            <div><dt className="font-semibold text-text">After food</dt><dd className="text-text-muted mt-1">{medicine.foodInteractions.afterFood}</dd></div>
          </dl>
          {medicine.foodInteractions.avoid.length > 0 && (
            <p className="mt-3 text-sm text-text-muted">
              <span className="font-semibold text-text">Foods to avoid: </span>
              {medicine.foodInteractions.avoid.join(", ")}
            </p>
          )}
        </Section>

        <Section title="Storage Instructions">
          <p className="text-sm text-text-muted">{medicine.storage}</p>
        </Section>
      </div>

      {alternatives.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display font-bold text-lg text-text mb-4">Alternative Medicines</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {alternatives.map((m) => <MedicineCard key={m.id} medicine={m} onToggleCompare={() => {}} />)}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display font-bold text-lg text-text mb-4">Related Medicines</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((m) => <MedicineCard key={m.id} medicine={m} onToggleCompare={() => {}} />)}
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