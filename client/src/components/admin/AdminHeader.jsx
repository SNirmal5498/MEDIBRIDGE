import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  Globe,
  ChevronDown,
  ShieldCheck,
  User,
  Settings,
  LogOut,
  ExternalLink,
  Pill,
} from "lucide-react";
import { LANGUAGES } from "../../utils/constants";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../hooks/useLanguage";

export default function AdminHeader({ setMobileOpen }) {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const langRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left side: Hamburger & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-500">MediBridge Portal</span>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
            Admin Console
          </span>
        </div>
      </div>

      {/* Right side: Actions & Admin Profile */}
      <div className="flex items-center gap-3">
        {/* Customer Site Preview Button */}
        <NavLink
          to="/"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-200 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-primary" />
          <span>View Customer Site</span>
        </NavLink>

        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{language.label}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          {langOpen && (
            <div className="absolute right-0 mt-2 w-40 py-1 bg-white rounded-xl shadow-xl border border-slate-200 z-50">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l);
                    setLangOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium hover:bg-teal-50 transition-colors ${
                    l.code === language.code ? "text-primary font-bold bg-teal-50" : "text-slate-700"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative pl-3 border-l border-slate-200" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-teal-50/60 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-teal-700 text-white font-bold text-xs flex items-center justify-center border-2 border-teal-300 shadow-xs">
              {user?.name?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-xs font-bold text-slate-900">{user?.name ?? "MediBridge System Admin"}</p>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                  ADMIN
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                userMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 py-2 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50">
              <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                <p className="text-xs font-bold text-slate-900">{user?.name ?? "MediBridge System Admin"}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <NavLink
                  to="/admin"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/5 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Admin Dashboard
                </NavLink>

                <NavLink
                  to="/admin/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Admin Profile
                </NavLink>

                <NavLink
                  to="/admin/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Settings
                </NavLink>
              </div>

              <div className="my-1 border-t border-slate-100" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
