import { Minus, Plus, Trash2 } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { formatBrandName, formatGenericName, formatStrength } from "../../utils/formatters";

export default function OrderSummary({ items, onUpdateQuantity, onRemove }) {
  const { t, language } = useLanguage();
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  if (items.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p className="text-text-muted">{t("checkout.noItems")}</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="font-display font-bold text-lg text-text mb-4">{t("checkout.orderSummary")}</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={`${item.medicineId}-${item.pharmacyId}`} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-text">{formatBrandName(item.medicineName, language.code)}</p>
              <p className="text-sm text-text-muted">
                {formatGenericName(item.genericName, language.code)} • {formatStrength(item.strength, language.code)}
              </p>
              <p className="text-sm text-text-muted mt-1">
                ₹{item.unitPrice} × {item.quantity}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <p className="font-display font-bold text-text">₹{item.totalPrice}</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onUpdateQuantity(item.medicineId, item.pharmacyId, item.quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-text transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-medium text-text">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.medicineId, item.pharmacyId, item.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-text transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={() => onRemove(item.medicineId, item.pharmacyId)}
                className="text-danger hover:text-danger/80 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

