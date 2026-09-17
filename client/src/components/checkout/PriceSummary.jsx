import { useLanguage } from "../../context/LanguageContext";

export default function PriceSummary({ subtotal, deliveryFee = 40, discount = 0 }) {
  const { t } = useLanguage();
  const total = subtotal + deliveryFee - discount;

  return (
    <div className="card p-6">
      <h3 className="font-display font-bold text-lg text-text mb-4">{t("checkout.priceSummary")}</h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-text-muted">
          <span>{t("checkout.subtotal")}</span>
          <span className="text-text font-medium">₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-sm text-text-muted">
          <span>{t("checkout.deliveryFee")}</span>
          <span className="text-text font-medium">₹{deliveryFee}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-text-muted">
            <span>{t("checkout.discount")}</span>
            <span className="text-text font-medium text-primary-hover">-₹{discount}</span>
          </div>
        )}
        <div className="pt-3 border-t border-border flex justify-between">
          <span className="font-semibold text-text">{t("checkout.total")}</span>
          <span className="font-display font-extrabold text-xl text-primary-hover">₹{total}</span>
        </div>
      </div>
    </div>
  );
}

