import { motion } from "framer-motion";
import { useLanguage } from "../../hooks/useLanguage";

export default function Stats() {
  const { t } = useLanguage();

  const stats = [
    { value: "2500+", label: t("stats.medicines") },
    { value: "500+", label: t("stats.pharmacies") },
    { value: "6+", label: t("stats.languages") },
    { value: "1000+", label: t("stats.comparisons") },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="card card-hover text-center px-4 py-8"
          >
            <p className="font-display font-extrabold text-3xl sm:text-4xl text-primary-hover">{stat.value}</p>
            <p className="mt-1.5 text-sm font-medium text-text-muted">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}