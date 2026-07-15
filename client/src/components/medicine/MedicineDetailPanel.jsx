import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Building2,
  Scale,
  MapPin,
  ShoppingCart,
  Check,
} from "lucide-react";
import Button from "../common/Button";
import CompareTable from "./CompareTable";
import { formatINR, getAlternatives } from "../../utils/helpers";

export default function MedicineDetailPanel({ medicine, allMedicines, onClose }) {
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  // Reset the "added to cart" feedback whenever a different medicine opens.
  useEffect(() => setAdded(false), [medicine?.id]);

  const isOpen = !!medicine;
  const alternatives = medicine ? getAlternatives(medicine, allMedicines) : [];
  const compareSet = medicine ? [medicine, ...alternatives] : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40"
          />
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
            className="fixed top-0 right-0 h-full w-full sm:w-[26rem] bg-card z-50 shadow-2xl
              overflow-y-auto"
          >
            <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-border px-6 py-4 flex items-center justify-between">
              <p className="font-display font-bold text-text">Medicine Details</p>
              <button
                onClick={onClose}
                aria-label="Close"
                className="grid place-items-center w-9 h-9 rounded-lg text-text-muted hover:text-text hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">{medicine?.name}</p>
                    <h2 className="mt-0.5 font-display font-extrabold text-text text-2xl">{medicine?.brand}</h2>
                  </div>
                  <span
                    className={`shrink-0 flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full
                      ${medicine?.otc ? "bg-primary-50 text-primary-hover" : "bg-warning-50 text-warning"}`}
                  >
                    {medicine?.otc ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                    {medicine?.otc ? "OTC" : "Prescription"}
                  </span>
                </div>
                <p className="mt-3 font-display font-bold text-3xl text-text">
                  {medicine?.otc ? formatINR(medicine.price) : "—"}
                </p>
              </div>

              {/* Info grid */}
              <div className="card p-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-muted text-xs mb-0.5">Strength</p>
                  <p className="font-semibold text-text">{medicine?.strength}</p>
                </div>
                <div>
                  <p className="text-text-muted text-xs mb-0.5 flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> Manufacturer
                  </p>
                  <p className="font-semibold text-text">{medicine?.manufacturer}</p>
                </div>
              </div>

              {/* Rx notice */}
              {medicine && !medicine.otc && (
                <div className="rounded-xl bg-warning-50 border border-warning/20 px-4 py-3 flex gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <p className="text-xs text-text leading-relaxed">
                    This medicine requires a valid prescription. It can't be ordered through MediBridge —
                    please consult a doctor or pharmacist.
                  </p>
                </div>
              )}

              {/* Compare */}
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-primary-hover uppercase mb-3">
                  <Scale className="w-3.5 h-3.5" />
                  {alternatives.length > 0 ? "Compare brand alternatives" : "Brand alternatives"}
                </p>
                {alternatives.length > 0 ? (
                  <CompareTable medicines={compareSet} highlightId={medicine?.id} />
                ) : (
                  <p className="text-sm text-text-muted card p-4">
                    No other brand alternatives listed for {medicine?.name} yet.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-2.5 pt-2">
                <Button
                  variant="secondary"
                  icon={MapPin}
                  className="w-full"
                  onClick={() => navigate("/pharmacy")}
                >
                  Find Nearby Pharmacy
                </Button>
                <Button
                  variant="primary"
                  icon={added ? Check : ShoppingCart}
                  className="w-full"
                  disabled={!medicine?.otc}
                  onClick={() => setAdded(true)}
                >
                  {!medicine?.otc ? "Not available for order" : added ? "Added to Cart" : "Add to Cart"}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}