import React, { useState, useEffect } from "react";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    password: "",
    career: "",
  });

  useEffect(() => {
    // 📌 Normalde backend’den kullanıcı bilgisi çekilir
    const storedUser = {
      fullname: "Test Kullanıcı",
      email: "test@example.com",
      password: "",
      career: "Bronz", // ✅ Demo kariyer seviyesi
    };
    setUser(storedUser);
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("✅ Bilgiler başarıyla güncellendi! (Demo)");
  };

  return (
    <div className="profile-page container">
      <h2>Profilim</h2>
      <form className="profile-form" onSubmit={handleSave}>
        <div className="form-group">
          <label>Ad Soyad</label>
          <input
            type="text"
            name="fullname"
            value={user.fullname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>E-mail</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Yeni Şifre</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="Yeni şifre (opsiyonel)"
          />
        </div>

        <div className="form-group">
          <label>Kariyer Seviyesi</label>
          <input
            type="text"
            value={user.career}
            readOnly
            className="readonly"
          />
        </div>

        <button type="submit" className="btn-save">Kaydet</button>
      </form>
    </div>
  );
}
