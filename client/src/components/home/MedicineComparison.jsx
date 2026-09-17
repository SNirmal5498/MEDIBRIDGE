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
import { COMPARISON_STEPS } from "../../utils/constants";
import { useLanguage } from "../../hooks/useLanguage";

const ICONS = { Search, MousePointerClick, Scale, IndianRupee, MapPin, ShoppingCart };

export default function MedicineComparison() {
  const { t } = useLanguage();

  const steps = [
    { icon: "Search", label: t("common.search"), description: t("steps.searchDesc") },
    { icon: "MousePointerClick", label: t("common.selectMedicine"), description: t("steps.selectDesc") },
    { icon: "Scale", label: t("common.compareBrands"), description: t("steps.compareBrandsDesc") },
    { icon: "IndianRupee", label: t("common.comparePrices"), description: t("steps.comparePricesDesc") },
    { icon: "MapPin", label: t("common.findNearbyPharmacy"), description: t("steps.findPharmacyDesc") },
    { icon: "ShoppingCart", label: t("common.orderIfOtc"), description: t("steps.orderOtcDesc") },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold tracking-wider text-primary-hover uppercase">{t("hero.try")} {t("nav.compareMedicines")}</span>
        <h2 className="mt-2 font-display font-extrabold text-2xl sm:text-3xl text-text">
          {t("features.title")}
        </h2>
      </div>

      {/* Stepper */}
      <div className="mt-10 flex flex-col lg:flex-row items-stretch gap-3">
        {steps.map((step, i) => {
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
              {i < steps.length - 1 && (
                <ArrowRight className="hidden lg:block w-4 h-4 text-border shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}