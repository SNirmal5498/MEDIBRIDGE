import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Medicine from "../pages/Medicine";
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";
import Favorites from "../pages/Favorites";
import Profile from "../pages/Profile";
import Admin from "../pages/Admin";
import About from "../pages/About";
import Pharmacy from "../pages/Pharmacy";
import Emergency from "../pages/Emergency";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main Features */}
        <Route path="/medicine" element={<Medicine />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/about" element={<About />} />

        {/* User Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin */}
        <Route path="/admin" element={<Admin />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Route>
    </Routes>
  );
}