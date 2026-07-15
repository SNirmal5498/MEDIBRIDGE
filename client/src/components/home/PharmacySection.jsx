import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PHARMACIES } from "../../utils/constants";
import PharmacyCard from "../common/PharmacyCard";
import Button from "../common/Button";

export default function PharmacySection() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-wider text-primary-hover uppercase">Nearby pharmacies</span>
          <h2 className="mt-2 font-display font-extrabold text-2xl sm:text-3xl text-text">
            Pharmacies stocking your medicine
          </h2>
        </div>
        <Button variant="secondary" icon={ArrowRight} iconPosition="right" onClick={() => navigate("/pharmacy")}>
          View all pharmacies
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PHARMACIES.map((pharmacy) => (
          <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
        ))}
      </div>
    </section>
  );
}