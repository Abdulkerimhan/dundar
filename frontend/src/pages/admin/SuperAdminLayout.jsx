import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FaBars,
  FaUsers,
  FaSitemap,
  FaBox,
  FaChartPie,
  FaCog,
  FaHome,
} from "react-icons/fa";
import "./SuperAdminLayout.css";

export default function SuperAdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="superadmin-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <h2 className="sidebar-title">👑 Süper Admin</h2>
        <nav>
          <ul>
            <li>
              <NavLink to="/superadminpanel/dashboard" title="Dashboard">
                <FaHome />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/superadminpanel/users" title="Kullanıcılar">
                <FaUsers />
                <span>Kullanıcılar</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/superadminpanel/products" title="Ürünler">
                <FaBox />
                <span>Ürünler</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/superadminpanel/reports" title="Raporlama">
                <FaChartPie />
                <span>Raporlama</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/superadminpanel/unilevel" title="Ünilevel">
                <FaSitemap />
                <span>Ünilevel</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/superadminpanel/matrix" title="Matrix">
                <FaSitemap />
                <span>Matrix</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/superadminpanel/settings" title="Ayarlar">
                <FaCog />
                <span>Ayarlar</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Mobil overlay (arka plan karartma) */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="main-content">
        <button
          className="menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars />
        </button>
        <div className="outlet-wrapper">
          <Outlet /> {/* ✅ Nested route içerikleri buraya gelecek */}
        </div>
      </main>
    </div>
  );
}
