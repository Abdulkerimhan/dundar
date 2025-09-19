// frontend/src/pages/admin/SuperAdminReports.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import "./SuperAdmin.css";

// 📊 Recharts
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ResponsiveContainer
} from "recharts";

export default function SuperAdminReports() {
  const [stats, setStats] = useState({ totalUsers: 0, totalSales: 0, totalEarnings: 0 });
  const [userGrowth, setUserGrowth] = useState([]);
  const [salesData, setSalesData] = useState([]);

  // API'den raporları çek
  const fetchReports = async () => {
    try {
      const res = await api.get("/superadmin/reports");
      setStats(res.data.stats);
      setUserGrowth(res.data.userGrowth);
      setSalesData(res.data.salesData);
    } catch (err) {
      console.error("Raporlar alınamadı:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📑 Raporlar & İstatistikler</h1>

      {/* Genel Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="super-card">
          <h3>👥 Toplam Kullanıcı</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="super-card">
          <h3>🛒 Toplam Satış</h3>
          <p>{stats.totalSales}</p>
        </div>
        <div className="super-card">
          <h3>💰 Toplam Kazanç</h3>
          <p>₺{stats.totalEarnings}</p>
        </div>
      </div>

      {/* Kullanıcı Büyümesi (LineChart) */}
      <div className="super-card mb-6">
        <h3>📈 Kullanıcı Büyümesi</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userGrowth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#2563eb" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Satış Dağılımı (BarChart) */}
      <div className="super-card">
        <h3>📊 Satış Raporu</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

