import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./VerifyEmail.css";
import logo from "../assets/ftsline.png";

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  /* ------------------ 📧 Email Doğrula ------------------ */
  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    const userId = localStorage.getItem("pendingUserId");
    if (!userId) {
      setError("❌ Kullanıcı bulunamadı, lütfen tekrar kayıt olun.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/verify-email", {
        userId,
        code: code.trim(), // ✅ boşlukları temizle
      });

      // ✅ Doğrulandı → user + token kaydet
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      localStorage.removeItem("pendingUserId");
      localStorage.removeItem("pendingUserEmail");

      alert(res.data.msg || "✅ Email başarıyla doğrulandı!");
      navigate("/dashboard"); // 🚀 Direkt dashboard
    } catch (err) {
      setError(err.response?.data?.msg || "❌ Kod doğrulama başarısız");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ 📧 Kod Tekrar Gönder ------------------ */
  const handleResend = async () => {
    setError("");
    const email = localStorage.getItem("pendingUserEmail");

    if (!email) {
      setError("❌ Email bulunamadı, lütfen tekrar kayıt olun.");
      return;
    }

    try {
      setResendLoading(true);
      const res = await api.post("/auth/resend-code", { email });
      alert(res.data.msg || "✅ Yeni doğrulama kodu gönderildi!");
    } catch (err) {
      setError(err.response?.data?.msg || "❌ Kod tekrar gönderilemedi");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="verify-page">
      <form className="verify-form" onSubmit={handleVerify}>
        <img src={logo} alt="FTSLine" className="logo bounce" />
        <h2>Email Doğrulama</h2>
        <p>Lütfen email adresinize gönderilen doğrulama kodunu giriniz.</p>

        <div className="form-group">
          <label>Doğrulama Kodu</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="6 haneli kod"
            maxLength={6}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn-verify" disabled={loading}>
          {loading ? "Doğrulanıyor..." : "Doğrula"}
        </button>

        <button
          type="button"
          className="btn-resend"
          onClick={handleResend}
          disabled={resendLoading}
        >
          {resendLoading ? "Gönderiliyor..." : "Kodu Tekrar Gönder"}
        </button>
      </form>
    </div>
  );
}
