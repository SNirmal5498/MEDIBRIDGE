import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Pill,
  Home,
  Scale,
  MapPin,
  Siren,
  Package,
  Heart,
  User,
  Globe,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { NAV_LINKS, AUTH_NAV_LINKS, LANGUAGES } from "../../utils/constants";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../hooks/useLanguage";
import Button from "./Button";

const ICONS = { Home, Scale, MapPin, Siren, Package, Heart, User };

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const langRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const links = isAuthenticated ? [...NAV_LINKS, ...AUTH_NAV_LINKS] : NAV_LINKS;

  function handleLogout() {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3 gap-4">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-hover text-white shadow-card">
              <Pill className="w-5 h-5" />
            </span>
            <span className="font-display font-extrabold text-lg text-text tracking-tight">
              Medi<span className="text-primary">Bridge</span>
            </span>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((link) => {
              const Icon = ICONS[link.icon];
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150
                    ${isActive ? "bg-primary-50 text-primary-hover" : "text-text-muted hover:text-text hover:bg-slate-100"}`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {t(link.labelKey)}
                </NavLink>
              );
            })}
          </nav>

          {/* Right cluster */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-medium text-text-muted hover:text-text hover:border-primary/40 transition-colors"
              >
                <Globe className="w-4 h-4" />
                {language.label}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 py-1.5 card z-10">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l);
                        setLangOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-sm hover:bg-primary-50 transition-colors
                        ${l.code === language.code ? "text-primary-hover font-semibold" : "text-text"}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="relative pl-3 border-l border-border" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-lg hover:bg-slate-100 pr-2 py-1 transition-colors"
                >
                  <div className="grid place-items-center w-9 h-9 rounded-full bg-primary-100 text-primary-hover font-semibold text-sm shrink-0">
                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <div className="hidden lg:block leading-tight text-left">
                    <p className="text-sm font-semibold text-text">{user?.name ?? "User"}</p>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-primary-hover bg-primary-50 px-1.5 py-0.5 rounded">
                      {user?.role ?? "User"}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-text-muted shrink-0 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 py-1.5 card z-10">
                    <NavLink
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors
                        ${isActive ? "text-primary-hover font-semibold bg-primary-50" : "text-text hover:bg-primary-50"}`
                      }
                    >
                      <User className="w-4 h-4" />
                      {t("nav.profile")}
                    </NavLink>
                    <NavLink
                      to="/favorites"
                      onClick={() => setUserMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors
                        ${isActive ? "text-primary-hover font-semibold bg-primary-50" : "text-text hover:bg-primary-50"}`
                      }
                    >
                      <Heart className="w-4 h-4" />
                      {t("nav.myMedications")}
                    </NavLink>
                    <div className="my-1.5 border-t border-border" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-danger hover:bg-danger-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t("nav.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-3 border-l border-border">
                <Button as={NavLink} to="/login" variant="ghost" size="sm">
                  {t("nav.login")}
                </Button>
                <Button as={NavLink} to="/register" variant="primary" size="sm">
                  {t("nav.register")}
                </Button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-text hover:bg-slate-100"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-4 space-y-1">
          {links.map((link) => {
            const Icon = ICONS[link.icon];
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium
                  ${isActive ? "bg-primary-50 text-primary-hover" : "text-text-muted hover:bg-slate-100"}`
                }
              >
                <Icon className="w-4 h-4" />
                {t(link.labelKey)}
              </NavLink>
            );
          })}

          {isAuthenticated && (
            <>
              <NavLink
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium
                  ${isActive ? "bg-primary-50 text-primary-hover" : "text-text-muted hover:bg-slate-100"}`
                }
              >
                <User className="w-4 h-4" />
                {t("nav.profile")}
              </NavLink>
              <NavLink
                to="/favorites"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium
                  ${isActive ? "bg-primary-50 text-primary-hover" : "text-text-muted hover:bg-slate-100"}`
                }
              >
                <Heart className="w-4 h-4" />
                {t("nav.myMedications")}
              </NavLink>
            </>
          )}

          <div className="pt-3 mt-3 border-t border-border flex gap-2">
            {isAuthenticated ? (
              <Button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                  navigate("/");
                }}
                variant="danger"
                size="sm"
                icon={LogOut}
                className="w-full"
              >
                {t("nav.logout")}
              </Button>
            ) : (
              <>
                <Button as={NavLink} to="/login" variant="secondary" size="sm" className="flex-1">
                  {t("nav.login")}
                </Button>
                <Button as={NavLink} to="/register" variant="primary" size="sm" className="flex-1">
                  {t("nav.register")}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}