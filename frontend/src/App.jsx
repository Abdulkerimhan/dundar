import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import ForgotPassword from "./pages/ForgotPassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Profile from "./pages/Profile";
import PaymentSuccess from "./pages/PaymentSuccess"; 
import Checkout from "./pages/Checkout"; // ✅ Ödeme sayfası
import VerifyEmail from "./pages/VerifyEmail"; // ✅ Mail doğrulama sayfası eklendi

// ✅ SuperAdmin parçaları
import SuperAdminLayout from "./pages/admin/SuperAdminLayout";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import SuperAdminUsers from "./pages/admin/SuperAdminUsers";
import SuperAdminProducts from "./pages/admin/SuperAdminProducts";
import SuperAdminReports from "./pages/admin/SuperAdminReports";
import SuperAdminUnilevel from "./pages/admin/SuperAdminUnilevel";
import SuperAdminMatrix from "./pages/admin/SuperAdminMatrix";
import SuperAdminSettings from "./pages/admin/SuperAdminSettings";

// 🔒 ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main style={{ minHeight: "80vh" }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/profile" element={<Profile />} />

            {/* ✅ Email Doğrulama */}
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* ✅ Ödeme */}
            <Route path="/checkout" element={<Checkout />} /> 
            <Route path="/payment/success/:userId" element={<PaymentSuccess />} />

            {/* Kullanıcı Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Admin Panel */}
            <Route
              path="/adminpanel"
              element={
                <ProtectedRoute roles={["admin", "superadmin"]}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            {/* ✅ SuperAdmin Nested Routes */}
            <Route
              path="/superadminpanel"
              element={
                <ProtectedRoute roles={["superadmin"]}>
                  <SuperAdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<SuperAdminDashboard />} />
              <Route path="users" element={<SuperAdminUsers />} />
              <Route path="products" element={<SuperAdminProducts />} />
              <Route path="reports" element={<SuperAdminReports />} />
              <Route path="unilevel" element={<SuperAdminUnilevel />} />
              <Route path="matrix" element={<SuperAdminMatrix />} />
              <Route path="settings" element={<SuperAdminSettings />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
