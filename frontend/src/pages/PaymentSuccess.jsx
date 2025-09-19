// frontend/src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import MatrixTree from "./MatrixTree"; // ✅ Matrix ağacını çizmek için

export default function PaymentSuccess() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [sponsor, setSponsor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        // Kullanıcıyı lisansla + Matrix'e ekle
        const res = await api.post(`/payment/success/${userId}`);
        setUser(res.data.user);

        // Sponsorunu getir (Matrix'te nereye bağlandığını görmek için)
        if (res.data.user.sponsor) {
          const sponsorRes = await api.get(`/superadmin/users/${res.data.user.sponsor}`);
          setSponsor(sponsorRes.data);
        }
      } catch (err) {
        console.error("Payment error", err);
        alert("❌ Ödeme sonrası işlem başarısız oldu");
      } finally {
        setLoading(false);
      }
    };

    if (userId) handlePaymentSuccess();
  }, [userId]);

  if (loading) return <p>⏳ İşlem yapılıyor...</p>;
  if (!user) return <p>❌ Kullanıcı bulunamadı</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "30px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2>💳 Ödeme Başarılı</h2>
      <p>Kullanıcı lisanslandı ve Matrix’e eklendi ✅</p>

      <h3>📌 Kullanıcı Bilgileri</h3>
      <ul>
        <li><strong>Kullanıcı Adı:</strong> {user.username}</li>
        <li><strong>Email:</strong> {user.email}</li>
        <li><strong>Rol:</strong> {user.role}</li>
        <li><strong>Lisans Durumu:</strong> {user.isLicensed ? "✅ Lisanslı" : "❌ Lisanssız"}</li>
        <li><strong>Lisans Başlangıç:</strong> {user.licensedAt ? new Date(user.licensedAt).toLocaleDateString() : "-"}</li>
        <li><strong>Aktiflik:</strong> {user.isActive ? "🟢 Aktif" : "🔴 Pasif"}</li>
        <li><strong>Matrix Parent:</strong> {user.matrixParent || "Yok"}</li>
      </ul>

      {/* Matrix Ağacında gösterim */}
      <h3 style={{ marginTop: "30px" }}>📐 Matrix Konumu</h3>
      {sponsor ? (
        <MatrixTree root={sponsor} highlightUser={user._id} />
      ) : (
        <p>🌳 Kullanıcının sponsoru bulunamadı</p>
      )}
    </div>
  );
}
