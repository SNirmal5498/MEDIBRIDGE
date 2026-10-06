import { MapPin, Calendar } from "lucide-react";
import OrderTimeline from "./OrderTimeline";
import { useLanguage } from "../../hooks/useLanguage";
import { formatDate, formatDateTime, formatAddress, formatStateName, formatBrandName } from "../../utils/formatters";

function formatDeliveryAddress(deliveryAddress, t, languageCode) {
  if (!deliveryAddress) return t("profile.noAddress");
  if (typeof deliveryAddress === "string") {
    return formatAddress(deliveryAddress, languageCode, t);
  }
  const { houseFlat, streetRoad, area, city, state, pincode } = deliveryAddress;
  const parts = [houseFlat, streetRoad].filter(Boolean).map((x) => formatAddress(x, languageCode, t)).join(", ");
  const location = [area, city].filter(Boolean).map((loc) => formatAddress(loc, languageCode, t)).join(", ");
  const region = [formatStateName(state, languageCode), pincode].filter(Boolean).join(" - ");
  return [parts, location, region].filter(Boolean).join("\n");
}

export default function OrderSummaryCard({ order }) {
  const { t, language } = useLanguage();
  const total = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="card p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <p className="text-xs font-bold tracking-wider text-primary-hover uppercase">{t("orders.orderDetails")}</p>
          <h2 className="font-display font-bold text-lg text-text mt-1">{order.id}</h2>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-text-muted">
          <Calendar className="w-4 h-4 shrink-0" />
          {t("orders.placedOn")} {formatDateTime(order.placedOn, language.code)}
        </div>
      </div>

      <div className="mt-8">
        <OrderTimeline order={order} />
      </div>

      <div className="mt-8 pt-6 border-t border-border grid sm:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-semibold text-text mb-2">{t("orders.items")}</p>
          <ul className="space-y-1.5">
            {order.items.map((item) => (
              <li key={item.name} className="flex justify-between text-sm text-text-muted">
                <span>{formatBrandName(item.name, language.code)} × {item.qty}</span>
                <span className="text-text">₹{item.price * item.qty}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between text-sm font-semibold text-text mt-2 pt-2 border-t border-border">
            <span>{t("orders.total")}</span>
            <span className="text-primary-hover">₹{total}</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-text mb-2">{t("orders.deliveryAddress")}</p>
          <p className="flex items-start gap-2 text-sm text-text-muted whitespace-pre-line">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
            {formatDeliveryAddress(order.deliveryAddress || order.address, t, language.code)}
          </p>
          <p className="text-sm text-text-muted mt-3">
            <span className="font-semibold text-text">{t("orders.estimatedDelivery")}: </span>
            {formatDate(order.estimatedDelivery, language.code)}
          </p>
        </div>
      </div>
    </div>
  );
}