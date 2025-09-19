import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/SuperAdmin.css";

export default function SuperAdmin() {
  const [reports, setReports] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalImages, setModalImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔄 Veri çek
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rep, usr, prod, lg] = await Promise.all([
          api.get("/superadmin/reports"),
          api.get("/superadmin/users"),
          api.get("/superadmin/products"),
          api.get("/superadmin/login-logs"),
        ]);

        setReports(rep.data);
        setUsers(usr.data);
        setProducts(prod.data);
        setLogs(lg.data);

        setLoading(false);
      } catch (err) {
        console.error("SuperAdmin veri çekme hatası:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Kullanıcı sil
  const deleteUser = async (id) => {
    if (!window.confirm("Kullanıcı silinsin mi?")) return;
    try {
      await api.delete(`/superadmin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Kullanıcı silme hatası:", err);
    }
  };

  // Ürün sil
  const deleteProduct = async (id) => {
    if (!window.confirm("Ürün silinsin mi?")) return;
    try {
      await api.delete(`/superadmin/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Ürün silme hatası:", err);
    }
  };

  // Modal aç
  const openModal = (images, index) => {
    setModalImages(images);
    setCurrentIndex(index);
  };

  // Modal kapat
  const closeModal = () => {
    setModalImages([]);
    setCurrentIndex(0);
  };

  // Sonraki resim
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % modalImages.length);
  };

  // Önceki resim
  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + modalImages.length) % modalImages.length);
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="super-admin">
      <h1 className="title">👑 Super Admin Panel</h1>

      {/* 📊 Raporlar */}
      <section className="super-card">
        <h2>📊 Raporlar</h2>
        <p><b>Kullanıcı Sayısı:</b> {reports?.stats.totalUsers}</p>
        <p><b>Satış Sayısı:</b> {reports?.stats.totalSales}</p>
        <p><b>Toplam Kazanç:</b> ₺{reports?.stats.totalEarnings}</p>
      </section>

      {/* 👥 Kullanıcılar */}
      <section className="super-card">
        <h2>👥 Kullanıcılar</h2>
        <table className="super-table">
          <thead>
            <tr>
              <th>Kullanıcı Adı</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Lisans</th>
              <th>Durum</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isLicensed ? "✅" : "❌"}</td>
                <td>{u.isActive ? "🟢 Aktif" : "🔴 Pasif"}</td>
                <td>
                  <button
                    className={`btn ${u.isActive ? "btn-warning" : "btn-success"}`}
                    onClick={async () => {
                      try {
                        const res = await api.patch(`/superadmin/users/${u._id}/status`);
                        alert(res.data.msg);
                        setUsers(
                          users.map((user) =>
                            user._id === u._id ? res.data.user : user
                          )
                        );
                      } catch (err) {
                        console.error("Durum güncelleme hatası:", err);
                        alert("❌ Durum güncellenemedi!");
                      }
                    }}
                  >
                    {u.isActive ? "Pasif Yap" : "Aktif Yap"}
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => deleteUser(u._id)}
                    style={{ marginLeft: "8px" }}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 🛒 Ürünler */}
      <section className="super-card">
        <h2>🛒 Ürünler</h2>
        <table className="super-table">
          <thead>
            <tr>
              <th>Resimler</th>
              <th>Adı</th>
              <th>Fiyat</th>
              <th>Stok</th>
              <th>Açıklama</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  {p.images?.length > 0 ? (
                    <div className="thumbs">
                      {p.images.map((img, i) => (
                        <img
                          key={i}
                          src={`http://localhost:5000${img}`}
                          alt={p.name}
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          onClick={() =>
                            openModal(
                              p.images.map((im) => `http://localhost:5000${im}`),
                              i
                            )
                          }
                        />
                      ))}
                    </div>
                  ) : "-"}
                </td>
                <td>{p.name}</td>
                <td>₺{p.price}</td>
                <td>{p.stock}</td>
                <td>{p.description}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteProduct(p._id)}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 📜 Login Logları */}
      <section className="super-card">
        <h2>📜 Login Logları</h2>
        <table className="super-table">
          <thead>
            <tr>
              <th>Kullanıcı</th>
              <th>Email</th>
              <th>Rol</th>
              <th>IP</th>
              <th>Ülke</th>
              <th>Şehir</th>
              <th>Cihaz</th>
              <th>Durum</th>
              <th>Tarih</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{log.user?.username}</td>
                <td>{log.user?.email}</td>
                <td>{log.user?.role}</td>
                <td>{log.ip}</td>
                <td>{log.country}</td>
                <td>{log.city}</td>
                <td>{log.userAgent}</td>
                <td>{log.status === "success" ? "✅ Başarılı" : "❌ Hatalı"}</td>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 🖼️ Resim Modal */}
      {modalImages.length > 0 && (
        <div className="image-modal" onClick={closeModal}>
          <button className="prev-btn" onClick={prevImage}>⬅️</button>
          <img src={modalImages[currentIndex]} alt="Büyük Görsel" />
          <button className="next-btn" onClick={nextImage}>➡️</button>
        </div>
      )}
    </div>
  );
}
