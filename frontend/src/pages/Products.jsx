import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Products.css";

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currency, setCurrency] = useState("TRY");

  const [filter, setFilter] = useState({
    category: "Hepsi",
    maxPrice: 1000,
    licensedOnly: false,
    sortBy: "newest",
    search: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const [favorites, setFavorites] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const userLang = navigator.language || navigator.userLanguage;
    setCurrency(userLang.startsWith("tr") ? "TRY" : "USD");

    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");

        // İndirim yüzdesi hesapla
        const withDiscount = res.data.map((p) => {
          if (p.price && p.discountPrice) {
            p.discountPercent = Math.round(
              ((p.price - p.discountPrice) / p.price) * 100
            );
          } else {
            p.discountPercent = 0;
          }
          return p;
        });

        setProducts(withDiscount);
      } catch (err) {
        console.error("Ürünler alınamadı:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const savedFavs = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavs);
  }, []);

  const handleFilter = (e) => {
    const { name, value, type, checked } = e.target;
    setFilter({
      ...filter,
      [name]: type === "checkbox" ? checked : value,
    });
    setCurrentPage(1);
  };

  const formatPrice = (price) => {
    if (!price) return "-";
    return currency === "TRY"
      ? new Intl.NumberFormat("tr-TR", {
          style: "currency",
          currency: "TRY",
        }).format(price)
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price / 30);
  };

  let filteredProducts = products.filter((p) => {
    const categoryMatch =
      filter.category === "Hepsi" || p.category === filter.category;
    const priceMatch =
      (p.discountPrice && p.discountPrice <= filter.maxPrice) ||
      p.price <= filter.maxPrice;
    const licensedMatch =
      !filter.licensedOnly ||
      (filter.licensedOnly && p.discountPrice && p.discountPrice < p.price);
    const searchMatch =
      p.name.toLowerCase().includes(filter.search.toLowerCase()) ||
      p.description.toLowerCase().includes(filter.search.toLowerCase());
    return categoryMatch && priceMatch && licensedMatch && searchMatch;
  });

  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (filter.sortBy) {
      case "priceLow":
        return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      case "priceHigh":
        return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      case "discount":
        return b.discountPercent - a.discountPercent;
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // 🔹 Sepete ekleme
  const addToCart = (product, e) => {
    e.stopPropagation();
    const user = JSON.parse(localStorage.getItem("user"));
    const isLicensed = user?.isLicensed && user?.isActive;
    const isTurkey = (navigator.language || navigator.userLanguage).startsWith("tr");
    const finalPrice =
      isLicensed && product.discountPrice ? product.discountPrice : product.price;
    const chosenCurrency = isTurkey ? "TRY" : "USD";
    const displayPrice = isTurkey ? finalPrice : (finalPrice / 30).toFixed(2);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex((item) => item._id === product._id);

    if (index !== -1) {
      cart[index].qty += 1; // ✅ aynı ürün varsa qty artır
    } else {
      cart.push({
        ...product,
        qty: 1,
        finalPrice: displayPrice,
        currency: chosenCurrency,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // 🔔 Navbar’da cartCount güncellensin diye event tetikle
    window.dispatchEvent(new Event("storage"));

    alert(`${product.name} sepete eklendi!`);
  };

  const toggleFavorite = (product, e) => {
    e.stopPropagation();
    const exists = favorites.some((f) => f._id === product._id);
    const updatedFavs = exists
      ? favorites.filter((f) => f._id !== product._id)
      : [...favorites, product];

    setFavorites(updatedFavs);
    localStorage.setItem("favorites", JSON.stringify(updatedFavs));
    alert(
      `${product.name} ${
        exists ? "favorilerden çıkarıldı" : "favorilere eklendi"
      }`
    );
  };

  const isFavorite = (id) => favorites.some((f) => f._id === id);

  return (
    <div className="products-page">
      <h2>Ürünler</h2>

      {/* 🔎 Filtre Alanları */}
      <div className="filter-box">
        <label>
          Kategori:
          <select name="category" value={filter.category} onChange={handleFilter}>
            <option value="Hepsi">Hepsi</option>
            <option value="Hizmet">Hizmet</option>
            <option value="Eğitim">Eğitim</option>
            <option value="Donanım">Donanım</option>
            <option value="Özel">Özel</option>
          </select>
        </label>

        <label>
          Maks. Fiyat:
          <input
            type="number"
            name="maxPrice"
            value={filter.maxPrice}
            onChange={handleFilter}
          />
        </label>

        <label>
          <input
            type="checkbox"
            name="licensedOnly"
            checked={filter.licensedOnly}
            onChange={handleFilter}
          />{" "}
          Sadece lisanslı ürünler
        </label>

        <label>
          Ara:
          <input
            type="text"
            name="search"
            value={filter.search}
            onChange={handleFilter}
            placeholder="Ürün adı veya açıklama..."
          />
        </label>

        <label>
          Sırala:
          <select name="sortBy" value={filter.sortBy} onChange={handleFilter}>
            <option value="newest">🆕 Yeni Eklenenler</option>
            <option value="priceLow">⬇️ Fiyat (Artan)</option>
            <option value="priceHigh">⬆️ Fiyat (Azalan)</option>
            <option value="discount">🏷️ En Çok İndirim</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <>
          <div className="products-grid">
            {currentProducts.map((p) => {
              if (p._currentImage === undefined) p._currentImage = 0;

              return (
                <div
                  key={p._id}
                  className="product-card"
                  onClick={() => navigate(`/product/${p._id}`, { state: p })}
                >
                  <div className="image-container">
                    {p.discountPercent > 0 && (
                      <span className="discount-badge">-%{p.discountPercent}</span>
                    )}

                    {p.images && p.images.length > 0 ? (
                      <div className="mini-slider">
                        <img
                          src={`${API_URL}${p.images[p._currentImage]}`}
                          alt={p.name}
                          className="main-image"
                        />
                        {p.images.length > 1 && (
                          <div className="slider-buttons">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                p._currentImage =
                                  (p._currentImage - 1 + p.images.length) %
                                  p.images.length;
                                setProducts([...products]);
                              }}
                            >
                              ◀
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                p._currentImage =
                                  (p._currentImage + 1) % p.images.length;
                                setProducts([...products]);
                              }}
                            >
                              ▶
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <img
                        src="https://via.placeholder.com/300x200?text=No+Image"
                        alt={p.name}
                      />
                    )}

                    <button
                      className={`fav-btn ${isFavorite(p._id) ? "active" : ""}`}
                      onClick={(e) => toggleFavorite(p, e)}
                    >
                      {isFavorite(p._id) ? "❤️" : "🤍"}
                    </button>
                  </div>

                  <h3>{p.name}</h3>

                  <div className="price-box">
                    {p.discountPrice ? (
                      <>
                        <p className="price normal">Normal Fiyat: {formatPrice(p.price)}</p>
                        <p className="price licensed">
                          Lisanslı Üye: {formatPrice(p.discountPrice)}
                        </p>
                      </>
                    ) : (
                      <p className="price normal">Normal Fiyat: {formatPrice(p.price)}</p>
                    )}
                  </div>

                  <div className="actions">
                    <button onClick={(e) => addToCart(p, e)}>🛒 Sepete Ekle</button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${p._id}`, { state: p });
                      }}
                    >
                      🔎 Ürün İncele
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                ◀ Önceki
              </button>
              <span>
                Sayfa {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Sonraki ▶
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
