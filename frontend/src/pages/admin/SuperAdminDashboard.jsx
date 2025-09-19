import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import "./SuperAdmin.css";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalSales: 0, totalEarnings: 0 });
  const [latestUsers, setLatestUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/superadmin/reports");
        setStats(res.data.stats);
      } catch (err) {
        console.error("Rapor alınamadı:", err);
      }

      try {
        const resUsers = await api.get("/superadmin/users");
        setLatestUsers(resUsers.data.slice(-5));
      } catch (err) {
        console.error("Kullanıcı listesi alınamadı:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="title">📊 Super Admin Dashboard</h1>

      {/* İstatistik Kartları */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <h3>👥 Toplam Kullanıcı</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="stat-card green">
          <h3>🛒 Toplam Satış</h3>
          <p>{stats.totalSales}</p>
        </div>
        <div className="stat-card gold">
          <h3>💰 Toplam Kazanç</h3>
          <p>{stats.totalEarnings} USDT</p>
        </div>
      </div>

      {/* Son Kullanıcılar */}
      <div className="super-card mt-6">
        <h3>📌 Son Katılan Kullanıcılar</h3>
        <table className="super-table">
          <thead>
            <tr>
              <th>Kullanıcı</th>
              <th>Email</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {latestUsers.length === 0 ? (
              <tr>
                <td colSpan="3">Henüz kullanıcı yok</td>
              </tr>
            ) : (
              latestUsers.map((u) => (
                <tr key={u._id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
