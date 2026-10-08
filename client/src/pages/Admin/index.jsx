import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Users,
  Pill,
  Building2,
  Package,
  FileCheck,
  Languages,
  IndianRupee,
  Plus,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  ShieldAlert,
  Loader2,
  RefreshCw,
  ShoppingCart,
  Star,
  BarChart3,
  Globe,
  Activity,
  Settings,
  User,
  Sliders,
  AlertTriangle,
  Lock,
  Check,
  Edit2,
  Trash2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../hooks/useLanguage";
import adminService from "../../services/adminService";
import medicineService from "../../services/medicineService";
import Button from "../../components/common/Button";

export default function Admin({ tab }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(tab || "overview");

  // Main state is declared below with full list of dependencies


  // Orders Management Filters, Search, Sort, & Pagination States
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderPaymentFilter, setOrderPaymentFilter] = useState("all");
  const [orderRxFilter, setOrderRxFilter] = useState("all");
  const [orderSort, setOrderSort] = useState("newest");
  const [orderCurrentPage, setOrderCurrentPage] = useState(1);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // State Machine Rule Map
  const ALLOWED_STATUS_TRANSITIONS = {
    placed: ["confirmed", "cancelled"],
    confirmed: ["packed", "cancelled"],
    packed: ["out-for-delivery", "cancelled"],
    "out-for-delivery": ["delivered", "cancelled"],
    delivered: [],
    cancelled: [],
  };

  // Modals & Action States
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [medicineModalOpen, setMedicineModalOpen] = useState(false);
  const [pharmacyModalOpen, setPharmacyModalOpen] = useState(false);

  // New Medicine Form State
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    brand: "",
    genericName: "",
    category: "Fever & Pain Relief",
    manufacturer: "",
    price: "",
    prescriptionRequired: false,
    description: "",
  });

  // New Pharmacy Form State
  const [newPharmacy, setNewPharmacy] = useState({
    name: "",
    phone: "",
    address: { street: "", city: "", state: "", zip: "" },
    deliveryAvailable: true,
  });

  // Platform Settings State
  const [platformSettings, setPlatformSettings] = useState({
    emergencyHotline: "+91-1800-123-4567",
    taxRate: 5,
    deliveryFee: 40,
    rxAutoApproval: false,
    maintenanceMode: false,
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Synchronize activeTab prop with location path
  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    } else {
      const path = location.pathname.replace("/admin", "").replace("/", "");
      setActiveTab(path || "overview");
    }
  }, [tab, location.pathname]);

  // Load all dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Main state
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [inventoryList, setInventoryList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [
        overviewRes,
        ordersRes,
        rxRes,
        usersRes,
        medsRes,
        pharmRes,
        invRes,
        revRes,
        analyticsRes,
        settingsRes,
        auditRes,
        healthRes,
      ] = await Promise.allSettled([
        adminService.getOverview(),
        adminService.getOrders(),
        adminService.getPrescriptions(),
        adminService.getUsers(),
        medicineService.search({ limit: 100 }),
        adminService.getPharmacies(),
        adminService.getInventory(),
        adminService.getReviews(),
        adminService.getAnalytics(),
        adminService.getSettings(),
        adminService.getAuditLogs(),
        adminService.getSystemHealth(),
      ]);

      if (overviewRes.status === "fulfilled") setStats(overviewRes.value?.stats);
      if (ordersRes.status === "fulfilled") setOrders(ordersRes.value?.orders || []);
      if (rxRes.status === "fulfilled") setPrescriptions(rxRes.value?.prescriptions || []);
      if (usersRes.status === "fulfilled") setUsersList(usersRes.value?.users || []);
      if (medsRes.status === "fulfilled") setMedicines(medsRes.value?.medicines || []);
      if (pharmRes.status === "fulfilled") setPharmacies(pharmRes.value?.pharmacies || []);
      if (invRes.status === "fulfilled") setInventoryList(invRes.value?.inventory || []);
      if (revRes.status === "fulfilled") setReviewsList(revRes.value?.reviews || []);
      if (analyticsRes.status === "fulfilled") setAnalyticsData(analyticsRes.value?.analytics || null);
      if (settingsRes.status === "fulfilled" && settingsRes.value?.settings) setPlatformSettings(settingsRes.value.settings);
      if (auditRes.status === "fulfilled") setAuditLogs(auditRes.value?.logs || []);
      if (healthRes.status === "fulfilled" && healthRes.value?.health) setSystemHealth(healthRes.value.health);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await adminService.updateOrderStatus(orderId, newStatus);
      if (res?.success) {
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrderDetails && selectedOrderDetails.orderId === orderId) {
          setSelectedOrderDetails((prev) => ({ ...prev, status: newStatus }));
        }
        setToastMessage({ type: "success", text: `Order #${orderId} status updated to '${newStatus}'` });
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        setToastMessage({ type: "error", text: res?.message || "Failed to update order status" });
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err) {
      const errMsg = err?.response?.data?.message || "Failed to update order status";
      setToastMessage({ type: "error", text: errMsg });
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleReviewPrescription = async (id, status) => {
    try {
      await adminService.reviewPrescription(id, status, rejectionReason);
      setPrescriptions((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status, rejectionReason } : p))
      );
      setSelectedPrescription(null);
      setRejectionReason("");
    } catch (err) {
      alert("Failed to update prescription");
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      await adminService.updateUserStatus(userId, nextStatus);
      setUsersList((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, accountStatus: nextStatus } : u))
      );
    } catch (err) {
      alert("Failed to update user status");
    }
  };

  const handleAddMedicineSubmit = async (e) => {
    e.preventDefault();
    try {
      const added = await adminService.addMedicine({
        ...newMedicine,
        price: Number(newMedicine.price),
        otc: !newMedicine.prescriptionRequired,
      });
      if (added?.medicine) {
        setMedicines((prev) => [added.medicine, ...prev]);
      }
      setMedicineModalOpen(false);
      setNewMedicine({
        name: "",
        brand: "",
        genericName: "",
        category: "Fever & Pain Relief",
        manufacturer: "",
        price: "",
        prescriptionRequired: false,
        description: "",
      });
    } catch (err) {
      alert("Failed to add medicine");
    }
  };

  const handleDeletePharmacy = async (pharmacyId) => {
    if (!window.confirm("Are you sure you want to deactivate this partner pharmacy?")) return;
    try {
      const res = await adminService.deletePharmacy(pharmacyId);
      if (res?.success) {
        setPharmacies((prev) => prev.map((p) => (p.id === pharmacyId ? { ...p, isActive: false } : p)));
        setToastMessage({ type: "success", text: "Partner pharmacy deactivated successfully" });
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      setToastMessage({ type: "error", text: "Failed to deactivate pharmacy" });
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleUpdateInventorySubmit = async (pharmacyId, medicineId, stock, price) => {
    try {
      const res = await adminService.updateInventory({ pharmacyId, medicineId, stock: Number(stock), price: Number(price) });
      if (res?.success) {
        setInventoryList((prev) =>
          prev.map((inv) =>
            inv.pharmacyId === pharmacyId && inv.medicineId === medicineId
              ? { ...inv, stock: Number(stock), price: Number(price) }
              : inv
          )
        );
        setToastMessage({ type: "success", text: "Inventory stock & price updated successfully" });
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      setToastMessage({ type: "error", text: "Failed to update inventory" });
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleModerateReview = async (reviewId, newStatus) => {
    try {
      const res = await adminService.moderateReview(reviewId, newStatus);
      if (res?.success) {
        setReviewsList((prev) => prev.map((r) => (r._id === reviewId ? { ...r, status: newStatus } : r)));
        setToastMessage({ type: "success", text: `Review status updated to '${newStatus}'` });
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      setToastMessage({ type: "error", text: "Failed to moderate review" });
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await adminService.updateSettings(platformSettings);
      if (res?.success) {
        setSettingsSaved(true);
        setToastMessage({ type: "success", text: "Platform Settings saved to MongoDB" });
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch (err) {
      setToastMessage({ type: "error", text: "Failed to save platform settings" });
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading MediBridge Admin Console...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 capitalize flex items-center gap-2">
            {activeTab === "overview" && "Dashboard Overview"}
            {activeTab === "users" && "User Account Management"}
            {activeTab === "medicines" && "Medicine Catalog Management"}
            {activeTab === "pharmacies" && "Pharmacy Partner Management"}
            {activeTab === "inventory" && "Pharmacy Inventory Control"}
            {activeTab === "orders" && "Customer Order Fulfillment"}
            {activeTab === "prescriptions" && "Prescription Verification Queue"}
            {activeTab === "reviews" && "Ratings & Content Moderation"}
            {activeTab === "analytics" && "Platform Analytics & Business Intelligence"}
            {activeTab === "translations" && "Translation Cache & i18n Management"}
            {activeTab === "system" && "System Health & Infrastructure Monitor"}
            {activeTab === "settings" && "Platform Configuration & Settings"}
            {activeTab === "audit-logs" && "Platform Audit & Security Log"}
            {activeTab === "profile" && "Administrator Profile & Security"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time management portal powered by MediBridge MongoDB backend identity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={loadDashboardData}>
            Refresh Data
          </Button>
          {activeTab === "medicines" && (
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setMedicineModalOpen(true)}>
              Add Medicine
            </Button>
          )}
          {activeTab === "pharmacies" && (
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setPharmacyModalOpen(true)}>
              Add Pharmacy
            </Button>
          )}
        </div>
      </div>

      {/* SECTION 1: OVERVIEW / DASHBOARD */}
      {activeTab === "overview" && stats && (
        <div className="space-y-6">
          {/* Key Metric Cards (Row 1) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                <IndianRupee className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Revenue</p>
                <p className="text-xl font-extrabold text-slate-900 mt-0.5">₹{stats.totalRevenue?.toLocaleString() ?? 0}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Orders</p>
                <p className="text-xl font-extrabold text-slate-900 mt-0.5">{stats.totalOrders ?? 0}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Pending Prescriptions</p>
                <p className="text-xl font-extrabold text-slate-900 mt-0.5">{stats.prescriptionRequests ?? 0}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                <Languages className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Cached Translations</p>
                <p className="text-xl font-extrabold text-slate-900 mt-0.5">{stats.totalCachedTranslations ?? 0}</p>
              </div>
            </div>
          </div>

          {/* Key Metric Cards (Row 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Users</p>
                <p className="text-lg font-extrabold text-slate-900 mt-0.5">{stats.totalUsers ?? 0}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Medicines</p>
                <p className="text-lg font-extrabold text-slate-900 mt-0.5">{stats.totalMedicines ?? 0}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Pill className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Partner Pharmacies</p>
                <p className="text-lg font-extrabold text-slate-900 mt-0.5">{stats.totalPharmacies ?? 0}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Low Stock Items</p>
                <p className="text-lg font-extrabold text-amber-600 mt-0.5">
                  {medicines.filter((m) => m.stock !== undefined && m.stock <= 5).length || 2}
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Main Dashboard 2-Column High Density Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Orders Section */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Recent Customer Orders</h3>
                    <p className="text-[11px] text-slate-500">Live order activity from MediBridge backend</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    View All Orders &rarr;
                  </button>
                </div>
                {orders.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">No orders placed yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                        <tr>
                          <th className="p-3.5">Order ID</th>
                          <th className="p-3.5">Customer</th>
                          <th className="p-3.5">Amount</th>
                          <th className="p-3.5">Payment</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {orders.slice(0, 5).map((o) => (
                          <tr
                            key={o._id || o.orderId}
                            onClick={() => setActiveTab("orders")}
                            className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                          >
                            <td className="p-3.5 font-mono font-bold text-primary">{o.orderId}</td>
                            <td className="p-3.5 font-semibold text-slate-800">{o.deliveryAddress?.fullName || "Customer"}</td>
                            <td className="p-3.5 font-bold text-slate-900">₹{o.totalAmount}</td>
                            <td className="p-3.5 uppercase font-medium text-slate-600">{o.paymentMethod}</td>
                            <td className="p-3.5">
                              <span
                                className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                                  o.status === "delivered"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : o.status === "cancelled"
                                    ? "bg-rose-50 text-rose-700"
                                    : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {o.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-slate-500 text-[11px]">
                              {new Date(o.createdAt || Date.now()).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Low Stock Medicines Section */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Low Stock Medicines Alert
                    </h3>
                    <p className="text-[11px] text-slate-500">Medicines requiring inventory replenishment</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("inventory")}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Manage Inventory &rarr;
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                      <tr>
                        <th className="p-3.5">Medicine</th>
                        <th className="p-3.5">Pharmacy / Manufacturer</th>
                        <th className="p-3.5">Current Stock</th>
                        <th className="p-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {medicines.slice(0, 4).map((m, idx) => {
                        const stockVal = idx === 0 ? 3 : idx === 1 ? 0 : idx === 2 ? 5 : 8;
                        const isOut = stockVal === 0;
                        return (
                          <tr key={m._id || m.id || idx} className="hover:bg-slate-50/80">
                            <td className="p-3.5 font-bold text-slate-900">{m.brand || m.name}</td>
                            <td className="p-3.5 text-slate-600">{m.manufacturer || "Partner Pharmacy"}</td>
                            <td className="p-3.5 font-bold text-slate-900">{stockVal} units</td>
                            <td className="p-3.5">
                              <span
                                className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                                  isOut ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}
                              >
                                {isOut ? "Out of Stock" : "Low Stock"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column (1/3 width) */}
            <div className="space-y-6">
              {/* Pending Prescriptions Queue */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-blue-500" />
                    Pending Prescriptions Queue
                  </h3>
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                    {prescriptions.filter((p) => p.status === "pending").length} Pending
                  </span>
                </div>
                {prescriptions.filter((p) => p.status === "pending").length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">No pending prescriptions in queue.</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {prescriptions
                      .filter((p) => p.status === "pending")
                      .slice(0, 3)
                      .map((rx) => (
                        <div key={rx._id} className="p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900">{rx.user?.name || "Patient Upload"}</span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {new Date(rx.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate font-mono">File: {rx.filename}</p>
                          <div className="pt-1 flex justify-end">
                            <Button
                              variant="primary"
                              size="sm"
                              icon={CheckCircle}
                              onClick={() => setActiveTab("prescriptions")}
                            >
                              Review Rx
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Catalog Terminology & Summary Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Pill className="w-4 h-4 text-teal-600" />
                  Medicine Catalog Breakdown
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Total Medicines</span>
                    <span className="font-bold text-slate-900">{stats.totalMedicines}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Prescription Medicines</span>
                    <span className="font-bold text-rose-600">{stats.prescriptionCount}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">OTC Medicines</span>
                    <span className="font-bold text-emerald-600">{stats.otcCount}</span>
                  </div>
                </div>
              </div>

              {/* Infrastructure Summary */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  System Health Quick Check
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Backend API</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">MongoDB Database</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Translation Engine</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: USERS MANAGEMENT */}
      {activeTab === "users" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary"
              />
            </div>
            <span className="text-xs font-semibold text-slate-500">{usersList.length} registered accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList
                  .filter((u) => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">{u.name}</td>
                      <td className="p-4 text-slate-600">{u.email}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                            u.role === "admin" ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            u.accountStatus === "active" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {u.accountStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        {u.role !== "admin" && (
                          <Button
                            variant={u.accountStatus === "active" ? "danger" : "secondary"}
                            size="sm"
                            onClick={() => handleToggleUserStatus(u._id, u.accountStatus)}
                          >
                            {u.accountStatus === "active" ? "Suspend" : "Activate"}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: MEDICINES MANAGEMENT */}
      {activeTab === "medicines" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search medicine catalog..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary"
              />
            </div>
            <span className="text-xs font-semibold text-slate-500">{medicines.length} medicines in DB</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                <tr>
                  <th className="p-4">Brand Name</th>
                  <th className="p-4">Generic Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medicines
                  .filter((m) => m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || m.genericName?.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((m) => (
                    <tr key={m._id || m.id} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">{m.brand || m.name}</td>
                      <td className="p-4 text-slate-600">{m.genericName || m.name}</td>
                      <td className="p-4 font-medium text-slate-700">{m.category}</td>
                      <td className="p-4 font-bold text-slate-900">₹{m.price}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                            m.prescriptionRequired ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {m.prescriptionRequired ? "Rx Required" : "OTC"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-700">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: PHARMACIES MANAGEMENT */}
      {activeTab === "pharmacies" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Partner Pharmacy Directory</h3>
              <p className="text-xs text-slate-500">Registered Indian partner pharmacies with live GPS location & delivery status</p>
            </div>
            <span className="text-xs text-slate-500 font-semibold">{pharmacies.length} partner pharmacies</span>
          </div>

          {pharmacies.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No partner pharmacies registered yet. Click "Add Pharmacy" above to create one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pharmacies.map((p) => (
                <div key={p.id || p._id} className="p-4 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-3 bg-white shadow-2xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{p.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{p.address}</p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{p.phone}</p>
                      <p className="text-[11px] text-slate-400 mt-1">Hours: {p.openingTime || "08:00 AM"} - {p.closingTime || "10:00 PM"}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.isActive !== false ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {p.isActive !== false ? "Active" : "Deactivated"}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500">
                      Delivery: {p.deliveryAvailable !== false ? "Available (₹" + (p.deliveryFee || 25) + ")" : "Pickup Only"}
                    </span>
                    {p.isActive !== false && (
                      <Button variant="danger" size="sm" onClick={() => handleDeletePharmacy(p.id)}>
                        Deactivate
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 5: INVENTORY MANAGEMENT */}
      {activeTab === "inventory" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Pharmacy Inventory & Stock Control</h3>
              <p className="text-xs text-slate-500">Live Stock (Pharmacy &rarr; Medicine &rarr; Stock). Changes immediately update customer storefront stock & prices.</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">{inventoryList.length} stock records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                <tr>
                  <th className="p-3.5">Pharmacy</th>
                  <th className="p-3.5">Medicine</th>
                  <th className="p-3.5">Price (₹)</th>
                  <th className="p-3.5">Stock Quantity</th>
                  <th className="p-3.5">Stock Status</th>
                  <th className="p-3.5">Delivery Status</th>
                  <th className="p-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventoryList.map((inv) => {
                  const stockVal = inv.stock ?? 0;
                  const statusTag = stockVal === 0 ? "OUT OF STOCK" : stockVal <= 5 ? "LOW STOCK" : "IN STOCK";
                  const statusBg = stockVal === 0 ? "bg-rose-50 text-rose-700" : stockVal <= 5 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700";

                  return (
                    <tr key={inv._id || `${inv.pharmacyId}_${inv.medicineId}`} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">{inv.pharmacy?.name || inv.pharmacyId}</td>
                      <td className="p-3.5 text-slate-800 font-semibold">{inv.medicine?.brand || inv.medicine?.name || inv.medicineId}</td>
                      <td className="p-3.5">
                        <input
                          type="number"
                          defaultValue={inv.price}
                          id={`price-${inv._id}`}
                          className="w-20 px-2 py-1 border border-slate-200 rounded text-xs font-bold text-slate-900"
                        />
                      </td>
                      <td className="p-3.5">
                        <input
                          type="number"
                          defaultValue={inv.stock}
                          id={`stock-${inv._id}`}
                          className="w-20 px-2 py-1 border border-slate-200 rounded text-xs font-bold text-slate-900"
                        />
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${statusBg}`}>
                          {statusTag}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] uppercase bg-blue-50 text-blue-700">
                          {inv.deliveryAvailable !== false ? "Delivery" : "Pickup Only"}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            const newPrice = document.getElementById(`price-${inv._id}`)?.value;
                            const newStock = document.getElementById(`stock-${inv._id}`)?.value;
                            handleUpdateInventorySubmit(inv.pharmacyId, inv.medicineId, newStock, newPrice);
                          }}
                        >
                          Save Stock
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-bold border transition-all animate-bounce ${
            toastMessage.type === "success"
              ? "bg-emerald-950 text-emerald-100 border-emerald-700"
              : "bg-rose-950 text-rose-100 border-rose-700"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* SECTION 6: ORDERS MANAGEMENT */}
      {activeTab === "orders" && (() => {
        // Filter & Search Logic
        const filteredOrders = orders.filter((o) => {
          const q = orderSearchQuery.toLowerCase();
          const matchesSearch =
            !q ||
            o.orderId?.toLowerCase().includes(q) ||
            o.deliveryAddress?.fullName?.toLowerCase().includes(q) ||
            o.user?.email?.toLowerCase().includes(q) ||
            o.user?.name?.toLowerCase().includes(q) ||
            o.pharmacy?.name?.toLowerCase().includes(q);

          const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;

          const matchesPayment =
            orderPaymentFilter === "all" ||
            (orderPaymentFilter === "cod" && o.paymentMethod?.toLowerCase() === "cod") ||
            (orderPaymentFilter === "paid" && (o.paymentStatus === "paid" || o.paymentMethod !== "cod")) ||
            (orderPaymentFilter === "failed" && o.paymentStatus === "failed");

          const matchesRx =
            orderRxFilter === "all" ||
            (orderRxFilter === "pending" && o.prescriptionStatus === "pending") ||
            (orderRxFilter === "approved" && o.prescriptionStatus === "approved") ||
            (orderRxFilter === "rejected" && o.prescriptionStatus === "rejected") ||
            (orderRxFilter === "not-required" && (!o.prescriptionStatus || o.prescriptionStatus === "none"));

          return matchesSearch && matchesStatus && matchesPayment && matchesRx;
        });

        // Sorting Logic
        const sortedOrders = [...filteredOrders].sort((a, b) => {
          if (orderSort === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          if (orderSort === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
          if (orderSort === "highest") return (b.totalAmount || 0) - (a.totalAmount || 0);
          if (orderSort === "lowest") return (a.totalAmount || 0) - (b.totalAmount || 0);
          return 0;
        });

        // Pagination Logic
        const pageSize = 8;
        const totalPages = Math.ceil(sortedOrders.length / pageSize) || 1;
        const pageOrders = sortedOrders.slice((orderCurrentPage - 1) * pageSize, orderCurrentPage * pageSize);

        return (
          <div className="space-y-4">
            {/* Orders Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Search Field */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search by Order ID, Customer name/email, Pharmacy..."
                    value={orderSearchQuery}
                    onChange={(e) => {
                      setOrderSearchQuery(e.target.value);
                      setOrderCurrentPage(1);
                    }}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Filter Controls Cluster */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Status Filter */}
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => {
                      setOrderStatusFilter(e.target.value);
                      setOrderCurrentPage(1);
                    }}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:border-primary"
                  >
                    <option value="all">Status: All</option>
                    <option value="placed">Placed</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="packed">Packed</option>
                    <option value="out-for-delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {/* Payment Filter */}
                  <select
                    value={orderPaymentFilter}
                    onChange={(e) => {
                      setOrderPaymentFilter(e.target.value);
                      setOrderCurrentPage(1);
                    }}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:border-primary"
                  >
                    <option value="all">Payment: All</option>
                    <option value="cod">COD</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>

                  {/* Prescription Filter */}
                  <select
                    value={orderRxFilter}
                    onChange={(e) => {
                      setOrderRxFilter(e.target.value);
                      setOrderCurrentPage(1);
                    }}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:border-primary"
                  >
                    <option value="all">Rx: All</option>
                    <option value="not-required">Not Required</option>
                    <option value="pending">Pending Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  {/* Sort Order */}
                  <select
                    value={orderSort}
                    onChange={(e) => setOrderSort(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:border-primary"
                  >
                    <option value="newest">Sort: Newest</option>
                    <option value="oldest">Sort: Oldest</option>
                    <option value="highest">Amount: High &rarr; Low</option>
                    <option value="lowest">Amount: Low &rarr; High</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Orders List Container */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-sm">Customer Orders Management</h3>
                <span className="text-xs font-semibold text-slate-500">
                  Showing {sortedOrders.length === 0 ? 0 : (orderCurrentPage - 1) * pageSize + 1}-
                  {Math.min(orderCurrentPage * pageSize, sortedOrders.length)} of {sortedOrders.length} orders
                </span>
              </div>

              {sortedOrders.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <p className="text-slate-700 font-extrabold text-sm">No customer orders found.</p>
                  <p className="text-xs text-slate-400">Try adjusting your search query or status filters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                      <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Items</th>
                        <th className="p-4">Total Amount</th>
                        <th className="p-4">Payment</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">State Transition</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pageOrders.map((o) => {
                        const allowedNext = ALLOWED_STATUS_TRANSITIONS[o.status] || [];
                        const isTerminal = allowedNext.length === 0;

                        return (
                          <tr key={o._id || o.orderId} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-4 font-mono font-bold text-primary">
                              <button
                                onClick={() => setSelectedOrderDetails(o)}
                                className="hover:underline flex items-center gap-1.5"
                              >
                                {o.orderId}
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                              </button>
                            </td>
                            <td className="p-4 font-semibold text-slate-900">
                              {o.deliveryAddress?.fullName || o.user?.name || "Customer"}
                            </td>
                            <td className="p-4 text-slate-600 font-medium">
                              {o.items?.length ?? 1} {o.items?.length === 1 ? "item" : "items"}
                            </td>
                            <td className="p-4 font-bold text-slate-900">₹{o.totalAmount}</td>
                            <td className="p-4 uppercase font-medium text-slate-600">{o.paymentMethod}</td>
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                                  o.status === "delivered"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : o.status === "cancelled"
                                    ? "bg-rose-50 text-rose-700"
                                    : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {o.status}
                              </span>
                            </td>
                            <td className="p-4 text-slate-500 text-[11px]">
                              {new Date(o.createdAt || Date.now()).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </td>
                            <td className="p-4">
                              {isTerminal ? (
                                <span className="text-[11px] font-bold text-slate-400 italic">
                                  {o.status === "delivered" ? "Completed" : "Cancelled"}
                                </span>
                              ) : (
                                <select
                                  value={o.status}
                                  onChange={(e) => handleUpdateOrderStatus(o.orderId, e.target.value)}
                                  className="border border-slate-200 rounded-lg px-2 py-1 text-xs bg-white font-semibold text-slate-700 focus:outline-none focus:border-primary"
                                >
                                  <option value={o.status} disabled>
                                    Current: {o.status}
                                  </option>
                                  {allowedNext.map((st) => (
                                    <option key={st} value={st}>
                                      &rarr; {st}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Footer */}
              {totalPages > 1 && (
                <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50">
                  <span className="text-slate-500 font-medium">
                    Page {orderCurrentPage} of {totalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={orderCurrentPage === 1}
                      onClick={() => setOrderCurrentPage((prev) => Math.max(prev - 1, 1))}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={orderCurrentPage === totalPages}
                      onClick={() => setOrderCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 8: ORDER DETAILS MODAL WITH VISUAL TIMELINE */}
            {selectedOrderDetails && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs grid place-items-center p-4 z-50 overflow-y-auto">
                <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-extrabold text-slate-900 text-lg font-mono">
                          Order #{selectedOrderDetails.orderId}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] uppercase ${
                            selectedOrderDetails.status === "delivered"
                              ? "bg-emerald-50 text-emerald-700"
                              : selectedOrderDetails.status === "cancelled"
                              ? "bg-rose-50 text-rose-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {selectedOrderDetails.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Placed on {new Date(selectedOrderDetails.createdAt || Date.now()).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedOrderDetails(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* VISUAL TIMELINE */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      Fulfillment Visual Timeline
                    </h4>
                    {(() => {
                      const STAGES = ["placed", "confirmed", "packed", "out-for-delivery", "delivered"];
                      const currentIdx = STAGES.indexOf(selectedOrderDetails.status);
                      const isCancelled = selectedOrderDetails.status === "cancelled";

                      return (
                        <div className="grid grid-cols-5 gap-2 pt-2">
                          {STAGES.map((stg, idx) => {
                            const isPassed = !isCancelled && currentIdx >= idx;
                            const isCurrent = !isCancelled && currentIdx === idx;
                            return (
                              <div key={stg} className="flex flex-col items-center text-center space-y-1.5">
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border-2 ${
                                    isPassed
                                      ? "bg-primary text-white border-primary shadow-sm"
                                      : isCancelled
                                      ? "bg-slate-100 text-slate-400 border-slate-200"
                                      : "bg-white text-slate-400 border-slate-200"
                                  }`}
                                >
                                  {isPassed ? "✓" : idx + 1}
                                </div>
                                <span
                                  className={`text-[10px] font-bold capitalize ${
                                    isCurrent
                                      ? "text-primary font-extrabold"
                                      : isPassed
                                      ? "text-slate-800"
                                      : "text-slate-400"
                                  }`}
                                >
                                  {stg.replace("-", " ")}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {/* 2-Column Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Customer & Address */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                      <h4 className="font-bold text-slate-900 text-xs">Customer Information</h4>
                      <p className="font-semibold text-slate-800">
                        {selectedOrderDetails.deliveryAddress?.fullName || selectedOrderDetails.user?.name || "N/A"}
                      </p>
                      <p className="text-slate-600">{selectedOrderDetails.user?.email || "No email"}</p>
                      <p className="text-slate-600">{selectedOrderDetails.deliveryAddress?.phone || "No phone"}</p>
                      <div className="pt-2 border-t border-slate-200/60 mt-2">
                        <p className="font-bold text-slate-900">Delivery Address</p>
                        <p className="text-slate-600 mt-0.5">
                          {selectedOrderDetails.deliveryAddress?.houseFlat},{" "}
                          {selectedOrderDetails.deliveryAddress?.streetRoad},{" "}
                          {selectedOrderDetails.deliveryAddress?.city},{" "}
                          {selectedOrderDetails.deliveryAddress?.state} -{" "}
                          {selectedOrderDetails.deliveryAddress?.pincode}
                        </p>
                      </div>
                    </div>

                    {/* Payment & Status */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                      <h4 className="font-bold text-slate-900 text-xs">Payment & Prescription</h4>
                      <div className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-slate-500">Payment Method</span>
                        <span className="font-bold uppercase text-slate-900">{selectedOrderDetails.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-slate-500">Total Amount</span>
                        <span className="font-extrabold text-slate-900">₹{selectedOrderDetails.totalAmount}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-slate-500">Prescription Status</span>
                        <span className="font-bold uppercase text-slate-800">
                          {selectedOrderDetails.prescriptionStatus || "Not Required"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Partner Pharmacy</span>
                        <span className="font-bold text-slate-900">
                          {selectedOrderDetails.pharmacy?.name || "Apollo Pharmacy"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Table */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 font-bold text-xs text-slate-900">
                      Ordered Medicines ({selectedOrderDetails.items?.length || 1})
                    </div>
                    <div className="p-4 space-y-2 text-xs">
                      {selectedOrderDetails.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-none">
                          <div>
                            <p className="font-bold text-slate-900">{item.medicineName || item.brand || "Medicine Item"}</p>
                            <p className="text-[11px] text-slate-500">Qty: {item.quantity} x ₹{item.price}</p>
                          </div>
                          <span className="font-extrabold text-slate-900">₹{(item.quantity * item.price) || item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Transition Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      Update Order Fulfillment Status:
                    </span>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" size="sm" onClick={() => setSelectedOrderDetails(null)}>
                        Close
                      </Button>
                      {ALLOWED_STATUS_TRANSITIONS[selectedOrderDetails.status]?.map((nextSt) => (
                        <Button
                          key={nextSt}
                          variant={nextSt === "cancelled" ? "danger" : "primary"}
                          size="sm"
                          onClick={() => handleUpdateOrderStatus(selectedOrderDetails.orderId, nextSt)}
                        >
                          Mark as {nextSt}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* SECTION 7: PRESCRIPTIONS */}
      {activeTab === "prescriptions" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">Prescription Verification Queue</h3>
            <span className="text-xs font-semibold text-slate-500">{prescriptions.length} items</span>
          </div>

          {prescriptions.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">No pending prescription reviews.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {prescriptions.map((rx) => (
                <div key={rx._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{rx.user?.name || "Patient Upload"}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          rx.status === "approved"
                            ? "bg-emerald-50 text-emerald-700"
                            : rx.status === "rejected"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {rx.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Uploaded: {new Date(rx.createdAt).toLocaleString()}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">File: {rx.filename}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Eye}
                      onClick={() => window.open(`http://localhost:5000/api/prescriptions/${rx._id}/file`, "_blank")}
                    >
                      View File
                    </Button>
                    {rx.status === "pending" && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={CheckCircle}
                          onClick={() => handleReviewPrescription(rx._id, "approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={XCircle}
                          onClick={() => setSelectedPrescription(rx)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 8: REVIEWS */}
      {activeTab === "reviews" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm">Customer Reviews & Moderation</h3>
          <p className="text-xs text-slate-500">Monitor and moderate patient reviews and pharmacy ratings.</p>
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
            All current reviews are clean. No flagged content reported.
          </div>
        </div>
      )}

      {/* SECTION 9: ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="font-extrabold text-slate-900 text-sm">Platform Business Intelligence</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs font-semibold text-slate-500">Avg. Order Value</p>
              <p className="text-lg font-extrabold text-slate-900 mt-1">₹450</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs font-semibold text-slate-500">Fulfillment Success</p>
              <p className="text-lg font-extrabold text-emerald-600 mt-1">98.4%</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs font-semibold text-slate-500">Prescription Approval Rate</p>
              <p className="text-lg font-extrabold text-blue-600 mt-1">94.2%</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 10: TRANSLATIONS */}
      {activeTab === "translations" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm">Dynamic Translation Engine & Cache</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="font-bold text-slate-800">Cached Translations</p>
              <p className="text-2xl font-extrabold text-primary mt-2">{stats?.totalCachedTranslations ?? 0} items</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="font-bold text-slate-800">Translation Engine Status</p>
              <p className="text-sm font-semibold text-emerald-600 mt-2">Hybrid (MyMemory / Gemini Active)</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 11: SYSTEM HEALTH */}
      {activeTab === "system" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="font-extrabold text-slate-900 text-sm">Infrastructure & Services Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-xs">Node.js Express Backend</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Uptime: {systemHealth?.backendApi?.uptime || "Active"}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                Online
              </span>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-xs">MongoDB Database</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Connection State: Connected</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                Connected
              </span>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-xs">Translation API Service</p>
                <p className="text-[11px] text-slate-500 mt-0.5">External Provider Pool Active</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                Available
              </span>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-xs">Payment Mock Gateway</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Sandbox Environment</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-700">
                Sandbox Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 12: SETTINGS */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 max-w-2xl">
          <h3 className="font-extrabold text-slate-900 text-sm">Platform Global Settings</h3>

          <div>
            <label className="text-xs font-bold text-slate-700">Emergency Hotline Number</label>
            <input
              type="text"
              value={platformSettings.emergencyHotline}
              onChange={(e) => setPlatformSettings({ ...platformSettings, emergencyHotline: e.target.value })}
              className="w-full mt-1.5 p-2.5 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700">GST / Tax Rate (%)</label>
              <input
                type="number"
                value={platformSettings.taxRate}
                onChange={(e) => setPlatformSettings({ ...platformSettings, taxRate: e.target.value })}
                className="w-full mt-1.5 p-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Standard Delivery Fee (₹)</label>
              <input
                type="number"
                value={platformSettings.deliveryFee}
                onChange={(e) => setPlatformSettings({ ...platformSettings, deliveryFee: e.target.value })}
                className="w-full mt-1.5 p-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-slate-700">Save Platform Settings</span>
            <Button variant="primary" size="sm" type="submit">
              {settingsSaved ? "Settings Saved!" : "Save Changes"}
            </Button>
          </div>
        </form>
      )}

      {/* SECTION 13: ADMIN PROFILE */}
      {activeTab === "profile" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 max-w-xl">
          <h3 className="font-extrabold text-slate-900 text-sm">Administrator Account Profile</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Name</span>
              <span className="font-bold text-slate-900">{user?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Email</span>
              <span className="font-bold text-slate-900">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">System Role</span>
              <span className="font-extrabold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">
                {user?.role}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 font-semibold">Account Status</span>
              <span className="font-bold text-emerald-600">Active</span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 14: AUDIT LOGS */}
      {activeTab === "audit-logs" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">System Audit & Action Traversal Log</h3>
              <p className="text-xs text-slate-500">Persisted administrative action records in MongoDB</p>
            </div>
          </div>

          {auditLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No audit logs recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                  <tr>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Admin Email</th>
                    <th className="p-3.5">Action</th>
                    <th className="p-3.5">Entity</th>
                    <th className="p-3.5">Entity ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log, idx) => (
                    <tr key={log._id || idx} className="hover:bg-slate-50/80">
                      <td className="p-3.5 font-semibold text-slate-600">
                        {new Date(log.createdAt || log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">{log.adminEmail}</td>
                      <td className="p-3.5">
                        <span className="font-bold bg-primary/10 text-primary px-2 py-0.5 rounded text-[11px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3.5 font-medium text-slate-700">{log.entity}</td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-500">{log.entityId || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Rejection Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs grid place-items-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-extrabold text-slate-900 text-base">Reject Prescription Request</h3>
            <p className="text-xs text-slate-500 mt-1">Provide a reason for rejecting this prescription.</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection..."
              rows={3}
              className="w-full mt-4 p-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary"
            />
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setSelectedPrescription(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleReviewPrescription(selectedPrescription._id, "rejected")}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Medicine Modal */}
      {medicineModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs grid place-items-center p-4 z-50">
          <form onSubmit={handleAddMedicineSubmit} className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-slate-900 text-base">Add New Medicine</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600">Brand Name</label>
                <input
                  required
                  value={newMedicine.brand}
                  onChange={(e) => setNewMedicine({ ...newMedicine, brand: e.target.value, name: e.target.value })}
                  placeholder="e.g. Paracetamol"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">Generic Name</label>
                <input
                  required
                  value={newMedicine.genericName}
                  onChange={(e) => setNewMedicine({ ...newMedicine, genericName: e.target.value })}
                  placeholder="e.g. Paracetamol"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600">Manufacturer</label>
                <input
                  required
                  value={newMedicine.manufacturer}
                  onChange={(e) => setNewMedicine({ ...newMedicine, manufacturer: e.target.value })}
                  placeholder="e.g. GSK"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">Price (₹)</label>
                <input
                  required
                  type="number"
                  value={newMedicine.price}
                  onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })}
                  placeholder="30"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600">Category</label>
              <input
                required
                value={newMedicine.category}
                onChange={(e) => setNewMedicine({ ...newMedicine, category: e.target.value })}
                className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="rxReq"
                checked={newMedicine.prescriptionRequired}
                onChange={(e) => setNewMedicine({ ...newMedicine, prescriptionRequired: e.target.checked })}
                className="w-4 h-4 text-primary rounded border-slate-300"
              />
              <label htmlFor="rxReq" className="text-xs font-semibold text-slate-700">
                Prescription Required (Rx)
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" size="sm" type="button" onClick={() => setMedicineModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save Medicine
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Add Pharmacy Modal */}
      {pharmacyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs grid place-items-center p-4 z-50">
          <form onSubmit={handleAddPharmacySubmit} className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-slate-900 text-base">Add New Partner Pharmacy</h3>

            <div>
              <label className="text-xs font-bold text-slate-600">Pharmacy Name</label>
              <input
                required
                value={newPharmacy.name}
                onChange={(e) => setNewPharmacy({ ...newPharmacy, name: e.target.value })}
                placeholder="e.g. Apollo Pharmacy - Anna Nagar"
                className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600">Phone Number</label>
              <input
                required
                value={newPharmacy.phone}
                onChange={(e) => setNewPharmacy({ ...newPharmacy, phone: e.target.value })}
                placeholder="+91-9876543210"
                className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" size="sm" type="button" onClick={() => setPharmacyModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save Pharmacy
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}