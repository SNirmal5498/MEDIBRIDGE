import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import {
  Pill,
  ShoppingCart,
  GitCompare,
  Star,
  ChevronRight,
  Loader2,
  UploadCloud,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { getMedicineById as getLocalMedicineById } from "../../utils/medicineData";
import { medicineService } from "../../services/medicineService";
import pharmacyService from "../../services/pharmacyService";
import prescriptionService from "../../services/prescriptionService";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../hooks/useLanguage";
import Button from "../../components/common/Button";
import MedicineCard from "../../components/medicine/MedicineCard";
import PharmacyCard from "../../components/common/PharmacyCard";
import PrescriptionUploadModal from "../../components/prescription/PrescriptionUploadModal";
import PrescriptionDocumentModal from "../../components/prescription/PrescriptionDocumentModal";
import PrescriptionOrderModal from "../../components/prescription/PrescriptionOrderModal";
import NotFound from "../NotFound";

import { useDynamicTranslation } from "../../hooks/useDynamicTranslation";
import { useMedicineCardLocalization } from "../../hooks/useMedicineCardLocalization";

const RECENT_KEY = "medibridge_recently_viewed";

function saveRecentlyViewed(med) {
  try {
    const existing = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    const updated = [med.id, ...existing.filter((x) => x !== med.id)].slice(0, 6);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch {
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
  const { id: rawId } = useParams();
  const id = rawId ? decodeURIComponent(rawId).trim() : "";
  const navigate = useNavigate();
  const location = useLocation();
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
  const [userPrescriptions, setUserPrescriptions] = useState([]);
  const [viewingRxId, setViewingRxId] = useState(null);
  const [viewingRxTitle, setViewingRxTitle] = useState("");
  const [orderingRx, setOrderingRx] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(Boolean(location.state?.openUploadModal));

  const { data: displayMedicine } = useDynamicTranslation(medicine, "medicine");

  // Load customer prescriptions to track existing submissions
  useEffect(() => {
    let isMounted = true;
    async function loadUserPrescriptions() {
      if (!isAuthenticated) {
        setUserPrescriptions([]);
        return;
      }
      try {
        const res = await prescriptionService.getMyPrescriptions();
        if (isMounted && res?.success) {
          setUserPrescriptions(res.prescriptions || []);
        }
      } catch {
        // ignore
      }
    }

    loadUserPrescriptions();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (!id) {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(false);
      try {
        const res = await medicineService.getById(id, langCode);
        const med = res?.medicine || res?.data;
        if (isMounted && med && (med.id || med._id)) {
          setMedicine(med);
          saveRecentlyViewed(med);

          // Fetch alternatives
          try {
            const altRes = await medicineService.getAlternatives(med.id || id, langCode);
            const alts = altRes?.alternatives || altRes?.data;
            if (isMounted && Array.isArray(alts)) {
              setAlternatives(alts);
            }
          } catch {
            // Ignore alternatives error
          }
          return;
        }
      } catch {
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
  }, [id, langCode]);

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
      } catch {
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
      } catch {
        // ignore
      }
    }

    if (!defaultPharmacy) return;

    addToCart(medicine, defaultPharmacy, 1);
    navigate("/checkout");
  };

  const handleOpenUploadModal = () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          returnTo: `/medicine/${id}`,
          openUploadModal: true,
        },
      });
      return;
    }
    setUploadModalOpen(true);
  };

  const handleUploadSuccess = (newRx) => {
    if (newRx) {
      setUserPrescriptions((prev) => [newRx, ...prev.filter((p) => p._id !== newRx._id)]);
    }
  };

  const handleOrderSuccess = (newOrder) => {
    setUserPrescriptions((prev) =>
      prev.map((rx) => (rx._id === currentPrescription?._id ? { ...rx, order: newOrder } : rx))
    );
  };

  // Find the most relevant current prescription for this medicine using stable IDs
  const targetIds = [medicine?.id, medicine?._id, id].filter(Boolean);
  const matchingPrescriptions =
    !medicine || medicine.otc || !userPrescriptions.length
      ? []
      : userPrescriptions.filter(
          (p) =>
            targetIds.includes(p.medicineId) ||
            (p.medicineName &&
              medicine.brand &&
              p.medicineName.toLowerCase().includes(medicine.brand.toLowerCase()))
        );
  const currentPrescription =
    matchingPrescriptions.length > 0
      ? matchingPrescriptions.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
      : null;

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

          {/* Action Area: OTC vs Status-Aware Prescription Interface */}
          <div className="mt-6 space-y-4">
            {isOtc ? (
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" icon={ShoppingCart} onClick={handleOrderNow}>
                  {t("medicine.orderNow")}
                </Button>
                <Button variant="secondary" icon={GitCompare} onClick={() => navigate(`/compare?a=${activeMed.id}`)}>
                  {t("medicine.compare")}
                </Button>
              </div>
            ) : !currentPrescription ? (
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" icon={UploadCloud} onClick={handleOpenUploadModal}>
                  Upload Prescription
                </Button>
                <Button variant="secondary" icon={GitCompare} onClick={() => navigate(`/compare?a=${activeMed.id}`)}>
                  {t("medicine.compare")}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Status-aware Prescription Card */}
                <div className="p-4 rounded-2xl border space-y-3 bg-slate-50/80 border-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {currentPrescription.status === "approved" || currentPrescription.status === "reviewed" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          Prescription Verified
                        </span>
                      ) : currentPrescription.status === "under-review" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                          <Clock className="w-4 h-4 text-blue-600" />
                          Prescription Under Review
                        </span>
                      ) : currentPrescription.status === "clarification-required" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                          <AlertCircle className="w-4 h-4 text-purple-600" />
                          Clarification Required
                        </span>
                      ) : currentPrescription.status === "rejected" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          Prescription Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-4 h-4 text-amber-600" />
                          Prescription Submitted — Awaiting Review
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-500 font-medium">
                      Submitted: {new Date(currentPrescription.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p>
                      <strong>Assigned Pharmacy:</strong> {currentPrescription.pharmacyName || "Partner Pharmacy"}
                    </p>

                    {currentPrescription.status === "pending" && (
                      <p className="text-slate-500">
                        Your prescription has been forwarded to the pharmacist for verification. You will be able to order dispensing once verified.
                      </p>
                    )}

                    {currentPrescription.status === "under-review" && (
                      <p className="text-slate-500">
                        A licensed pharmacist at {currentPrescription.pharmacyName || "partner pharmacy"} is currently reviewing your prescription document.
                      </p>
                    )}

                    {currentPrescription.status === "clarification-required" && (
                      <p className="p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 font-medium">
                        <strong>Pharmacist Feedback:</strong> "{currentPrescription.reviewNotes || "Please submit a clearer copy of your prescription document."}"
                      </p>
                    )}

                    {currentPrescription.status === "rejected" && (
                      <p className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 font-medium">
                        <strong>Rejection Reason:</strong> "{currentPrescription.rejectionReason || currentPrescription.reviewNotes || "Prescription document could not be validated."}"
                      </p>
                    )}

                    {(currentPrescription.status === "approved" || currentPrescription.status === "reviewed") && (
                      <div className="space-y-1">
                        <p className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified for dispensing fulfillment.
                        </p>
                        {currentPrescription.reviewNotes && (
                          <p className="text-slate-500 italic">"{currentPrescription.reviewNotes}"</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/80">
                    {(currentPrescription.status === "approved" || currentPrescription.status === "reviewed") && (
                      currentPrescription.order ? (
                        <Button as={Link} to="/orders" variant="secondary" size="sm">
                          View in Orders ({typeof currentPrescription.order === "object" ? currentPrescription.order.orderId : "Placed"})
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          icon={ShoppingCart}
                          onClick={() => setOrderingRx(currentPrescription)}
                        >
                          Proceed to Pharmacy Order Request
                        </Button>
                      )
                    )}

                    {currentPrescription.status === "clarification-required" && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={UploadCloud}
                        onClick={handleOpenUploadModal}
                      >
                        Upload Corrected Document
                      </Button>
                    )}

                    {currentPrescription.status === "rejected" && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={UploadCloud}
                        onClick={handleOpenUploadModal}
                      >
                        Submit Valid Prescription
                      </Button>
                    )}

                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Eye}
                      onClick={() => {
                        setViewingRxId(currentPrescription._id);
                        setViewingRxTitle(activeMed.brand || activeMed.name);
                      }}
                    >
                      View Submitted File
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      icon={GitCompare}
                      onClick={() => navigate(`/compare?a=${activeMed.id}`)}
                    >
                      {t("medicine.compare")}
                    </Button>

                    <Link
                      to="/profile#prescriptions"
                      className="text-xs text-teal-700 hover:text-teal-800 font-bold ml-auto flex items-center gap-1 py-1"
                    >
                      <span>Prescription History</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
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

      {/* Prescription Upload Modal */}
      <PrescriptionUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        medicine={activeMed}
        onSuccess={handleUploadSuccess}
      />

      {/* Prescription Document Secure Viewer Modal */}
      <PrescriptionDocumentModal
        isOpen={Boolean(viewingRxId)}
        prescriptionId={viewingRxId}
        title={viewingRxTitle || "Prescription Document"}
        onClose={() => setViewingRxId(null)}
      />

      {/* Prescription Dispensing Order Modal */}
      {orderingRx && (
        <PrescriptionOrderModal
          isOpen={Boolean(orderingRx)}
          prescription={orderingRx}
          medicine={activeMed}
          user={null}
          onClose={() => setOrderingRx(null)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
}