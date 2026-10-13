import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { Package, ShoppingBag, ArrowRight } from "lucide-react";
import MyPrescriptions from "../../components/prescription/MyPrescriptions";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Hero */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Welcome back, {user?.name || "Patient"}!
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Track your prescription verifications, dispense requests, and recent medicine orders with your neighborhood partner pharmacies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
          >
            <Package className="w-4 h-4 text-slate-500" />
            <span>My Orders</span>
          </Link>
          <Link
            to="/medicine"
            className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Find Medicines</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Prescription Tracking Section */}
      <MyPrescriptions />
    </div>
  );
}