import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Scale, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../common/Button";
import MedicineAutocompleteSearch from "../medicine/MedicineAutocompleteSearch";
import { useLanguage } from "../../hooks/useLanguage";

const SUGGESTED = ["Paracetamol", "Cetirizine", "Ibuprofen", "ORS", "Amoxicillin"];

export default function Hero() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

  function handleSearch(e) {
    e.preventDefault();
    navigate(query ? `/medicine?q=${encodeURIComponent(query)}` : "/medicine");
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative rounded-3xl bg-gradient-to-br from-primary via-teal-600 to-primary-hover px-6 py-12 sm:px-12 sm:py-16"
      >
        {/* Decorative background shapes container */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-white/10" />
          <div className="absolute right-24 bottom-0 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -left-10 bottom-[-4rem] w-56 h-56 rounded-full bg-white/5" />
        </div>

        <div className="relative max-w-2xl z-10">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight tracking-tight">
            {t("hero.title")}
          </h1>
          <p className="mt-4 text-white/85 text-base sm:text-lg leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button as="a" href="/medicine" onClick={(e) => { e.preventDefault(); navigate("/medicine"); }} variant="secondary" icon={Scale} size="lg">
              {t("hero.compareMedicines")}
            </Button>
            <Button
              as="a"
              href="/pharmacy"
              onClick={(e) => { e.preventDefault(); navigate("/pharmacy"); }}
              variant="ghost"
              icon={MapPin}
              size="lg"
              className="!bg-white/10 !text-white hover:!bg-white/20"
            >
              {t("hero.findPharmacy")}
            </Button>
          </div>

          <div className="mt-8 max-w-xl">
            <MedicineAutocompleteSearch
              value={query}
              onChange={setQuery}
              onSubmit={(q) => navigate(q ? `/medicine?q=${encodeURIComponent(q)}` : "/medicine")}
              placeholder={t("hero.searchPlaceholder")}
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-white/70 uppercase tracking-wide mr-1">{t("hero.try")}</span>
            {SUGGESTED.map((name) => (
              <button
                key={name}
                onClick={() => navigate(`/medicine?q=${encodeURIComponent(name)}`)}
                className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}