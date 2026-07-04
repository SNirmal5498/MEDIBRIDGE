import { NavLink } from "react-router-dom";
import {
  HeartPulse,
  House,
  Scale,
  MapPinned,
  Siren,
  Info,
  Globe,
  ChevronDown,
  Menu,
  LogIn,
  UserPlus,
} from "lucide-react";

function Navbar() {
  const navClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-2 bg-teal-50 text-teal-700 border border-teal-200 px-5 py-3 rounded-xl font-semibold transition-all"
      : "flex items-center gap-2 px-5 py-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-teal-700 transition-all";

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-10">

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-teal-500 flex items-center justify-center shadow-md">
              <HeartPulse className="text-white w-8 h-8" />
            </div>

            <div className="flex items-center gap-3">

              <h1 className="text-2xl font-bold text-slate-800">
                MediBridge
              </h1>

              <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2 py-1 rounded-md">
                v1.0
              </span>

            </div>

          </NavLink>

          {/* Navigation */}
          <div className="hidden lg:flex items-center gap-2">

            <NavLink to="/" className={navClass}>
              <House size={20} />
              Home
            </NavLink>

            <NavLink to="/medicine" className={navClass}>
              <Scale size={20} />
              Compare Medicines
            </NavLink>

            <NavLink to="/pharmacy" className={navClass}>
              <MapPinned size={20} />
              Nearby Pharmacy
            </NavLink>

            <NavLink to="/emergency" className={navClass}>
              <Siren size={20} />
              Emergency
            </NavLink>

            <NavLink to="/about" className={navClass}>
              <Info size={20} />
              About
            </NavLink>

          </div>

        </div>

        {/* Right */}
        <div className="hidden lg:flex items-center gap-4">

          {/* Language */}
          <button className="flex items-center gap-2 border border-gray-300 px-4 py-3 rounded-xl hover:bg-gray-50 transition">

            <Globe size={18} />

            English

            <ChevronDown size={18} />

          </button>

          {/* Login */}
          <NavLink
            to="/login"
            className="flex items-center gap-2 border border-teal-500 text-teal-600 px-5 py-3 rounded-xl font-semibold hover:bg-teal-50 transition"
          >
            <LogIn size={18} />
            Login
          </NavLink>

          {/* Register */}
          <NavLink
            to="/register"
            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-5 py-3 rounded-xl font-semibold shadow-md transition"
          >
            <UserPlus size={18} />
            Register
          </NavLink>

        </div>

        {/* Mobile Menu */}
        <button className="lg:hidden">
          <Menu size={30} />
        </button>

      </div>
    </nav>
  );
}

export default Navbar;