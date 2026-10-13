import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Building2,
  Package,
  Plus,
  Search,
  ShoppingCart,
  FileCheck,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Users,
  History,
  Eye,
  IndianRupee,
  ShieldAlert,
  Send,
  Calendar,
  Layers,
  Edit2,
  Save,
  FileText,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import pharmacyOwnerService from "../../services/pharmacyOwnerService";
import medicineService from "../../services/medicineService";
import Button from "../../components/common/Button";
import PrescriptionDocumentModal from "../../components/prescription/PrescriptionDocumentModal";

function checkExpiryStatus(expiryDate) {
  if (!expiryDate) return { isExpired: false, isNearExpiry: false, formattedDate: "Not Set" };
  const exp = new Date(expiryDate);
  if (isNaN(exp.getTime())) return { isExpired: false, isNearExpiry: false, formattedDate: "Invalid Date" };
  const now = Date.now();
  const isExpired = exp.getTime() < now;
  const isNearExpiry = !isExpired && exp.getTime() - now < 60 * 24 * 60 * 60 * 1000;
  return { isExpired, isNearExpiry, formattedDate: exp.toLocaleDateString() };
}

export default function PharmacyOwner() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "overview";
  const setActiveTab = (tabId) => setSearchParams({ tab: tabId });

  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Core Data States
  const [pharmacy, setPharmacy] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [catalogMedicines, setCatalogMedicines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [staff, setStaff] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Modals & Action States
  const [addStockModalOpen, setAddStockModalOpen] = useState(false);
  const [adjustModalItem, setAdjustModalItem] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [viewingDocRxId, setViewingDocRxId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [addStaffModalOpen, setAddStaffModalOpen] = useState(false);
  const [catalogSubmitModalOpen, setCatalogSubmitModalOpen] = useState(false);

  // Form States
  const [stockFormData, setStockFormData] = useState(() => ({
    medicineId: "",
    stock: 50,
    price: 40,
    lowStockThreshold: 10,
    stockType: "verified",
    batchNumber: "BATCH-1001",
    expiryDate: "2026-12-31",
    reason: "Initial Stock Record Entry",
  }));
  const [adjustData, setAdjustData] = useState({ stock: 0, price: 0, reason: "" });
  const [rxReviewData, setRxReviewData] = useState({ status: "reviewed", reviewNotes: "", rejectionReason: "" });
  const [catalogSubmitData, setCatalogSubmitData] = useState({
    name: "",
    brand: "",
    genericName: "",
    category: "Fever & Pain Relief",
    manufacturer: "",
    price: 50,
    prescriptionRequired: false,
    description: "",
  });
  const [staffFormData, setStaffFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    permissions: ["inventory_read", "inventory_write", "orders_read", "orders_update", "prescriptions_read", "prescriptions_review"],
  });

  const [profileFormData, setProfileFormData] = useState({
    address: "",
    phone: "",
    openingTime: "08:00 AM",
    closingTime: "10:00 PM",
    deliveryAvailable: true,
    deliveryFee: 25,
    licenseNumber: "",
    responsiblePharmacist: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const lowStockCount = useMemo(() => {
    return (inventory || []).filter((i) => (i?.stock ?? 0) <= (i?.lowStockThreshold ?? 10)).length;
  }, [inventory]);

  const expiredCount = useMemo(() => {
    return (inventory || []).filter((i) => i?.expiryDate && new Date(i.expiryDate) < new Date()).length;
  }, [inventory]);

  const pendingRxCount = useMemo(() => {
    return (prescriptions || []).filter((p) => p?.status === "pending" || p?.status === "under-review").length;
  }, [prescriptions]);

  const placedOrdersCount = useMemo(() => {
    return (orders || []).filter((o) => o?.status === "placed").length;
  }, [orders]);

  const totalRevenue = useMemo(() => {
    return (orders || []).filter((o) => o?.status !== "cancelled").reduce((sum, o) => sum + (o?.totalAmount || 0), 0);
  }, [orders]);

  const isStaff = user?.role === "pharmacy_staff";
  const perms = useMemo(() => user?.staffPermissions || [], [user?.staffPermissions]);

  const ALL_TABS = useMemo(() => [
    { id: "overview", label: "Overview", icon: Layers },
    { id: "inventory", label: "Stock Inventory", icon: Package, permission: "inventory_read" },
    { id: "expiry", label: "Batch & Expiry", icon: Calendar, badge: expiredCount, permission: "inventory_read" },
    { id: "orders", label: "Customer Orders", icon: ShoppingCart, badge: placedOrdersCount, permission: "orders_read" },
    { id: "prescriptions", label: "Prescription Review", icon: FileCheck, badge: pendingRxCount, permission: "prescriptions_read" },
    { id: "staff", label: "Staff Management", icon: Users, ownerOnly: true },
    { id: "audit", label: "Inventory Audit Logs", icon: History, permission: "inventory_read" },
    { id: "profile", label: "Pharmacy Profile", icon: Building2 },
  ], [expiredCount, placedOrdersCount, pendingRxCount]);

  const visibleTabs = useMemo(() => {
    return ALL_TABS.filter((tab) => {
      if (isStaff && tab.ownerOnly) return false;
      if (isStaff && tab.permission && !perms.includes(tab.permission)) return false;
      return true;
    });
  }, [ALL_TABS, isStaff, perms]);

  const loadPortalData = useCallback(async () => {
    try {
      const [profRes, invRes, medsRes, ordRes, rxRes, staffRes, logsRes] = await Promise.allSettled([
        pharmacyOwnerService.getProfile(),
        pharmacyOwnerService.getInventory(),
        medicineService.search({ limit: 100 }),
        pharmacyOwnerService.getOrders(),
        pharmacyOwnerService.getPrescriptions(),
        pharmacyOwnerService.getStaff(),
        pharmacyOwnerService.getInventoryAuditLogs(),
      ]);

      if (profRes.status === "fulfilled" && profRes.value?.pharmacy) {
        const p = profRes.value.pharmacy;
        setPharmacy(p);
        setProfileFormData({
          address: p.address || "",
          phone: p.phone || "",
          openingTime: p.openingTime || "08:00 AM",
          closingTime: p.closingTime || "10:00 PM",
          deliveryAvailable: p.deliveryAvailable !== undefined ? p.deliveryAvailable : true,
          deliveryFee: p.deliveryFee ?? 25,
          licenseNumber: p.licenseNumber || "",
          responsiblePharmacist: p.responsiblePharmacist || "",
        });
      }
      if (invRes.status === "fulfilled") setInventory(invRes.value?.inventory || []);
      if (medsRes.status === "fulfilled") setCatalogMedicines(medsRes.value?.medicines || []);
      if (ordRes.status === "fulfilled") setOrders(ordRes.value?.orders || []);
      if (rxRes.status === "fulfilled") setPrescriptions(rxRes.value?.prescriptions || []);
      if (staffRes.status === "fulfilled") setStaff(staffRes.value?.staff || []);
      if (logsRes.status === "fulfilled") setAuditLogs(logsRes.value?.logs || []);
    } catch (err) {
      console.error("Failed to load pharmacy portal data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    Promise.resolve().then(() => {
      if (!ignore) loadPortalData();
    });
    return () => {
      ignore = true;
    };
  }, [loadPortalData]);

  useEffect(() => {
    if (visibleTabs.length > 0 && !visibleTabs.some((t) => t.id === activeTab) && activeTab !== "add_update") {
      setSearchParams({ tab: "overview" }, { replace: true });
    }
  }, [activeTab, visibleTabs, setSearchParams]);

  const showToast = (type, text) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await pharmacyOwnerService.updateProfile(profileFormData);
      if (res?.success) {
        showToast("success", "Pharmacy profile details updated successfully.");
        if (res.pharmacy) setPharmacy(res.pharmacy);
      } else {
        showToast("error", res?.message || "Failed to update pharmacy profile.");
      }
    } catch (err) {
      showToast("error", err?.response?.data?.message || err?.message || "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handlers
  const handleSaveStockRecord = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await pharmacyOwnerService.addOrUpdateInventory(stockFormData);
      if (res?.success) {
        showToast("success", res.message || "Stock record saved successfully.");
        setAddStockModalOpen(false);
        loadPortalData();
      } else {
        showToast("error", res?.message || "Failed to save stock record.");
      }
    } catch (err) {
      showToast("error", err?.response?.data?.message || err?.message || "Failed to save stock.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenAdjustModal = (item) => {
    setAdjustModalItem(item);
    setAdjustData({
      stock: item.stock ?? 0,
      price: item.price ?? 0,
      reason: "Manual Inventory Adjustment",
    });
  };

  const handleSaveAdjustment = async (e) => {
    e.preventDefault();
    if (!adjustModalItem) return;
    setSubmitting(true);
    try {
      const res = await pharmacyOwnerService.adjustStockAndPrice({
        medicineId: adjustModalItem.medicineId,
        stock: Number(adjustData.stock),
        price: Number(adjustData.price),
        reason: adjustData.reason,
      });
      if (res?.success) {
        showToast("success", "Stock & price updated successfully.");
        setAdjustModalItem(null);
        loadPortalData();
      } else {
        showToast("error", res?.message || "Adjustment failed.");
      }
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Adjustment failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await pharmacyOwnerService.updateOrderStatus(orderId, newStatus);
      if (res?.success) {
        showToast("success", `Order #${orderId} updated to ${newStatus}`);
        setOrders((prev) => prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o)));
        if (selectedOrder && selectedOrder.orderId === orderId) {
          setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
        }
      } else {
        showToast("error", res?.message || "Failed to update order status");
      }
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Failed to update status");
    }
  };

  const handleReviewPrescription = async (e) => {
    e.preventDefault();
    if (!selectedPrescription) return;
    setSubmitting(true);
    try {
      const res = await pharmacyOwnerService.reviewPrescription(selectedPrescription._id, rxReviewData);
      if (res?.success) {
        showToast("success", res.message || "Prescription review saved.");
        setSelectedPrescription(null);
        loadPortalData();
      } else {
        showToast("error", res?.message || "Review failed.");
      }
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Review failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitCatalogMedicine = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await pharmacyOwnerService.submitCatalogMedicine(catalogSubmitData);
      if (res?.success) {
        showToast("success", "New medicine catalog submission created. Awaiting Admin approval.");
        setCatalogSubmitModalOpen(false);
        setCatalogSubmitData({
          name: "",
          brand: "",
          genericName: "",
          category: "Fever & Pain Relief",
          manufacturer: "",
          price: 50,
          prescriptionRequired: false,
          description: "",
        });
      } else {
        showToast("error", res?.message || "Submission failed.");
      }
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await pharmacyOwnerService.addStaff(staffFormData);
      if (res?.success) {
        showToast("success", "Pharmacy staff account created successfully.");
        setAddStaffModalOpen(false);
        setStaffFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          permissions: ["inventory_read", "inventory_write", "orders_read", "orders_update", "prescriptions_read", "prescriptions_review"],
        });
        loadPortalData();
      } else {
        showToast("error", res?.message || "Failed to add staff.");
      }
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Failed to add staff.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !pharmacy) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading Pharmacy Owner Portal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl border font-semibold text-xs transition-all animate-in fade-in slide-in-from-bottom-5 ${
            toastMessage.type === "success"
              ? "bg-emerald-950 border-emerald-700 text-emerald-100"
              : "bg-rose-950 border-rose-700 text-rose-100"
          }`}
        >
          {toastMessage.text}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                {pharmacy?.name || "Partner Pharmacy"}
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    pharmacy?.approvalStatus === "approved"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {pharmacy?.approvalStatus === "approved" ? "Operational Partner" : "Approval Pending"}
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{pharmacy?.address || "Coimbatore, Tamil Nadu"}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={() => {
              setLoading(true);
              loadPortalData();
            }}
          >
            Refresh
          </Button>
          {(!isStaff || perms.includes("inventory_write")) && (
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setAddStockModalOpen(true)}>
              Add / Update Stock
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 border-b border-slate-200">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? "bg-teal-700 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.badge ? (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-extrabold">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Pharmacy Revenue</p>
                <p className="text-xl font-extrabold text-slate-900 mt-0.5">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Active Stock Items</p>
                <p className="text-xl font-extrabold text-slate-900 mt-0.5">{inventory.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Low Stock Alerts</p>
                <p className="text-xl font-extrabold text-amber-600 mt-0.5">{lowStockCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Pending RX Reviews</p>
                <p className="text-xl font-extrabold text-indigo-600 mt-0.5">{pendingRxCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Quick Action Alerts */}
          {pharmacy?.approvalStatus !== "approved" && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-amber-900 text-xs">
              <ShieldAlert className="w-6 h-6 shrink-0 text-amber-600" />
              <div>
                <p className="font-extrabold">Pharmacy Approval Pending System Admin Verification</p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Your pharmacy account details and license registration are currently undergoing system administrator review.
                </p>
              </div>
            </div>
          )}

          {/* Recent Orders & Prescriptions Quick Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-teal-600" />
                  Recent Assigned Orders
                </h3>
                <button onClick={() => setActiveTab("orders")} className="text-xs font-bold text-teal-700 hover:underline">
                  View All &rarr;
                </button>
              </div>
              {orders.length === 0 ? (
                <p className="text-xs text-slate-500 p-4 text-center">No orders assigned to your pharmacy yet.</p>
              ) : (
                <div className="space-y-2">
                  {orders.slice(0, 4).map((o) => (
                    <div key={o._id || o.orderId} className="p-3 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold font-mono text-teal-700">{o.orderId}</p>
                        <p className="text-slate-500">{o.deliveryAddress?.fullName || "Customer"} &bull; ₹{o.totalAmount}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {o.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-indigo-600" />
                  Prescription Requests Queue
                </h3>
                <button onClick={() => setActiveTab("prescriptions")} className="text-xs font-bold text-teal-700 hover:underline">
                  View Queue &rarr;
                </button>
              </div>
              {prescriptions.length === 0 ? (
                <p className="text-xs text-slate-500 p-4 text-center">No prescription review requests pending.</p>
              ) : (
                <div className="space-y-2">
                  {prescriptions.slice(0, 4).map((rx) => (
                    <div key={rx._id} className="p-3 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{rx.user?.name || "Customer"}</p>
                        <p className="text-slate-400 text-[10px] font-mono">{rx.filename}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700">
                        {rx.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY */}
      {activeTab === "inventory" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Pharmacy Inventory & Stock Control</h3>
              <p className="text-xs text-slate-500">Live stock for {pharmacy?.name}. Changes sync immediately to customer storefront search.</p>
            </div>
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setAddStockModalOpen(true)}>
              Add Medicine Stock
            </Button>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicine brand, generic name..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                <tr>
                  <th className="p-3.5">Medicine</th>
                  <th className="p-3.5">Selling Price (₹)</th>
                  <th className="p-3.5">Stock Qty</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Batch / Expiry</th>
                  <th className="p-3.5">Verification</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventory
                  .filter((inv) => {
                    const q = searchQuery.toLowerCase().trim();
                    const med = inv.medicine || {};
                    return (
                      !q ||
                      (med.brand && med.brand.toLowerCase().includes(q)) ||
                      (med.name && med.name.toLowerCase().includes(q)) ||
                      (med.genericName && med.genericName.toLowerCase().includes(q))
                    );
                  })
                  .map((inv) => {
                    const med = inv.medicine || {};
                    const isLow = (inv.stock ?? 0) <= (inv.lowStockThreshold ?? 10);
                    const isExpired = inv.expiryDate && new Date(inv.expiryDate) < new Date();
                    return (
                      <tr key={inv._id || inv.medicineId} className="hover:bg-slate-50/80">
                        <td className="p-3.5">
                          <p className="font-extrabold text-slate-900">{med.brand || med.name || inv.medicineId}</p>
                          <p className="text-[11px] text-slate-500">{med.genericName || med.category}</p>
                        </td>
                        <td className="p-3.5 font-extrabold text-slate-900">₹{inv.price}</td>
                        <td className="p-3.5 font-bold">
                          <span className={isLow ? "text-amber-600 font-extrabold" : "text-slate-900"}>{inv.stock} units</span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              inv.stock === 0
                                ? "bg-rose-50 text-rose-700"
                                : isLow
                                ? "bg-amber-50 text-amber-700"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {inv.stock === 0 ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <p className="font-mono text-[11px] font-bold text-slate-700">{inv.batchNumber || "N/A"}</p>
                          <p className={`text-[10px] ${isExpired ? "text-rose-600 font-bold" : "text-slate-400"}`}>
                            {inv.expiryDate ? new Date(inv.expiryDate).toLocaleDateString() : "No Expiry Recorded"}
                          </p>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold capitalize">
                            {inv.stockType || "verified"}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <Button variant="secondary" size="sm" icon={Edit2} onClick={() => handleOpenAdjustModal(inv)}>
                            Quick Adjust
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

      {/* TAB: ADD MEDICINE / UPDATE PRICE AND STOCK */}
      {activeTab === "add_update" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Plus className="w-5 h-5 text-teal-600" />
                  Add Medicine / Update Price & Stock
                </h3>
                <p className="text-xs text-slate-500">
                  Select any central catalog medicine to update your pharmacy's real-time inventory quantity and selling price.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveStockRecord} className="space-y-4 max-w-2xl text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Medicine from Catalog</label>
                <select
                  value={stockFormData.medicineId}
                  onChange={(e) => {
                    const sel = catalogMedicines.find((m) => m.id === e.target.value);
                    const existingInv = inventory.find((i) => i.medicineId === e.target.value);
                    setStockFormData({
                      ...stockFormData,
                      medicineId: e.target.value,
                      price: existingInv ? existingInv.price : sel ? sel.price : stockFormData.price,
                      stock: existingInv ? existingInv.stock : stockFormData.stock,
                      batchNumber: existingInv?.batchNumber || stockFormData.batchNumber,
                      expiryDate: existingInv?.expiryDate ? new Date(existingInv.expiryDate).toISOString().slice(0, 10) : stockFormData.expiryDate,
                      reason: existingInv ? "Stock & Price Revision" : "Initial Stock Record Entry",
                    });
                  }}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                >
                  <option value="">-- Choose Medicine from Catalog --</option>
                  {catalogMedicines.map((m) => {
                    const inStock = inventory.find((i) => i.medicineId === m.id);
                    return (
                      <option key={m.id} value={m.id}>
                        {m.brand || m.name} ({m.genericName || m.category}) — ₹{inStock ? inStock.price : m.price} {inStock ? `[Currently in Stock: ${inStock.stock}]` : "[Not In Stock Yet]"}
                      </option>
                    );
                  })}
                </select>
                {stockFormData.medicineId && (
                  <p className="text-[11px] text-teal-700 font-semibold mt-1">
                    {inventory.find((i) => i.medicineId === stockFormData.medicineId)
                      ? "✓ This medicine is already in your inventory. Submitting will update its stock quantity, selling price, and batch info."
                      : "+ This medicine will be added to your pharmacy inventory with the stock specified below."}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={stockFormData.price}
                    onChange={(e) => setStockFormData({ ...stockFormData, price: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock Quantity (Units)</label>
                  <input
                    type="number"
                    min="0"
                    value={stockFormData.stock}
                    onChange={(e) => setStockFormData({ ...stockFormData, stock: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={stockFormData.batchNumber}
                    onChange={(e) => setStockFormData({ ...stockFormData, batchNumber: e.target.value })}
                    placeholder="e.g. BATCH-7821"
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={stockFormData.expiryDate}
                    onChange={(e) => setStockFormData({ ...stockFormData, expiryDate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Low Stock Warning Threshold</label>
                  <input
                    type="number"
                    min="1"
                    value={stockFormData.lowStockThreshold}
                    onChange={(e) => setStockFormData({ ...stockFormData, lowStockThreshold: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Verification / Stock Type</label>
                  <select
                    value={stockFormData.stockType}
                    onChange={(e) => setStockFormData({ ...stockFormData, stockType: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="verified">Verified Stock</option>
                    <option value="partner_stock">Partner Direct Stock</option>
                    <option value="emergency_stock">Emergency Reserve</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Audit Log Reason</label>
                <input
                  type="text"
                  value={stockFormData.reason}
                  onChange={(e) => setStockFormData({ ...stockFormData, reason: e.target.value })}
                  placeholder="e.g. Restocked batch, price revision, supplier delivery..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="pt-2">
                <Button variant="primary" size="md" type="submit" disabled={submitting}>
                  {submitting ? "Saving Stock Record..." : "Save Medicine Stock & Price"}
                </Button>
              </div>
            </form>
          </div>

          {/* Section 2: Propose New Medicine Formulation */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Send className="w-5 h-5 text-indigo-600" />
                  Submit New Formulation to Central Catalog
                </h3>
                <p className="text-xs text-slate-500">
                  Can't find a medicine in the central catalog? Propose a new medicine formulation to the System Administrator for central listing.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitCatalogMedicine} className="space-y-4 max-w-2xl text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Medicine Brand Name</label>
                  <input
                    type="text"
                    value={catalogSubmitData.brand}
                    onChange={(e) => setCatalogSubmitData({ ...catalogSubmitData, brand: e.target.value })}
                    placeholder="e.g. Dolo 650"
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Formulation Name</label>
                  <input
                    type="text"
                    value={catalogSubmitData.name}
                    onChange={(e) => setCatalogSubmitData({ ...catalogSubmitData, name: e.target.value })}
                    placeholder="e.g. Paracetamol 650mg Tablet"
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Generic Name / Composition</label>
                  <input
                    type="text"
                    value={catalogSubmitData.genericName}
                    onChange={(e) => setCatalogSubmitData({ ...catalogSubmitData, genericName: e.target.value })}
                    placeholder="e.g. Paracetamol"
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Manufacturer</label>
                  <input
                    type="text"
                    value={catalogSubmitData.manufacturer}
                    onChange={(e) => setCatalogSubmitData({ ...catalogSubmitData, manufacturer: e.target.value })}
                    placeholder="e.g. Micro Labs Ltd"
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <input
                    type="text"
                    value={catalogSubmitData.category}
                    onChange={(e) => setCatalogSubmitData({ ...catalogSubmitData, category: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Base Catalog Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={catalogSubmitData.price}
                    onChange={(e) => setCatalogSubmitData({ ...catalogSubmitData, price: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={catalogSubmitData.prescriptionRequired}
                    onChange={(e) => setCatalogSubmitData({ ...catalogSubmitData, prescriptionRequired: e.target.checked })}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                  />
                  Prescription Required (Schedule H / Rx)
                </label>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Dosage Instructions</label>
                <textarea
                  rows="2"
                  value={catalogSubmitData.description}
                  onChange={(e) => setCatalogSubmitData({ ...catalogSubmitData, description: e.target.value })}
                  placeholder="Clinical usage and indications..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="pt-2">
                <Button variant="primary" size="md" type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Formulation to Admin"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: BATCH & EXPIRY */}
      {activeTab === "expiry" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Batch & Expiry Date Monitor</h3>
            <p className="text-xs text-slate-500">Track expired stock and near-expiry medicine batches for your pharmacy.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                <tr>
                  <th className="p-3.5">Medicine</th>
                  <th className="p-3.5">Batch Number</th>
                  <th className="p-3.5">Expiry Date</th>
                  <th className="p-3.5">Current Stock</th>
                  <th className="p-3.5">Expiry Warning</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventory.map((inv) => {
                  const med = inv.medicine || {};
                  const { isExpired, isNearExpiry, formattedDate } = checkExpiryStatus(inv.expiryDate);
                  return (
                    <tr key={inv._id || inv.medicineId} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">{med.brand || med.name || inv.medicineId}</td>
                      <td className="p-3.5 font-mono text-slate-700">{inv.batchNumber || "BATCH-DEFAULT"}</td>
                      <td className="p-3.5 font-medium">{formattedDate}</td>
                      <td className="p-3.5 font-bold text-slate-900">{inv.stock} units</td>
                      <td className="p-3.5">
                        {isExpired ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700">
                            Expired
                          </span>
                        ) : isNearExpiry ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-50 text-amber-700">
                            Near Expiry (&lt; 60 days)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                            Valid Batch
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <Button variant="secondary" size="sm" onClick={() => handleOpenAdjustModal(inv)}>
                          Update Expiry / Stock
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

      {/* TAB 4: CUSTOMER ORDERS */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Customer Order Fulfillment Queue</h3>
              <p className="text-xs text-slate-500">Orders placed by customers targeting {pharmacy?.name}.</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">{orders.length} total orders</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Customer Details</th>
                  <th className="p-3.5">Total Amount</th>
                  <th className="p-3.5">Payment Method</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o._id || o.orderId} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold font-mono text-teal-700">{o.orderId}</td>
                    <td className="p-3.5 font-semibold text-slate-800">
                      {o.deliveryAddress?.fullName || "Customer"}
                      <p className="text-[10px] text-slate-400 font-normal">{o.deliveryAddress?.phone}</p>
                    </td>
                    <td className="p-3.5 font-extrabold text-slate-900">₹{o.totalAmount}</td>
                    <td className="p-3.5 uppercase font-medium text-slate-600">{o.paymentMethod}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right flex items-center justify-end gap-1.5">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.orderId, e.target.value)}
                        className="p-1 border border-slate-200 rounded text-[11px] bg-white font-medium outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        {["placed", "confirmed", "packed", "out-for-delivery", "delivered", "cancelled"].map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PRESCRIPTION QUEUE */}
      {activeTab === "prescriptions" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Prescription Review Queue</h3>
              <p className="text-xs text-slate-500">Secure customer prescription upload requests assigned to your pharmacy.</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">{prescriptions.length} requests</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                <tr>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Requested Medicine</th>
                  <th className="p-3.5">Document</th>
                  <th className="p-3.5">Uploaded Date</th>
                  <th className="p-3.5">Review Status</th>
                  <th className="p-3.5">Reviewed By</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prescriptions.map((rx) => (
                  <tr key={rx._id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">
                      {rx.user?.name || "Customer"}
                      <p className="text-[10px] text-slate-400 font-normal">{rx.user?.email}</p>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-800">
                      {rx.medicineName ? (
                        <div>
                          <p className="font-bold text-teal-800">{rx.medicineName}</p>
                          {rx.customerNotes && (
                            <p className="text-[10px] text-slate-500 line-clamp-1 italic font-normal">"{rx.customerNotes}"</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Prescription Order</span>
                      )}
                    </td>
                    <td className="p-3.5 font-mono text-slate-700">
                      <span className="truncate max-w-[140px] inline-block" title={rx.originalName || rx.filename}>
                        {rx.originalName || rx.filename}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500">{new Date(rx.createdAt).toLocaleDateString()}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        rx.status === "approved"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : rx.status === "rejected"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : rx.status === "under-review"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      }`}>
                        {rx.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500">{rx.reviewedBy?.name || "Pending Review"}</td>
                    <td className="p-3.5 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Eye}
                        onClick={() => {
                          setSelectedPrescription(rx);
                          setRxReviewData({ status: rx.status || "reviewed", reviewNotes: rx.reviewNotes || "", rejectionReason: rx.rejectionReason || "" });
                        }}
                      >
                        Review RX
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: CATALOG SUBMISSIONS */}
      {activeTab === "submissions" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Central Catalog Addition Requests</h3>
              <p className="text-xs text-slate-500">Submit candidate new medicines to System Admin for central catalog addition.</p>
            </div>
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setCatalogSubmitModalOpen(true)}>
              Submit New Medicine
            </Button>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            <p className="font-bold">Catalog Submission Rules:</p>
            <p className="mt-1">
              If a medicine is missing from the MediBridge catalog, submit it here. Once approved by a System Admin, it will be added to the central catalog and your pharmacy stock automatically.
            </p>
          </div>
        </div>
      )}

      {/* TAB 7: STAFF MANAGEMENT */}
      {activeTab === "staff" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Pharmacy Staff Management</h3>
              <p className="text-xs text-slate-500">Add staff accounts and manage granular permissions for {pharmacy?.name}.</p>
            </div>
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setAddStaffModalOpen(true)}>
              Add Staff Member
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                <tr>
                  <th className="p-3.5">Staff Name</th>
                  <th className="p-3.5">Email / Phone</th>
                  <th className="p-3.5">Assigned Permissions</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staff.map((st) => (
                  <tr key={st._id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">{st.name}</td>
                    <td className="p-3.5 font-mono text-slate-600">
                      {st.email}
                      <p className="text-[10px] text-slate-400">{st.phone}</p>
                    </td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1">
                        {(st.staffPermissions || []).map((p) => (
                          <span key={p} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded text-[10px] uppercase">
                        {st.accountStatus || "active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: AUDIT LOG */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Stock Adjustment History & Activity Log</h3>
            <p className="text-xs text-slate-500">Complete audit trail of all inventory quantity and price changes for this pharmacy.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                <tr>
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5">Medicine ID</th>
                  <th className="p-3.5">Old Stock</th>
                  <th className="p-3.5">New Stock</th>
                  <th className="p-3.5">Net Change</th>
                  <th className="p-3.5">Reason / Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3.5 text-slate-500 text-[11px] font-mono">
                      {log.date ? new Date(log.date).toLocaleString() : "Recent Record"}
                    </td>
                    <td className="p-3.5 font-bold font-mono text-slate-900">{log.medicineId}</td>
                    <td className="p-3.5 text-slate-600">{log.oldStock ?? 0}</td>
                    <td className="p-3.5 font-bold text-slate-900">{log.newStock ?? 0}</td>
                    <td className="p-3.5 font-extrabold">
                      <span className={(log.change ?? 0) >= 0 ? "text-emerald-600" : "text-rose-600"}>
                        {(log.change ?? 0) >= 0 ? `+${log.change}` : log.change}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <p className="font-semibold text-slate-800">{log.reason || "Stock Adjustment"}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{log.source || "portal"}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: PHARMACY PROFILE */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* Pharmacy Identity Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <Building2 className="w-7 h-7 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    {pharmacy?.name || "Partner Pharmacy"}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        pharmacy?.approvalStatus === "approved"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {pharmacy?.approvalStatus === "approved" ? "Operational Partner" : "Approval Pending"}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pharmacy Partner ID: <span className="font-mono font-bold text-slate-700">{pharmacy?.id}</span> &bull; {inventory.length} Stock SKUs Active
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  Role: <span className="capitalize font-bold text-teal-700">{user?.role?.replace("_", " ")}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Edit Pharmacy Profile Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                Pharmacy Profile & Operational Details
              </h3>
              <p className="text-xs text-slate-500">
                Update your licensed premises address, registered pharmacist, contact details, operating hours, and delivery settings.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-3xl text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Drug License Number</label>
                  <input
                    type="text"
                    value={profileFormData.licenseNumber}
                    onChange={(e) => setProfileFormData({ ...profileFormData, licenseNumber: e.target.value })}
                    placeholder="e.g. DL-TN-2024-99881"
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pharmacist in Charge</label>
                  <input
                    type="text"
                    value={profileFormData.responsiblePharmacist}
                    onChange={(e) => setProfileFormData({ ...profileFormData, responsiblePharmacist: e.target.value })}
                    placeholder="e.g. Dr. R. Raman, Reg. Pharm #44102"
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={profileFormData.phone}
                    onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Physical Street Address</label>
                  <input
                    type="text"
                    value={profileFormData.address}
                    onChange={(e) => setProfileFormData({ ...profileFormData, address: e.target.value })}
                    placeholder="123 Hospital Road, Gandhipuram, Coimbatore"
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Opening Time</label>
                  <input
                    type="text"
                    value={profileFormData.openingTime}
                    onChange={(e) => setProfileFormData({ ...profileFormData, openingTime: e.target.value })}
                    placeholder="08:00 AM"
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Closing Time</label>
                  <input
                    type="text"
                    value={profileFormData.closingTime}
                    onChange={(e) => setProfileFormData({ ...profileFormData, closingTime: e.target.value })}
                    placeholder="10:00 PM"
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={profileFormData.deliveryAvailable}
                      onChange={(e) => setProfileFormData({ ...profileFormData, deliveryAvailable: e.target.checked })}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                    />
                    Home Delivery Available
                  </label>
                  <p className="text-[11px] text-slate-500 mt-1">Check if this pharmacy fulfills direct home deliveries to nearby customers.</p>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Delivery Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={profileFormData.deliveryFee}
                    onChange={(e) => setProfileFormData({ ...profileFormData, deliveryFee: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <Button variant="primary" size="md" icon={Save} type="submit" disabled={submitting}>
                  {submitting ? "Saving Profile..." : "Save Pharmacy Profile"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / UPDATE STOCK ITEM */}
      {addStockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Add / Update Medicine Stock</h3>
              <button onClick={() => setAddStockModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveStockRecord} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700">Select Central Catalog Medicine</label>
                <select
                  value={stockFormData.medicineId}
                  onChange={(e) => {
                    const sel = catalogMedicines.find((m) => m.id === e.target.value);
                    const existingInv = inventory.find((i) => i.medicineId === e.target.value);
                    setStockFormData({
                      ...stockFormData,
                      medicineId: e.target.value,
                      price: existingInv ? existingInv.price : sel ? sel.price : stockFormData.price,
                      stock: existingInv ? existingInv.stock : stockFormData.stock,
                      batchNumber: existingInv?.batchNumber || stockFormData.batchNumber,
                      expiryDate: existingInv?.expiryDate
                        ? new Date(existingInv.expiryDate).toISOString().slice(0, 10)
                        : stockFormData.expiryDate,
                      lowStockThreshold: existingInv?.lowStockThreshold ?? stockFormData.lowStockThreshold,
                      reason: existingInv ? "Stock & Price Revision" : "Initial Stock Record Entry",
                    });
                  }}
                  className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                >
                  <option value="">-- Choose Medicine --</option>
                  {catalogMedicines.map((m) => {
                    const inStock = inventory.find((i) => i.medicineId === m.id);
                    return (
                      <option key={m.id} value={m.id}>
                        {m.brand || m.name} ({m.genericName || m.category}) — ₹{inStock ? inStock.price : m.price} {inStock ? `[In Stock: ${inStock.stock}]` : "[Not In Stock Yet]"}
                      </option>
                    );
                  })}
                </select>
                {stockFormData.medicineId && (
                  <p className="text-[11px] text-teal-700 font-semibold mt-1">
                    {inventory.find((i) => i.medicineId === stockFormData.medicineId)
                      ? "✓ This medicine is already in your inventory. Submitting will update its selling price, stock quantity, batch, and expiry info."
                      : "+ This medicine will be newly added to your pharmacy inventory with the stock specified below."}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Selling Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={stockFormData.price}
                    onChange={(e) => setStockFormData({ ...stockFormData, price: e.target.value })}
                    className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={stockFormData.stock}
                    onChange={(e) => setStockFormData({ ...stockFormData, stock: e.target.value })}
                    className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Batch Number</label>
                  <input
                    type="text"
                    value={stockFormData.batchNumber}
                    onChange={(e) => setStockFormData({ ...stockFormData, batchNumber: e.target.value })}
                    placeholder="e.g. BATCH-1001"
                    className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Expiry Date</label>
                  <input
                    type="date"
                    value={stockFormData.expiryDate}
                    onChange={(e) => setStockFormData({ ...stockFormData, expiryDate: e.target.value })}
                    className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Low Stock Threshold</label>
                  <input
                    type="number"
                    min="1"
                    value={stockFormData.lowStockThreshold}
                    onChange={(e) => setStockFormData({ ...stockFormData, lowStockThreshold: e.target.value })}
                    className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Audit Log Reason</label>
                  <input
                    type="text"
                    value={stockFormData.reason}
                    onChange={(e) => setStockFormData({ ...stockFormData, reason: e.target.value })}
                    placeholder="e.g. Restocked batch, price revision"
                    className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button variant="secondary" size="sm" type="button" onClick={() => setAddStockModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Stock Record"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: QUICK ADJUST STOCK */}
      {adjustModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Adjust Stock & Price</h3>
              <button onClick={() => setAdjustModalItem(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-4 text-xs">
              <p className="font-bold text-slate-900 text-sm">{adjustModalItem.medicine?.brand || adjustModalItem.medicineId}</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={adjustData.stock}
                    onChange={(e) => setAdjustData({ ...adjustData, stock: e.target.value })}
                    className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={adjustData.price}
                    onChange={(e) => setAdjustData({ ...adjustData, price: e.target.value })}
                    className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Adjustment Reason (Audit Required)</label>
                <input
                  type="text"
                  value={adjustData.reason}
                  onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
                  placeholder="e.g. Shipment received, inventory audit"
                  className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button variant="secondary" size="sm" type="button" onClick={() => setAdjustModalItem(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Adjustment"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRESCRIPTION REVIEW */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Review Customer Prescription</h3>
              <button onClick={() => setSelectedPrescription(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">
                &times;
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{selectedPrescription.user?.name || "Customer"}</p>
                  <p className="text-slate-500">{selectedPrescription.user?.email || "No email"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingDocRxId(selectedPrescription._id)}
                  className="px-3 py-1.5 bg-teal-700 text-white font-bold rounded-lg hover:bg-teal-800 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  View Document
                </button>
              </div>
              {selectedPrescription.medicineName && (
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="font-bold text-slate-700">Requested Medicine:</span>
                  <span className="font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                    {selectedPrescription.medicineName}
                  </span>
                </div>
              )}
              {selectedPrescription.customerNotes && (
                <div className="pt-1.5 border-t border-slate-200/80 text-slate-600">
                  <span className="font-bold text-slate-700">Customer Note: </span>
                  <span className="italic">"{selectedPrescription.customerNotes}"</span>
                </div>
              )}
            </div>

            <form onSubmit={handleReviewPrescription} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700">Review Status Decision</label>
                <select
                  value={rxReviewData.status}
                  onChange={(e) => setRxReviewData({ ...rxReviewData, status: e.target.value })}
                  className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="under-review">Under Review</option>
                  <option value="clarification-required">Clarification Required</option>
                  <option value="reviewed">Reviewed & Verified</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Reviewer Notes & Feedback</label>
                <textarea
                  rows="3"
                  value={rxReviewData.reviewNotes}
                  onChange={(e) => setRxReviewData({ ...rxReviewData, reviewNotes: e.target.value })}
                  placeholder="Enter pharmacist review notes or instructions for customer..."
                  className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button variant="secondary" size="sm" type="button" onClick={() => setSelectedPrescription(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Review Decision"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT NEW CATALOG MEDICINE */}
      {catalogSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Submit New Medicine to Catalog</h3>
              <button onClick={() => setCatalogSubmitModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitCatalogMedicine} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Brand Name</label>
                  <input
                    type="text"
                    value={catalogSubmitData.brand}
                    onChange={(e) => setCatalogSubmitData({ ...catalogSubmitData, brand: e.target.value })}
                    className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Generic Name</label>
                  <input
                    type="text"
                    value={catalogSubmitData.genericName}
                    onChange={(e) => setCatalogSubmitData({ ...catalogSubmitData, genericName: e.target.value, name: e.target.value })}
                    className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Category</label>
                  <input
                    type="text"
                    value={catalogSubmitData.category}
                    onChange={(e) => setCatalogSubmitData({ ...catalogSubmitData, category: e.target.value })}
                    className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Base Price (₹)</label>
                  <input
                    type="number"
                    value={catalogSubmitData.price}
                    onChange={(e) => setCatalogSubmitData({ ...catalogSubmitData, price: e.target.value })}
                    className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button variant="secondary" size="sm" type="button" onClick={() => setCatalogSubmitModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit to Admin"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD STAFF */}
      {addStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Add Pharmacy Staff Account</h3>
              <button onClick={() => setAddStaffModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">
                &times;
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Staff Full Name</label>
                <input
                  type="text"
                  value={staffFormData.name}
                  onChange={(e) => setStaffFormData({ ...staffFormData, name: e.target.value })}
                  className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={staffFormData.email}
                  onChange={(e) => setStaffFormData({ ...staffFormData, email: e.target.value })}
                  className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Initial Password</label>
                <input
                  type="password"
                  value={staffFormData.password}
                  onChange={(e) => setStaffFormData({ ...staffFormData, password: e.target.value })}
                  className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button variant="secondary" size="sm" type="button" onClick={() => setAddStaffModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Staff Account"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescription Document Secure Viewer Modal */}
      <PrescriptionDocumentModal
        isOpen={Boolean(viewingDocRxId)}
        prescriptionId={viewingDocRxId}
        title={selectedPrescription ? `Prescription - ${selectedPrescription.user?.name || "Customer"}` : "Prescription Document"}
        onClose={() => setViewingDocRxId(null)}
      />
    </div>
  );
}
