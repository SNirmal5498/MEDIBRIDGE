import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { orderService } from "../../services/orderService";
import OrderSummaryCard from "../../components/orders/OrderSummaryCard";
import { useLanguage } from "../../hooks/useLanguage";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderService.getUserOrders();
      setOrders(response.orders || []);
      if (response.orders && response.orders.length > 0) {
        setSelectedId(response.orders[0].id);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const order = orders.find((o) => o.id === selectedId);

  function handleSearch(e) {
    e.preventDefault();
    const match = orders.find((o) => o.id.toLowerCase() === query.trim().toLowerCase());
    if (match) setSelectedId(match.id);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center text-text-muted">{t("medicine.loading")}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-text">{t("orders.title")}</h1>
        <p className="mt-1.5 text-text-muted">{t("orders.subtitle")}</p>
      </div>

      <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-card">
        <Search className="w-4 h-4 text-text-muted shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder={t("orders.enterOrderId")}
          className="w-full text-sm focus:outline-none bg-transparent"
        />
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-xs font-semibold text-text-muted uppercase self-center mr-1">{t("orders.title")}:</span>
        {orders.length === 0 ? (
          <span className="text-sm text-text-muted">{t("orders.noOrders")}</span>
        ) : (
          orders.map((o) => (
            <button
              key={o.id}
              onClick={() => setSelectedId(o.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                selectedId === o.id ? "bg-primary text-white" : "bg-slate-100 text-text-muted hover:bg-slate-200"
              }`}
            >
              {o.id}
            </button>
          ))
        )}
      </div>

      <div className="mt-8">
        {order ? (
          <OrderSummaryCard order={order} />
        ) : (
          <p className="text-center text-text-muted text-sm py-16">
            {orders.length === 0 ? t("orders.noOrdersDesc") : t("orders.noOrders")}
          </p>
        )}
      </div>
    </div>
  );
}