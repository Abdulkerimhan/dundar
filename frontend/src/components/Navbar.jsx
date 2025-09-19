import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/ftsline.png";
import api from "../api/axios";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0); // ✅ sepetteki toplam adet
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        try {
          await api.get("/auth/verify-token", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(storedUser);
        } catch {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();

    // ✅ İlk açılışta sepeti kontrol et
    updateCartCount();

    // ✅ Custom event dinleyici
    const handleCartUpdate = () => {
      updateCartCount();
    };

    document.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      document.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // 🔹 Sepetteki toplam adet hesaplama
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    setCartCount(totalQty);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <img src={logo} alt="FTSLine Logo" />
        <span className="logo-text">FTSLINE</span>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        {menuOpen ? "✖" : "☰"}
      </div>

      <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <li><NavLink to="/" onClick={() => setMenuOpen(false)}>Ana Sayfa</NavLink></li>
        <li><NavLink to="/about" onClick={() => setMenuOpen(false)}>Hakkımızda</NavLink></li>
        <li><NavLink to="/products" onClick={() => setMenuOpen(false)}>Ürünler</NavLink></li>
        <li><NavLink to="/contact" onClick={() => setMenuOpen(false)}>İletişim</NavLink></li>
        <li><NavLink to="/faq" onClick={() => setMenuOpen(false)}>SSS</NavLink></li>

        {/* 🛒 Sepet */}
        <li>
          <NavLink to="/cart" onClick={() => setMenuOpen(false)}>
            🛒 Sepet {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </NavLink>
        </li>

        <li className="nav-actions">
          {loading ? (
            <span>⏳</span>
          ) : !user ? (
            <>
              <NavLink to="/login" className="btn" onClick={() => setMenuOpen(false)}>Giriş</NavLink>
              <NavLink to="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Kayıt Ol</NavLink>
            </>
          ) : (
            <>
              <span className="user-info">👤 {user.fullname || user.username}</span>
              <NavLink to="/dashboard" className="btn" onClick={() => setMenuOpen(false)}>Panel</NavLink>
              <button className="btn btn-logout" onClick={handleLogout}>Çıkış</button>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
}
