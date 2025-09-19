// frontend/src/pages/admin/SuperAdminUsers.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import "./SuperAdmin.css";

export default function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newUser, setNewUser] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    role: "user",
    sponsor: "",
  });

  const [editUser, setEditUser] = useState(null);

  // 📌 Kullanıcıları API'den çek
  const fetchUsers = async () => {
    try {
      const res = await api.get("/superadmin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Kullanıcı listesi alınamadı:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 📌 Kullanıcı Sil
  const handleDelete = async (id) => {
    if (!window.confirm("Bu kullanıcıyı silmek istediğine emin misin?")) return;
    try {
      await api.delete(`/superadmin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  // 📌 Yeni Kullanıcı Ekle
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", {
        username: newUser.username,
        fullname: newUser.fullname,
        email: newUser.email,
        password: newUser.password,
        ref: newUser.sponsor || null, // sponsor opsiyonel
      });

      setUsers([...users, res.data.user]);
      setNewUser({
        username: "",
        fullname: "",
        email: "",
        password: "",
        role: "user",
        sponsor: "",
      });
      alert("✅ Yeni kullanıcı eklendi");
    } catch (err) {
      console.error("Ekleme hatası:", err.response?.data || err);
    }
  };

  // 📌 Kullanıcı Güncelle
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/superadmin/users/${editUser._id}`, editUser);
      setUsers(users.map((u) => (u._id === editUser._id ? res.data.user : u)));
      setEditUser(null);
      alert("✅ Kullanıcı güncellendi");
    } catch (err) {
      console.error("Güncelleme hatası:", err.response?.data || err);
    }
  };

  // 📌 Kullanıcı Aktif/Pasif Toggle
  const handleToggleStatus = async (id) => {
    try {
      const res = await api.patch(`/superadmin/users/${id}/status`);
      setUsers(users.map((u) => (u._id === id ? res.data.user : u)));
      alert(res.data.msg);
    } catch (err) {
      console.error("Durum değiştirme hatası:", err);
    }
  };

  return (
    <div className="users-page">
      <h1 className="text-2xl font-bold mb-6">👥 Kullanıcı Yönetimi</h1>

      {/* Yeni Kullanıcı Ekleme Formu */}
      <form onSubmit={handleAddUser} className="super-card mb-6 form-card">
        <h3>➕ Yeni Kullanıcı Ekle</h3>
        <input
          type="text"
          placeholder="Kullanıcı adı"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Ad Soyad"
          value={newUser.fullname}
          onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          required
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="superadmin">SuperAdmin</option>
        </select>
        <select
          value={newUser.sponsor}
          onChange={(e) => setNewUser({ ...newUser, sponsor: e.target.value })}
        >
          <option value="">Sponsor (opsiyonel)</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.username} ({u.role})
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-success">
          Ekle
        </button>
      </form>

      {/* Kullanıcı Listesi */}
      {loading ? (
        <p>⏳ Yükleniyor...</p>
      ) : (
        <div className="table-wrapper">
          <table className="super-table">
            <thead>
              <tr>
                <th>Kullanıcı Adı</th>
                <th>Ad Soyad</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Sponsor</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7">Henüz kullanıcı yok.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.fullname || "-"}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.sponsor?.username || "-"}</td>
                    <td>{user.isActive ? "✅ Aktif" : "❌ Pasif"}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(user._id)}
                      >
                        Sil
                      </button>
                      <button
                        className="btn btn-edit"
                        onClick={() => setEditUser(user)}
                      >
                        Düzenle
                      </button>
                      <button
                        className={
                          user.isActive ? "btn btn-warning" : "btn btn-success"
                        }
                        onClick={() => handleToggleStatus(user._id)}
                      >
                        {user.isActive ? "Pasif Yap" : "Aktif Yap"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Güncelleme Formu */}
      {editUser && (
        <form onSubmit={handleUpdateUser} className="super-card mt-6">
          <h3>✏️ Kullanıcı Güncelle</h3>
          <input
            type="text"
            value={editUser.username}
            onChange={(e) =>
              setEditUser({ ...editUser, username: e.target.value })
            }
          />
          <input
            type="text"
            value={editUser.fullname}
            onChange={(e) =>
              setEditUser({ ...editUser, fullname: e.target.value })
            }
          />
          <input
            type="email"
            value={editUser.email}
            onChange={(e) =>
              setEditUser({ ...editUser, email: e.target.value })
            }
          />
          <select
            value={editUser.role}
            onChange={(e) =>
              setEditUser({ ...editUser, role: e.target.value })
            }
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">SuperAdmin</option>
          </select>
          <p>
            <b>Sponsor:</b>{" "}
            {editUser.sponsor?.username || "Yok"} ({editUser.sponsor?.email || "-"})
          </p>
          <label>
            <input
              type="checkbox"
              checked={editUser.isLicensed}
              onChange={(e) =>
                setEditUser({ ...editUser, isLicensed: e.target.checked })
              }
            />{" "}
            Lisanslı
          </label>
          <label>
            <input
              type="checkbox"
              checked={editUser.isActive}
              onChange={(e) =>
                setEditUser({ ...editUser, isActive: e.target.checked })
              }
            />{" "}
            Aktif
          </label>
          <button type="submit" className="btn btn-success">
            Kaydet
          </button>
          <button
            type="button"
            className="btn btn-cancel"
            onClick={() => setEditUser(null)}
          >
            Vazgeç
          </button>
        </form>
      )}
    </div>
  );
}
