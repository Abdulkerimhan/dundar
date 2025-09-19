import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../api/axios";
import "./Register.css";
import logo from "../assets/ftsline.png";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [ref, setRef] = useState(""); // ✅ Ref kodu state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ URL’den ?ref= kodunu al
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refCode = params.get("ref");
    if (refCode) setRef(refCode);
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("❌ Şifreler eşleşmiyor!");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/register", {
        username: formData.username,
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword, // ✅ eklendi
        ref: ref || "", // ✅ Sponsor kodunu backend’e gönder (boşsa superadmin atanır)
      });

      // ✅ verify için userId ve email sakla
      localStorage.setItem("pendingUserId", res.data.userId);
      localStorage.setItem("pendingUserEmail", formData.email);

      alert(res.data.msg || "✅ Kayıt başarılı! Lütfen emailinizi doğrulayın.");
      navigate("/verify-email"); // 🚀 önce doğrulama sayfasına yönlendir
    } catch (err) {
      setError(err.response?.data?.msg || "❌ Kayıt başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <form className="register-form" onSubmit={handleSubmit}>
        <img src={logo} alt="FTSLine" className="logo bounce" />
        <h2>Kayıt Ol</h2>

        <div className="form-group">
          <label>Kullanıcı Adı</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Ad Soyad</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>E-mail</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Şifre</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Şifre Tekrar</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn-register" disabled={loading}>
          {loading ? "Kaydediliyor..." : "Kayıt Ol"}
        </button>

        <div className="register-footer">
          <p>
            Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
