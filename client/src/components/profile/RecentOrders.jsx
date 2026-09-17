import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import Button from "../common/Button";
import { getAllOrders } from "../../utils/orderData";
import { formatINR } from "../../utils/helpers";
import { useLanguage } from "../../hooks/useLanguage";
import { formatDateTime, formatPharmacyName } from "../../utils/formatters";

const STATUS_MAP = {
  placed: "Pending",
  packed: "Processing",
  "out-for-delivery": "Processing",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_STYLES = {
  Delivered: "bg-primary-50 text-primary-hover",
  Processing: "bg-blue-50 text-blue-700",
  Cancelled: "bg-danger-50 text-danger",
  Pending: "bg-warning-50 text-amber-700",
};

const PHARMACY_FALLBACKS = ["Apollo Pharmacy", "MedPlus", "Wellness Forever"];

const SAMPLE_CANCELLED = {
  id: "MB-20260628-003",
  medicineName: "Novamox (Amoxicillin 500mg)",
  quantity: 1,
  pharmacy: "Sri Ramakrishna Pharmacy",
  date: "28 Jun 2026, 3:12 PM",
  total: 85,
  status: "Cancelled",
};

function toProfileOrder(order, index) {
  const first = order.items?.[0];
  const quantity = order.items?.reduce((sum, item) => sum + item.qty, 0) ?? 0;
  const total = order.items?.reduce((sum, item) => sum + item.price * item.qty, 0) ?? 0;

  return {
    id: order.id,
    medicineName: first?.name ?? "—",
    quantity,
    pharmacy: order.pharmacy || PHARMACY_FALLBACKS[index % PHARMACY_FALLBACKS.length],
    date: order.placedOn,
    total,
    status: STATUS_MAP[order.currentStatus] || "Pending",
  };
}

export default function RecentOrders() {
  const { t, language } = useLanguage();
  const orders = [...getAllOrders().map(toProfileOrder), SAMPLE_CANCELLED].slice(0, 4);

  return (
    <section>
      <div className="flex items-end justify-between gap-3 mb-5">
        <div>
          <h2 className="font-display font-bold text-xl text-text">{t("profile.recentOrders")}</h2>
          <p className="mt-1 text-sm text-text-muted">
            {t("profile.sampleHistory")}
          </p>
        </div>
        <Button as={Link} to="/orders" variant="ghost" size="sm">
          {t("categories.viewAll")}
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="mx-auto grid place-items-center w-12 h-12 rounded-2xl bg-primary-50 text-primary-hover mb-3">
            <Package className="w-5 h-5" />
          </div>
          <p className="text-sm text-text-muted">{t("profile.noRecentOrders")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <article key={order.id} className="card p-4 sm:p-5">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <Field label={t("checkout.orderId")} value={order.id} />
                  <Field label={t("orders.items")} value={order.medicineName} />
                  <Field label={t("profile.qty")} value={String(order.quantity)} />
                  <Field label={t("hero.findPharmacy")} value={formatPharmacyName(order.pharmacy, t)} />
                  <Field label={t("profile.date")} value={formatDateTime(order.date, language.code)} />
                  <Field label={t("orders.total")} value={formatINR(order.total)} accent />
                </div>
                <div className="flex items-center justify-between lg:flex-col lg:items-end gap-3 shrink-0">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      STATUS_STYLES[order.status] || STATUS_STYLES.Pending
                    }`}
                  >
                    {order.status === "Delivered"
                      ? t("orders.delivered")
                      : order.status === "Cancelled"
                      ? t("orders.pending")
                      : t("orders.pending")}
                  </span>
                  <Button as={Link} to="/orders" variant="secondary" size="sm">
                    {t("profile.viewOrder")}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function Field({ label, value, accent }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">{label}</p>
      <p className={`mt-0.5 text-sm font-medium truncate ${accent ? "text-primary-hover" : "text-text"}`}>
        {value}
      </p>
    </div>
  );
}

