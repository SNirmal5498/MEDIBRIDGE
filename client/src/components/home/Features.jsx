import { Scale, MapPin, ShieldCheck, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { FEATURES } from "../../utils/constants";

const ICONS = { Scale, MapPin, ShieldCheck, Globe };

export default function Features() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold tracking-wider text-primary-hover uppercase">Why MediBridge</span>
        <h2 className="mt-2 font-display font-extrabold text-2xl sm:text-3xl text-text">
          Built for safe, informed decisions
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {FEATURES.map((feature, i) => {
          const Icon = ICONS[feature.icon];
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card card-hover p-6"
            >
              <div className="grid place-items-center w-11 h-11 rounded-xl bg-primary-50 text-primary-hover mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-text">{feature.title}</h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}