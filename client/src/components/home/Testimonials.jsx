import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import { TESTIMONIALS } from "../../utils/constants";

export default function Testimonials() {
  return (
    <section className="bg-primary-50/50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-wider text-primary-hover uppercase">Trusted by patients</span>
          <h2 className="mt-2 font-display font-extrabold text-2xl sm:text-3xl text-text">What people are saying</h2>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card p-6"
            >
              <Quote className="w-6 h-6 text-primary/30" />
              <p className="mt-3 text-sm text-text leading-relaxed">{t.quote}</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="grid place-items-center w-9 h-9 rounded-full bg-primary-100 text-primary-hover font-semibold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">{t.name}</p>
                  <p className="text-xs text-text-muted">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}