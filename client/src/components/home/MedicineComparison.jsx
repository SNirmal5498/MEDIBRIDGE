import { motion } from "framer-motion";
import {
  Search,
  MousePointerClick,
  Scale,
  IndianRupee,
  MapPin,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { COMPARISON_STEPS, SAMPLE_COMPARISON } from "../../utils/constants";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

const ICONS = { Search, MousePointerClick, Scale, IndianRupee, MapPin, ShoppingCart };

export default function MedicineComparison() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold tracking-wider text-primary-hover uppercase">How it works</span>
        <h2 className="mt-2 font-display font-extrabold text-2xl sm:text-3xl text-text">
          From search to safe ordering, in six steps
        </h2>
      </div>

      {/* Stepper */}
      <div className="mt-10 flex flex-col lg:flex-row items-stretch gap-3">
        {COMPARISON_STEPS.map((step, i) => {
          const Icon = ICONS[step.icon];
          return (
            <div key={step.label} className="flex items-center gap-3 flex-1">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="card card-hover flex-1 px-4 py-5 text-center"
              >
                <div className="mx-auto grid place-items-center w-10 h-10 rounded-xl bg-primary-50 text-primary-hover mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-text">{step.label}</p>
                <p className="mt-1 text-xs text-text-muted leading-snug">{step.description}</p>
              </motion.div>
              {i < COMPARISON_STEPS.length - 1 && (
                <ArrowRight className="hidden lg:block w-4 h-4 text-border shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Sample comparison table */}
      <div className="mt-12 card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-wider text-primary-hover uppercase">Example comparison</p>
            <h3 className="font-display font-bold text-lg text-text mt-1">{SAMPLE_COMPARISON.query}</h3>
          </div>
          <Button variant="secondary" size="sm" icon={ArrowRight} iconPosition="right" onClick={() => navigate("/medicine")}>
            Try it yourself
          </Button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 pr-4 font-semibold text-text-muted">Feature</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Crocin</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Dolo</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Calpol</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_COMPARISON.rows.map((row) => (
                <tr key={row.feature} className="border-b border-border last:border-0">
                  <td className="py-3 pr-4 text-text-muted font-medium">{row.feature}</td>
                  <td className="py-3 px-4 text-text">{row.crocin}</td>
                  <td className="py-3 px-4 text-text">{row.dolo}</td>
                  <td className="py-3 px-4 text-text">{row.calpol}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}