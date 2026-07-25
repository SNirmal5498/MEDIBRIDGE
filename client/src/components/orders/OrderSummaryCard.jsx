import { MapPin, Calendar } from "lucide-react";
import OrderTimeline from "./OrderTimeline";

export default function OrderSummaryCard({ order }) {
  const total = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="card p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <p className="text-xs font-bold tracking-wider text-primary-hover uppercase">Order ID</p>
          <h2 className="font-display font-bold text-lg text-text mt-1">{order.id}</h2>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-text-muted">
          <Calendar className="w-4 h-4 shrink-0" />
          Placed on {order.placedOn}
        </div>
      </div>

      <div className="mt-8">
        <OrderTimeline order={order} />
      </div>

      <div className="mt-8 pt-6 border-t border-border grid sm:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-semibold text-text mb-2">Items</p>
          <ul className="space-y-1.5">
            {order.items.map((item) => (
              <li key={item.name} className="flex justify-between text-sm text-text-muted">
                <span>{item.name} × {item.qty}</span>
                <span className="text-text">₹{item.price * item.qty}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between text-sm font-semibold text-text mt-2 pt-2 border-t border-border">
            <span>Total</span>
            <span className="text-primary-hover">₹{total}</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-text mb-2">Delivery Address</p>
          <p className="flex items-start gap-2 text-sm text-text-muted">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
            {order.address}
          </p>
          <p className="text-sm text-text-muted mt-3">
            <span className="font-semibold text-text">Estimated delivery: </span>
            {order.estimatedDelivery}
          </p>
        </div>
      </div>
    </div>
  );
}