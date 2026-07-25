import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Lock, ShoppingCart, GitCompare, Trophy, Sparkles, Tag, Heart } from "lucide-react";
import Button from "../common/Button";
import { isFavorite, toggleFavorite } from "../../utils/medicineData";

export default function MedicineCard({ medicine, compareSelected, onToggleCompare, compareDisabled }) {
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState(() => isFavorite(medicine.id));

  function handleFavoriteClick(e) {
    e.stopPropagation();
    toggleFavorite(medicine.id);
    setFavorited((v) => !v);
  }

  return (
    <div className="card card-hover p-5 flex flex-col relative">
      <button
        onClick={handleFavoriteClick}
        aria-label={favorited ? "Remove from My Medications" : "Add to My Medications"}
        className={`absolute top-4 right-4 grid place-items-center w-8 h-8 rounded-full transition-colors ${
          favorited ? "bg-danger-50 text-danger" : "bg-slate-100 text-text-muted hover:text-danger hover:bg-danger-50"
        }`}
      >
        <Heart className={`w-4 h-4 ${favorited ? "fill-danger" : ""}`} />
      </button>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-2 pr-9">
          <div className="flex flex-wrap gap-1.5">
            {medicine.badges.bestSeller && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                <Trophy className="w-3 h-3" /> Best Seller
              </span>
            )}
            {medicine.badges.topRated && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full bg-primary-50 text-primary-hover">
                <Sparkles className="w-3 h-3" /> Top Rated
              </span>
            )}
            {medicine.badges.lowestPrice && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                <Tag className="w-3 h-3" /> Lowest Price
              </span>
            )}
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
              medicine.otc ? "bg-primary-50 text-primary-hover" : "bg-danger-50 text-danger"
            }`}
          >
            {medicine.otc ? "OTC" : "Prescription"}
          </span>
        </div>

        <h3 className="mt-3 font-display font-bold text-text">{medicine.brand}</h3>
        <p className="text-sm text-text-muted">{medicine.genericName} · {medicine.strength}</p>
        <p className="text-xs text-text-muted mt-1">{medicine.manufacturer}</p>

        <div className="flex items-center gap-1 mt-2">
          <Star className="w-3.5 h-3.5 text-warning fill-warning" />
          <span className="text-sm font-semibold text-text">{medicine.rating}</span>
        </div>

        <p className="mt-3 font-display font-extrabold text-lg text-primary-hover">₹{medicine.price}</p>
      </div>

      <div className="mt-auto pt-4">
        <div className="flex gap-2">
          <Button variant="primary" size="sm" className="flex-1" onClick={() => navigate(`/medicine/${medicine.id}`)}>
            View Details
          </Button>
          <Button
            variant={compareSelected ? "primary" : "secondary"}
            size="sm"
            icon={GitCompare}
            className="flex-1"
            disabled={!compareSelected && compareDisabled}
            onClick={() => onToggleCompare(medicine.id)}
          >
            {compareSelected ? "Selected" : "Compare"}
          </Button>
        </div>

        {medicine.otc ? (
          <Button variant="secondary" size="sm" icon={ShoppingCart} className="w-full mt-2">
            Order Now
          </Button>
        ) : (
          <div className="w-full mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-text-muted bg-slate-100 rounded-xl py-2.5">
            <Lock className="w-3.5 h-3.5" /> Prescription Required
          </div>
        )}
      </div>
    </div>
  );
}