import { useState } from "react";
import { Search } from "lucide-react";
import { getAllOrders, getOrderById } from "../../utils/orderData";
import OrderSummaryCard from "../../components/orders/OrderSummaryCard";

export default function Orders() {
  const orders = getAllOrders();
  const [selectedId, setSelectedId] = useState(orders[0]?.id || "");
  const [query, setQuery] = useState("");

  const order = getOrderById(selectedId);

  function handleSearch(e) {
    e.preventDefault();
    const match = orders.find((o) => o.id.toLowerCase() === query.trim().toLowerCase());
    if (match) setSelectedId(match.id);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-text">Your Orders</h1>
        <p className="mt-1.5 text-text-muted">Track your order from placement to delivery.</p>
      </div>

      <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-card">
        <Search className="w-4 h-4 text-text-muted shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Enter Order ID (e.g., MB-20260714-001)"
          className="w-full text-sm focus:outline-none bg-transparent"
        />
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-xs font-semibold text-text-muted uppercase self-center mr-1">Your orders:</span>
        {orders.map((o) => (
          <button
            key={o.id}
            onClick={() => setSelectedId(o.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              selectedId === o.id ? "bg-primary text-white" : "bg-slate-100 text-text-muted hover:bg-slate-200"
            }`}
          >
            {o.id}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {order ? (
          <OrderSummaryCard order={order} />
        ) : (
          <p className="text-center text-text-muted text-sm py-16">No order found with that ID.</p>
        )}
      </div>
    </div>
  );
}