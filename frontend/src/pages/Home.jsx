import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaEye } from "react-icons/fa";
import api from "../api/axios";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("TRY");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Ürünler alınamadı:", err);
        setLoading(false);
      }
    };
    fetchProducts();

    // 🌍 Kullanıcı dili / lokasyona göre currency
    const userLang = navigator.language || navigator.userLanguage;
    if (userLang.startsWith("tr")) setCurrency("TRY");
    else setCurrency("USD");
  }, []);

  // 💰 Fiyat formatlama
  const formatPrice = (price) => {
    if (price == null) return "-";

    if (currency === "TRY") {
      return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
      }).format(price);
    } else {
      const usdt = (price / 30).toFixed(2);
      return `${usdt} USDT (${new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
      }).format(price)})`;
    }
  };

  // 🛒 Sepete ekleme
  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.find(
      (item) => item._id === product._id || item.id === product.id
    );

    if (exists) {
      exists.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    // 🔔 Navbar güncellensin
    window.dispatchEvent(new Event("storage"));
    alert(`${product.name} sepete eklendi!`);
  };

  // 📌 Filtrelenmiş ürünler
  const bestSellers = [...products].sort((a, b) => b.sold - a.sold).slice(0, 3);
  const mostViewed = [...products].sort((a, b) => b.views - a.views).slice(0, 3);
  const campaignProduct = products.find((p) => p.isCampaign);

  if (loading) return <p style={{ textAlign: "center" }}>⏳ Ürünler yükleniyor...</p>;

  return (
    <div className="home">
      {/* 📢 Reklam Alanı */}
      <div className="ad-banner">
        <div className="ad-track">
          <span>🚀 FTSLine ile Geleceğin Ticaretine Katılın!</span>
          <span>🌐 Global E-Ticaret + Network Marketing çalışma alanı</span>
          <span>🔒 Blockchain ile Güvenli Alışveriş</span>
          <span>🎉 Yeni Üyelik Kampanyası – Özel Fırsatlar!</span>
          <span>💎 Lisanslı Üyelere Özel Ekstra Fiyat Avantajı!</span>
          <span>📈 Kazançlı İş Ortaklığı Fırsatları</span>
          <span>🤝 Güçlü Topluluk Desteği</span>
          <span>🌟 Geleceğe Yön Ver!</span>
        </div>
      </div>

      {/* Hero */}
      <section className="hero">
        <h1>FTSLINE</h1>
        <h1>Network + E-Ticaret Hibrit Modeli</h1>
        <h2>ERKEN KALKAN DEĞİL ERKEN DİJİTALLEŞEN YOL ALIR.</h2>
        <p>Kazandıran sistem, global vizyon.</p>
        <button className="cta-btn" onClick={() => navigate("/register")}>
          Hemen Katıl
        </button>
      </section>

      {/* En Çok Satanlar */}
      <section className="showcase">
        <h2>🔥 En Çok Satanlar</h2>
        <div className="product-row">
          {bestSellers.map((p) => (
            <div key={p._id || p.id} className="product-mini">
              <img
                src={
                  p.images && p.images.length > 0
                    ? `http://localhost:5000${p.images[0]}`
                    : "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={p.name}
              />
              <h4>{p.name}</h4>
              <p className="price-normal">Normal Fiyat: {formatPrice(p.price)}</p>
              <p className="price-licensed">
                Lisanslı Üye: {formatPrice(p.discountPrice)}
              </p>
              <div className="product-actions">
                <button
                  onClick={() => navigate(`/product/${p._id || p.id}`, { state: p })}
                >
                  <FaEye /> İncele
                </button>
                <button onClick={() => addToCart(p)}>
                  <FaShoppingCart /> Sepete Ekle
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* En Çok Görüntülenenler */}
      <section className="showcase">
        <h2>👀 En Çok Görüntülenenler</h2>
        <div className="product-row">
          {mostViewed.map((p) => (
            <div key={p._id || p.id} className="product-mini">
              <img
                src={
                  p.images && p.images.length > 0
                    ? `http://localhost:5000${p.images[0]}`
                    : "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={p.name}
              />
              <h4>{p.name}</h4>
              <p className="price-normal">Normal Fiyat: {formatPrice(p.price)}</p>
              <p className="price-licensed">
                Lisanslı Üye: {formatPrice(p.discountPrice)}
              </p>
              <div className="product-actions">
                <button
                  onClick={() => navigate(`/product/${p._id || p.id}`, { state: p })}
                >
                  <FaEye /> İncele
                </button>
                <button onClick={() => addToCart(p)}>
                  <FaShoppingCart /> Sepete Ekle
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Kampanyalı Ürün */}
      {campaignProduct && (
        <section className="campaign">
          <h2>🎁 Ayın Kampanyalı Ürünü</h2>
          <div className="campaign-card">
            <img
              src={
                campaignProduct.images && campaignProduct.images.length > 0
                  ? `http://localhost:5000${campaignProduct.images[0]}`
                  : "https://via.placeholder.com/300x200?text=No+Image"
              }
              alt={campaignProduct.name}
            />
            <div>
              <h3>{campaignProduct.name}</h3>
              <p className="price-normal">
                Normal Fiyat: {formatPrice(campaignProduct.price)}
              </p>
              <p className="price-licensed">
                Lisanslı Üye: {formatPrice(campaignProduct.discountPrice)}
              </p>
              <div className="product-actions">
                <button
                  onClick={() =>
                    navigate(`/product/${campaignProduct._id || campaignProduct.id}`, {
                      state: campaignProduct,
                    })
                  }
                >
                  <FaEye /> İncele
                </button>
                <button onClick={() => addToCart(campaignProduct)}>
                  <FaShoppingCart /> Sepete Ekle
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
