import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Pill,
  Building2,
  Package,
  ShoppingCart,
  FileText,
  Star,
  BarChart3,
  Globe,
  Activity,
  Settings,
  ShieldAlert,
  User,
  LogOut,
  X,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export const ADMIN_NAV_GROUPS = [
  {
    title: "ADMINISTRATION",
    items: [
      { id: "overview", path: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { id: "users", path: "/admin/users", label: "Users", icon: Users },
    ],
  },
  {
    title: "CATALOG",
    items: [
      { id: "medicines", path: "/admin/medicines", label: "Medicines", icon: Pill },
      { id: "pharmacies", path: "/admin/pharmacies", label: "Pharmacies", icon: Building2 },
      { id: "inventory", path: "/admin/inventory", label: "Inventory", icon: Package },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      { id: "orders", path: "/admin/orders", label: "Orders", icon: ShoppingCart },
      { id: "prescriptions", path: "/admin/prescriptions", label: "Prescriptions", icon: FileText },
      { id: "reviews", path: "/admin/reviews", label: "Reviews", icon: Star },
    ],
  },
  {
    title: "INSIGHTS",
    items: [
      { id: "analytics", path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { id: "translations", path: "/admin/translations", label: "Translation", icon: Globe },
      { id: "system", path: "/admin/system", label: "System Health", icon: Activity },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { id: "settings", path: "/admin/settings", label: "Settings", icon: Settings },
      { id: "audit-logs", path: "/admin/audit-logs", label: "Audit Log", icon: ShieldAlert },
    ],
  },
];

export default function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const { logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-teal-950/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-gradient-to-b from-[#0f766e] via-[#0d9488] to-[#115e59] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-2xl border-r border-teal-700/50`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-teal-600/40 bg-teal-950/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-teal-700 flex items-center justify-center font-bold shadow-md shadow-teal-950/20">
              <Pill className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                Medi<span className="text-teal-100">Bridge</span>
              </h1>
              <p className="text-[10px] uppercase font-extrabold tracking-widest text-white bg-white/20 border border-white/30 px-1.5 py-0.2 rounded inline-block">
                Administration
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-teal-100 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Customer Site Link */}
        <div className="p-3 border-b border-teal-600/40 bg-teal-950/20 shrink-0">
          <NavLink
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-teal-100 hover:text-white bg-teal-900/40 hover:bg-teal-900/70 border border-teal-500/30 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-teal-200" />
              View Customer Site
            </span>
            <span className="text-[10px] bg-white/15 text-white px-1.5 py-0.5 rounded font-bold">Storefront</span>
          </NavLink>
        </div>

        {/* Navigation Section with Visual Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 custom-scrollbar">
          {ADMIN_NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-teal-200/70">
                {group.title}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== "/admin" && location.pathname.startsWith(item.path));
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-white text-teal-900 font-bold shadow-lg shadow-teal-950/20"
                        : "text-teal-50/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-teal-700" : "text-teal-200/90"}`} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Account Footer */}
        <div className="p-3 border-t border-teal-600/40 bg-teal-950/30 space-y-1 shrink-0">
          <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-teal-200/70 pb-0.5">
            ACCOUNT
          </div>
          <NavLink
            to="/admin/profile"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                isActive ? "bg-white text-teal-900 font-bold" : "text-teal-100 hover:text-white hover:bg-white/10"
              }`
            }
          >
            <User className={`w-4 h-4 ${location.pathname === "/admin/profile" ? "text-teal-700" : "text-teal-200"}`} />
            <span>Admin Profile</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-200 hover:text-rose-100 hover:bg-rose-900/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
