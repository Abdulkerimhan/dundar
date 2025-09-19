import React, { useState } from "react";
import "./AdminPanel.css";

export default function AdminPanel() {
  const [users] = useState([
    { id: 1, username: "testuser", email: "test@example.com", role: "user" },
    { id: 2, username: "admin", email: "admin@ftsline.com", role: "admin" },
    { id: 3, username: "super", email: "super@ftsline.com", role: "superadmin" },
  ]);

  const [products] = useState([
    { id: 1, name: "FTSLine Premium Üyelik", price: 99, stock: 50 },
    { id: 2, name: "Blockchain Eğitim Paketi", price: 149, stock: 30 },
    { id: 3, name: "Kripto Cüzdan Güvenlik Kiti", price: 79, stock: 100 },
  ]);

  return (
    <div className="admin-panel container">
      <h2>👑 Admin Panel</h2>

      {/* Kullanıcı Yönetimi */}
      <section>
        <h3>Kullanıcı Yönetimi</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Kullanıcı Adı</th>
                <th>Email</th>
                <th>Rol</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button className="btn-edit">✏️</button>
                    <button className="btn-delete">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Ürün Yönetimi */}
      <section>
        <h3>Ürün Yönetimi</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Ürün Adı</th>
                <th>Fiyat</th>
                <th>Stok</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.price} USDT</td>
                  <td>{p.stock}</td>
                  <td>
                    <button className="btn-edit">✏️</button>
                    <button className="btn-delete">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
