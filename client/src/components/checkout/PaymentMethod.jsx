import { CreditCard, Smartphone, Landmark, DollarSign } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const PAYMENT_METHODS = [
  { id: "cod", key: "checkout.cod", icon: DollarSign, available: true },
  { id: "upi", key: "checkout.upi", icon: Smartphone, available: false },
  { id: "card", key: "checkout.card", icon: CreditCard, available: false },
  { id: "netbanking", key: "checkout.netbanking", icon: Landmark, available: false },
];

export default function PaymentMethod({ selectedMethod, onChange }) {
  const { t } = useLanguage();

  return (
    <div className="card p-6">
      <h3 className="font-display font-bold text-lg text-text mb-4">{t("checkout.paymentMethod")}</h3>
      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon;
          return (
            <label
              key={method.id}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? "border-primary bg-primary-50"
                  : "border-border bg-card hover:border-primary/30"
              } ${!method.available ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={() => method.available && onChange(method.id)}
                disabled={!method.available}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <Icon className="w-5 h-5 text-text-muted" />
              <span className="flex-1 font-medium text-text">{t(method.key)}</span>
              {!method.available && (
                <span className="text-xs font-semibold text-text-muted bg-slate-100 px-2 py-1 rounded-full">
                  {t("checkout.comingSoon")}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}

