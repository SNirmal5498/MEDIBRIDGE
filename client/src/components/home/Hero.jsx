import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Scale, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../common/Button";

const SUGGESTED = ["Paracetamol", "Cetirizine", "Ibuprofen", "ORS", "Amoxicillin"];

export default function Hero() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    navigate(query ? `/medicine?q=${encodeURIComponent(query)}` : "/medicine");
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-teal-600 to-primary-hover px-6 py-12 sm:px-12 sm:py-16"
      >
        {/* decorative circles */}
        <div className="pointer-events-none absolute -right-16 -top-16 w-72 h-72 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute right-24 bottom-0 w-40 h-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -left-10 bottom-[-4rem] w-56 h-56 rounded-full bg-white/5" />

        <div className="relative max-w-2xl">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight tracking-tight">
            Find Medicines Smarter
          </h1>
          <p className="mt-4 text-white/85 text-base sm:text-lg leading-relaxed">
            Compare medicines, locate nearby pharmacies and order eligible OTC medicines safely.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button as="a" href="/medicine" onClick={(e) => { e.preventDefault(); navigate("/medicine"); }} variant="secondary" icon={Scale} size="lg">
              Compare Medicines
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
              Find Pharmacy
            </Button>
          </div>

          <form
            onSubmit={handleSearch}
            className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-2xl bg-white/95 p-2 shadow-card max-w-xl"
          >
            <div className="flex items-center gap-2 flex-1 px-3">
              <Search className="w-5 h-5 text-text-muted shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search medicine..."
                className="w-full py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none bg-transparent"
              />
            </div>
            <Button type="submit" variant="primary" size="md" className="shrink-0">
              Search
            </Button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-white/70 uppercase tracking-wide mr-1">Try:</span>
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