import React, { useState } from "react";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("❌ Lütfen e-posta adresinizi girin.");
      return;
    }
    // 📌 Demo: Gerçekte backend'e istek atılacak
    setMessage("✅ Doğrulama kodu e-posta adresinize gönderildi!");
  };

  return (
    <div className="forgot-page">
      <form className="forgot-form" onSubmit={handleSubmit}>
        <h2>Şifremi Unuttum</h2>
        <p>Hesabınıza ait e-posta adresini girin, size doğrulama kodu göndereceğiz.</p>

        <div className="form-group">
          <label>E-posta Adresi</label>
          <input
            type="email"
            value={email}
            placeholder="ornek@mail.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {message && <p className="message">{message}</p>}

        <button type="submit" className="btn-send">Kod Gönder</button>
      </form>
    </div>
  );
}
