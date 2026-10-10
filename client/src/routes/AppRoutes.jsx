import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import { useAuth } from "../hooks/useAuth";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Medicine from "../pages/Medicine";
import MedicineDetails from "../pages/MedicineDetails";
import Compare from "../pages/Compare";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";
import Favorites from "../pages/Favorites";
import Profile from "../pages/Profile";
import Admin from "../pages/Admin";
import Pharmacy from "../pages/Pharmacy";
import Emergency from "../pages/Emergency";
import NotFound from "../pages/NotFound";

import PharmacyOwner from "../pages/PharmacyOwner";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-center text-text-muted">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-center text-text-muted">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function PharmacyOwnerRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-center text-text-muted">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!["admin", "pharmacy_owner", "pharmacy_staff"].includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Customer Storefront Routes */}
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main Features */}
        <Route path="/medicine" element={<Medicine />} />
        <Route path="/medicine/:id" element={<MedicineDetails />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/emergency" element={<Emergency />} />

        {/* Pharmacy Owner Portal */}
        <Route
          path="/pharmacy-owner"
          element={
            <PharmacyOwnerRoute>
              <PharmacyOwner />
            </PharmacyOwnerRoute>
          }
        />

        {/* User Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Dedicated Layout Routes */}
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin" element={<Admin tab="overview" />} />
        <Route path="/admin/users" element={<Admin tab="users" />} />
        <Route path="/admin/medicines" element={<Admin tab="medicines" />} />
        <Route path="/admin/pharmacies" element={<Admin tab="pharmacies" />} />
        <Route path="/admin/inventory" element={<Admin tab="inventory" />} />
        <Route path="/admin/orders" element={<Admin tab="orders" />} />
        <Route path="/admin/prescriptions" element={<Admin tab="prescriptions" />} />
        <Route path="/admin/reviews" element={<Admin tab="reviews" />} />
        <Route path="/admin/analytics" element={<Admin tab="analytics" />} />
        <Route path="/admin/translations" element={<Admin tab="translations" />} />
        <Route path="/admin/system" element={<Admin tab="system" />} />
        <Route path="/admin/settings" element={<Admin tab="settings" />} />
        <Route path="/admin/audit-logs" element={<Admin tab="audit-logs" />} />
        <Route path="/admin/profile" element={<Admin tab="profile" />} />
      </Route>
    </Routes>
  );
}