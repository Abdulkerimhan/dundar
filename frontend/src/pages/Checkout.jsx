import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

export default function Checkout() {
  const [method, setMethod] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);

    const savedUser = JSON.parse(localStorage.getItem("user")) || null;
    setUser(savedUser);
  }, []);

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

  // Ödenecek tutar → kullanıcı lisanslı mı?
  const payableTotal = isLicensed ? totalDiscounted : totalNormal;

  const currency = cartItems.length > 0 ? cartItems[0].currency || "TRY" : "TRY";

  const formatPrice = (price) =>
    new Intl.NumberFormat(currency === "TRY" ? "tr-TR" : "en-US", {
      style: "currency",
      currency,
    }).format(price);

  const savings = totalNormal - totalDiscounted;

  // Seçilen ödeme yöntemi yazısı
  const paymentLabel =
    method === "bank"
      ? "🏦 Havale / EFT"
      : method === "usdt"
      ? "💰 USDT (Kripto)"
      : method === "card"
      ? "💳 Kredi Kartı"
      : "";

  return (
    <div className="checkout-page container">
      <h2>💳 Ödeme Sayfası</h2>
      <p>Lütfen bir ödeme yöntemi seçin:</p>

      {/* Ödeme seçenekleri */}
      <div className="payment-options">
        <label>
          <input
            type="radio"
            name="payment"
            value="bank"
            checked={method === "bank"}
            onChange={(e) => setMethod(e.target.value)}
          />
          🏦 Havale / EFT
        </label>

        <label>
          <input
            type="radio"
            name="payment"
            value="usdt"
            checked={method === "usdt"}
            onChange={(e) => setMethod(e.target.value)}
          />
          💰 USDT (Kripto)
        </label>

        <label>
          <input
            type="radio"
            name="payment"
            value="card"
            checked={method === "card"}
            onChange={(e) => setMethod(e.target.value)}
          />
          💳 Kredi Kartı
        </label>
      </div>

      {/* Ödeme Detayları */}
      <div className="payment-detail">
        {method === "bank" && (
          <div>
            <h3>🏦 Banka Transferi</h3>
            <p>Ödeme için aşağıdaki hesap numarasına havale/EFT yapabilirsiniz:</p>
            <p><strong>IBAN:</strong> TR12 3456 7890 1234 5678 0000 00</p>
            <p><strong>Banka:</strong> Ziraat Bankası</p>
          </div>
        )}

        {method === "usdt" && (
          <div>
            <h3>💰 USDT Ödemesi</h3>
            <p>USDT (TRC20) adresimiz:</p>
            <p><strong>Wallet:</strong> TQ12abcDEF345ghiJKL678mnopQR</p>
          </div>
        )}

        {method === "card" && (
          <div>
            <h3>💳 Kredi Kartı</h3>
            <form className="card-form">
              <input type="text" placeholder="Kart Üzerindeki İsim" required />
              <input type="text" placeholder="Kart Numarası" required />
              <div className="card-row">
                <input type="text" placeholder="AA/YY" required />
                <input type="text" placeholder="CVV" required />
              </div>
              <button type="submit" className="btn-pay">✅ Ödeme Yap</button>
            </form>
          </div>
        )}
      </div>

      {/* ✅ Ödeme Özeti */}
      {method && (
        <div className="payment-summary">
          <h3>🧾 Ödeme Özeti</h3>
          <p>Normal Toplam: <strong>{formatPrice(totalNormal)}</strong></p>
          <p>İndirimli Toplam: <strong>{formatPrice(totalDiscounted)}</strong></p>
          <h2>Ödenecek Tutar: <strong>{formatPrice(payableTotal)}</strong></h2>
          <p>Ödeme Yöntemi: <strong>{paymentLabel}</strong></p>

          {/* Lisans avantajı göster */}
          {!isLicensed && (
            <div className="license-info">
              <p>
                🎟️ Lisanslı olsaydınız{" "}
                <strong>{formatPrice(totalDiscounted)}</strong> ödeyecektiniz.
              </p>
              <p>
                💡 Aradaki fark: <strong>{formatPrice(savings)}</strong> tasarruf ederdiniz!
              </p>
              <button
                className="btn-license"
                onClick={() => navigate("/register?license=true")}
              >
                🎟️ Hemen Lisans Satın Al
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
