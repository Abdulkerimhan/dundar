import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios"; 
import "./Login.css";
import logo from "../assets/ftsline.png";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // 🔥 Backend'e istek
      const res = await api.post("/auth/login", { login, password });

      // localStorage’a kaydet
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      // 🎯 Rolüne göre yönlendir
      if (res.data.user.role === "admin") {
        navigate("/adminpanel");
      } else if (res.data.user.role === "superadmin") {
        navigate("/superadminpanel");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "❌ Geçersiz giriş bilgileri");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        {/* ✅ Üstte logo */}
        <img src={logo} alt="FTSLine" className="logo bounce" />
        <h2>Giriş Yap</h2>

        <div className="form-group">
          <label>Kullanıcı Adı veya E-mail</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Kullanıcı adı veya e-posta"
            required
          />
        </div>

        <div className="form-group">
          <label>Şifre</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi girin"
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        <div className="forgot">
          <Link to="/forgot-password">Şifremi Unuttum?</Link>
        </div>

        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>

        {/* ✅ Alt kısım */}
        <div className="login-footer">
          <p>
            Hesabınız yok mu?{" "}
            <Link to="/register">Kayıt Ol</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
