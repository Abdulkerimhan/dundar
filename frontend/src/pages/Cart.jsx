import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);

    const savedUser = JSON.parse(localStorage.getItem("user")) || null;
    setUser(savedUser);
  }, []);

  const removeFromCart = (id) => {
    const updated = cartItems.filter((item) => item._id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const increaseQty = (id) => {
    const updated = cartItems.map((item) =>
      item._id === id ? { ...item, qty: item.qty + 1 } : item
    );
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const decreaseQty = (id) => {
    const updated = cartItems
      .map((item) =>
        item._id === id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
      .filter((item) => item.qty > 0);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Kullanıcı lisanslı mı?
  const isLicensed =
    user && user.isLicensed === true && user.isActive !== false;

  // Normal toplam
  const totalNormal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // İndirimli toplam
  const totalDiscounted = cartItems.reduce(
    (acc, item) =>
      acc +
      (item.discountPrice && item.discountPrice > 0
        ? item.discountPrice
        : item.price) *
        item.qty,
    0
  );

  const currency = cartItems.length > 0 ? cartItems[0].currency || "TRY" : "TRY";

  const formatPrice = (price) =>
    new Intl.NumberFormat(currency === "TRY" ? "tr-TR" : "en-US", {
      style: "currency",
      currency,
    }).format(price);

  const savings = totalNormal - totalDiscounted;

  return (
    <div className="cart-page container">
      <h2>🛒 Sepetim</h2>

      {cartItems.length === 0 ? (
        <p>Sepetiniz boş.</p>
      ) : (
        <div className="cart-list">
          {cartItems.map((item) => (
            <div className="cart-item" key={item._id}>
              <div className="item-info">
                <h3>{item.name}</h3>
                <p>
                  {formatPrice(item.price)} × {item.qty}
                </p>
              </div>

              {/* Adet kontrol */}
              <div className="qty-controls">
                <button onClick={() => decreaseQty(item._id)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => increaseQty(item._id)}>+</button>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="btn-remove"
              >
                ❌
              </button>
            </div>
          ))}

          {/* Sepet Özeti */}
          <div className="cart-summary">
            <h3>Normal Toplam: {formatPrice(totalNormal)}</h3>
            <h3>İndirimli Toplam: {formatPrice(totalDiscounted)}</h3>

            {!isLicensed && (
              <div className="license-info">
                <p>
                  🎟️ Lisanslı olsaydınız{" "}
                  <strong>{formatPrice(totalDiscounted)}</strong> ödeyecektiniz.
                </p>
                <p>
                  💡 Aradaki fark: <strong>{formatPrice(savings)}</strong>{" "}
                  kazancınız olurdu!
                </p>
                <button
                  className="btn-license"
                  onClick={() => navigate("/register?license=true")}
                >
                  🎟️ Hemen Lisans Satın Al
                </button>
              </div>
            )}

            <button className="btn-buy" onClick={() => navigate("/checkout")}>
              ✅ Satın Al
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
