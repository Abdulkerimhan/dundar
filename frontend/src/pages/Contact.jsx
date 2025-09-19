import React, { useState } from "react";
import "./Contact.css";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setStatus("❌ Lütfen tüm alanları doldurun.");
      return;
    }

    // 📌 Gerçekte backend'e gönderilecek
    setStatus("✅ Mesajınız başarıyla gönderildi!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-page container">
      <h2>İletişim</h2>

      <div className="contact-grid">
        {/* Form */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ad Soyad</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Adınızı ve soyadınızı girin"
              required
            />
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="E-mail adresinizi girin"
              required
            />
          </div>

          <div className="form-group">
            <label>Mesajınız</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Mesajınızı yazın..."
              rows="5"
              required
            />
          </div>

          {status && <p className="status">{status}</p>}

          <button type="submit" className="btn-send">Gönder</button>
        </form>

        {/* Bilgiler */}
        <div className="contact-info">
          <h3>Bize Ulaşın</h3>
          <p>📧 info@ftsline.com</p>
          <p>📞 +90 555 123 4567</p>
          <p>📍 İstanbul, Türkiye</p>
        </div>
      </div>
    </div>
  );
}
