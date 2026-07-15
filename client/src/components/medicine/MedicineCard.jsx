import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, Building2, ArrowRight } from "lucide-react";
import { formatINR } from "../../utils/helpers";

export default function MedicineCard({ medicine, onSelect, index = 0 }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04 }}
      onClick={() => onSelect(medicine)}
      className="card card-hover text-left p-5 flex flex-col h-full focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">{medicine.name}</p>
          <h3 className="mt-0.5 font-display font-bold text-text text-lg">{medicine.brand}</h3>
        </div>
        <span
          className={`shrink-0 flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full
            ${medicine.otc ? "bg-primary-50 text-primary-hover" : "bg-warning-50 text-warning"}`}
        >
          {medicine.otc ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
          {medicine.otc ? "OTC" : "Rx"}
        </span>
      </div>

      <div className="mt-4 space-y-1.5 flex-1">
        <p className="text-sm text-text-muted">Strength: <span className="text-text font-medium">{medicine.strength}</span></p>
        <p className="flex items-center gap-1.5 text-sm text-text-muted">
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          {medicine.manufacturer}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <span className="font-display font-bold text-text">
          {medicine.otc ? formatINR(medicine.price) : "Rx required"}
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold text-primary-hover">
          View details <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </motion.button>
  );
}