import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import api from "../api/axios";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { state } = useLocation();
  const { id } = useParams();
  const [product, setProduct] = useState(state || null);
  const [currency, setCurrency] = useState("TRY");
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    // 🌍 Kullanıcının diline göre para birimi
    const userLang = navigator.language || navigator.userLanguage;
    if (userLang.startsWith("tr")) setCurrency("TRY");
    else setCurrency("USD");

    // Eğer state yoksa backend’den çek
    if (!state && id) {
      const fetchProduct = async () => {
        try {
          const res = await api.get(`/products/${id}`);
          setProduct(res.data);
          if (res.data.images?.length > 0) {
            setMainImage(`http://localhost:5000${res.data.images[0]}`);
          }
        } catch (err) {
          console.error("Ürün alınamadı:", err);
        }
      };
      fetchProduct();
    } else if (state) {
      if (state.images?.length > 0) {
        setMainImage(`http://localhost:5000${state.images[0]}`);
      }
    }
  }, [id, state]);

  if (!product) return <p>Ürün bulunamadı</p>;

  // 💰 Fiyat formatlama
  const formatPrice = (price) => {
    if (price == null) return "-";

    if (currency === "TRY") {
      return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
      }).format(price);
    } else {
      const usdt = (price / 30).toFixed(2); // 1 USDT ≈ 30₺
      return `${usdt} USDT (${new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
      }).format(price)})`;
    }
  };

  // 🛒 Sepete ekleme
  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.find((item) => item._id === product._id);

    if (exists) {
      exists.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // ✅ Navbar’daki sepet sayısını güncelle
    document.dispatchEvent(new Event("cartUpdated"));

    alert(`${product.name} sepete eklendi!`);
  };

  return (
    <div className="product-detail container">
      {/* Sol taraf: görseller */}
      <div className="images">
        <img
          className="main-img"
          src={mainImage || "https://via.placeholder.com/400x300?text=No+Image"}
          alt={product.name}
        />

        {/* Küçük resimler */}
        {product.images && product.images.length > 1 && (
          <div className="thumbs">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={`http://localhost:5000${img}`}
                alt={`${product.name} ${i}`}
                onClick={() => setMainImage(`http://localhost:5000${img}`)}
                className={
                  mainImage === `http://localhost:5000${img}` ? "active" : ""
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Sağ taraf: bilgiler */}
      <div className="info">
        <h2>{product.name}</h2>
        <p className="desc">{product.description || "Açıklama mevcut değil."}</p>

        <div className="price-box">
          <p className="price normal">Normal Fiyat: {formatPrice(product.price)}</p>
          <p className="price licensed">
            Lisanslı Üye: {formatPrice(product.licensedPrice)}
          </p>
        </div>

        <button onClick={addToCart} className="btn-cart">
          🛒 Sepete Ekle
        </button>
      </div>
    </div>
  );
}
