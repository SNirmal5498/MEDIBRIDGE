import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Pill } from "lucide-react";
import { getFavoriteMedicines } from "../../utils/medicineData";
import MedicineCard from "../../components/medicine/MedicineCard";
import Button from "../../components/common/Button";

export default function Favorites() {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    setMedicines(getFavoriteMedicines());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-text">My Medications</h1>
        <p className="mt-1.5 text-text-muted">Medicines you've saved for quick access and reordering.</p>
      </div>

      {medicines.length === 0 ? (
        <div className="text-center py-20">
          <div className="mx-auto grid place-items-center w-14 h-14 rounded-2xl bg-primary-50 text-primary-hover mb-4">
            <Pill className="w-6 h-6" />
          </div>
          <p className="text-text-muted text-sm">You haven't saved any medicines yet.</p>
          <Button as={Link} to="/medicine" variant="primary" size="sm" className="mt-4 inline-flex">
            Browse Medicines
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {medicines.map((m) => (
            <MedicineCard key={m.id} medicine={m} onToggleCompare={() => {}} />
          ))}
        </div>
      )}
    </div>
  );
}