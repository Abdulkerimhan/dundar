import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import api from "../api/axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import countryList from "react-select-country-list";
import { Country, State, City } from "country-state-city";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [refLink, setRefLink] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [payments, setPayments] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [unilevelTree, setUnilevelTree] = useState([]);
  const [matrixTree, setMatrixTree] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setRefLink(`http://localhost:3000/register?ref=${storedUser.username}`);

      const userId = storedUser._id || storedUser.id;
      if (userId) {
        fetchPayments(userId);
        fetchEarnings(userId);
        fetchUnilevel(userId);
        fetchMatrix(userId);
      }

      fetchProducts();
    }
  }, []);

  const fetchPayments = async (userId) => {
    try {
      const res = await api.get(`/payment/history/${userId}`);
      setPayments(res.data);
    } catch (err) {
      console.error("Ödeme bilgileri alınamadı:", err);
    }
  };

  const fetchEarnings = async (userId) => {
    try {
      const res = await api.get(`/user/earnings/${userId}`);
      setEarnings(res.data);
    } catch (err) {
      console.error("Kazanç bilgileri alınamadı:", err);
    }
  };

  const fetchUnilevel = async (userId) => {
    try {
      const res = await api.get(`/tree/unilevel/${userId}`);
      setUnilevelTree(res.data);
    } catch (err) {
      console.error("Unilevel ağacı alınamadı:", err);
    }
  };

  const fetchMatrix = async (userId) => {
    try {
      const res = await api.get(`/tree/matrix/${userId}`);
      setMatrixTree(res.data);
    } catch (err) {
      console.error("Matrix ağacı alınamadı:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Ürünler alınamadı:", err);
    }
  };

  // ✅ Kariyer Rozeti
  const getCareerBadge = (career) => {
    switch (career?.toLowerCase()) {
      case "bronz":
        return <span className="badge bronze">🥉 Bronz</span>;
      case "gümüş":
        return <span className="badge silver">🥈 Gümüş</span>;
      case "altın":
        return <span className="badge gold">🥇 Altın</span>;
      case "platin":
        return <span className="badge platinum">💎 Platin</span>;
      case "elmas":
        return <span className="badge diamond">👑 Elmas</span>;
      default:
        return <span className="badge">Başlangıç</span>;
    }
  };

  if (!user) return <p>Yükleniyor...</p>;

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="user-box">
          <img
            src={user.avatar || "https://via.placeholder.com/60"}
            alt="Avatar"
            className="avatar"
          />
          <h2>{user.fullname}</h2>
          <p className="career">🏆 {getCareerBadge(user.career)}</p>
          <p className="wallet">💳 {user.usdtAddress || "—"}</p>
        </div>
        <nav>
          {[
            ["overview", "📊 Genel Bakış"],
            ["profile", "👤 Profilim"],
            ["products", "🛒 Ürünler"],
            ["orders", "📦 Alışveriş Geçmişim"],
            ["sponsor", "🤝 Benim Sponsor"],
            ["unilevel", "🌳 Ünilevel Ağacım"],
            ["matrix", "🔲 Matrix Ağacım"],
            ["earnings", "💰 Kazançlarım & Ödemelerim"],
            ["plan", "📑 Kazanç Planı"],
            ["faq", "❓ SSS"],
          ].map(([tab, label]) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* İçerik */}
      <main className="dashboard-content">
        {/* 📊 Genel Bakış */}
        {activeTab === "overview" && (
          <>
            <h2>Hoş geldin, {user.fullname} 👋</h2>
            <p className="ref-link">
              Referans Linkin: <a href={refLink}>{refLink}</a>
            </p>
            <div className="dashboard-grid">
              <div className="card users">
                <h3>👥 Takım</h3>
                <p>{user.teamCount || 0} kişi</p>
              </div>
              <div className="card earnings">
                <h3>💰 Kazanç</h3>
                <p>{user.earnings || 0} USDT</p>
              </div>
              <div className="card career">
                <h3>🏆 Kariyer</h3>
                <p>{getCareerBadge(user.career)}</p>
              </div>
            </div>
          </>
        )}

        {/* 👤 Profilim */}
        {activeTab === "profile" && (
          <div>
            <h2>👤 Profilim</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const res = await api.put(`/user/profile/${user.id}`, user);
                  localStorage.setItem("user", JSON.stringify(res.data.user));
                  setUser(res.data.user);
                  alert("✅ Profil güncellendi!");
                } catch (err) {
                  alert("❌ Profil güncellenemedi!");
                }
              }}
            >
              <label>Ad Soyad</label>
              <input
                type="text"
                value={user.fullname || ""}
                onChange={(e) => setUser({ ...user, fullname: e.target.value })}
              />

              <label>Doğum Tarihi</label>
              <input
                type="date"
                value={user.birthDate ? user.birthDate.substring(0, 10) : ""}
                onChange={(e) => setUser({ ...user, birthDate: e.target.value })}
              />

              <label>Email</label>
              <input
                type="email"
                value={user.email || ""}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />

              <label>Ülke</label>
              <Select
                options={countryList().getData()}
                value={
                  user.country ? { value: user.country, label: user.country } : null
                }
                onChange={(val) => setUser({ ...user, country: val.label })}
                placeholder="Ülke seçiniz"
              />

              <label>Eyalet / Bölge</label>
              <Select
                options={
                  user.country
                    ? State.getStatesOfCountry(
                        Country.getAllCountries().find(
                          (c) => c.name === user.country
                        )?.isoCode
                      ).map((s) => ({ value: s.name, label: s.name }))
                    : []
                }
                value={user.state ? { value: user.state, label: user.state } : null}
                onChange={(val) => setUser({ ...user, state: val.label })}
                placeholder="Eyalet / Bölge seçiniz"
              />

              <label>Şehir</label>
              <Select
                options={
                  user.country && user.state
                    ? City.getCitiesOfState(
                        Country.getAllCountries().find(
                          (c) => c.name === user.country
                        )?.isoCode,
                        State.getStatesOfCountry(
                          Country.getAllCountries().find(
                            (c) => c.name === user.country
                          )?.isoCode
                        ).find((s) => s.name === user.state)?.isoCode
                      ).map((city) => ({ value: city.name, label: city.name }))
                    : []
                }
                value={user.city ? { value: user.city, label: user.city } : null}
                onChange={(val) => setUser({ ...user, city: val.label })}
                placeholder="Şehir seçiniz"
              />

              <label>Adres</label>
              <input
                type="text"
                value={user.address || ""}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
              />

              <label>Telefon</label>
              <PhoneInput
                country={"tr"}
                value={user.phone || ""}
                onChange={(phone) => setUser({ ...user, phone })}
              />

              <label>USDT Adresi</label>
              <input
                type="text"
                value={user.usdtAddress || ""}
                onChange={(e) => setUser({ ...user, usdtAddress: e.target.value })}
              />

              <button type="submit" className="save-btn">
                Kaydet
              </button>
            </form>

            <h3>🔗 Referans Kodu</h3>
            <p>{user.referralCode}</p>

            <h3>🤝 Sponsor</h3>
            <p>{user.sponsor ? user.sponsor.username : "Sponsor bulunamadı"}</p>
          </div>
        )}

        {/* 🛒 Ürünler */}
        {activeTab === "products" && (
          <div>
            <h2>🛒 Satın Alınabilir Ürünler</h2>
            {products.length === 0 ? (
              <p>Henüz ürün yok.</p>
            ) : (
              <ul className="products-list">
                {products.map((p) => (
                  <li key={p._id}>
                    <strong>{p.name}</strong> – {p.price} USDT
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* 📦 Siparişler */}
        {activeTab === "orders" && <h2>📦 Alışveriş Geçmişin (yakında)</h2>}

        {/* 🤝 Sponsor */}
        {activeTab === "sponsor" && (
          <div>
            <h2>🤝 Benim Sponsor</h2>
            <p>{user.sponsor ? user.sponsor.username : "Sponsor bulunamadı"}</p>
          </div>
        )}

        {/* 🌳 Ünilevel */}
        {activeTab === "unilevel" && (
          <div>
            <h2>🌳 Ünilevel Ağacım</h2>
            {unilevelTree.length === 0 ? (
              <p>Henüz ekibin yok.</p>
            ) : (
              <Tree users={unilevelTree} />
            )}
          </div>
        )}

        {/* 🔲 Matrix */}
        {activeTab === "matrix" && (
          <div>
            <h2>🔲 Matrix Ağacım</h2>
            {matrixTree.length === 0 ? (
              <p>Henüz Matrix ekibin yok.</p>
            ) : (
              <Tree users={matrixTree} />
            )}
          </div>
        )}

        {/* 💰 Kazançlarım & Ödemelerim */}
        {activeTab === "earnings" && (
          <div>
            <h2>💰 Kazançlarım</h2>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>Miktar</th>
                  <th>Kaynak</th>
                </tr>
              </thead>
              <tbody>
                {earnings.length > 0 ? (
                  earnings.map((e, i) => (
                    <tr key={i}>
                      <td>{new Date(e.createdAt).toLocaleDateString()}</td>
                      <td>{e.amount} USDT</td>
                      <td>{e.source}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">Henüz kazanç yok</td>
                  </tr>
                )}
              </tbody>
            </table>

            <h2>📤 Ödemelerim</h2>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>Miktar</th>
                  <th>Tür</th>
                  <th>TX</th>
                </tr>
              </thead>
              <tbody>
                {payments.length > 0 ? (
                  payments.map((p, i) => (
                    <tr key={i}>
                      <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td>{p.amount} USDT</td>
                      <td>{p.type === "license" ? "🎫 Lisans" : "📅 Aylık"}</td>
                      <td>{p.txHash ? p.txHash.slice(0, 10) + "..." : "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">Henüz ödeme yapmadın</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

                {/* 📑 Kazanç Planı */}
        {activeTab === "plan" && (
          <div>
            <h2>📑 FTSLine Kazanç Planı</h2>
            <p>🚀 Network + E-Ticaret hibrit modeli ile güçlü ve şeffaf kazanç planı.</p>

            {/* İnsanlar Neden FTSLine? */}
            <section>
              <h3>🚀 İnsanlar Neden FTSLine’ı Tercih Etmeli?</h3>
              <ul>
                <li>Güçlü ve şeffaf kazanç planı (Ünilevel + Matris).</li>
                <li>Adil dağıtım ve kariyer basamakları.</li>
                <li>Düşük giriş bariyeri: 74.99 USDT lisans + 14.99 USDT aylık.</li>
                <li>Global uyum (Türkçe + İngilizce).</li>
                <li>Mobil & web uyumlu platform.</li>
                <li>Topluluk desteği, eğitim ve rehberlik.</li>
                <li></li>
              </ul>
            </section>

            {/* Çift Kazanç Modeli */}
            <section>
              <h3>🛍 Çift Kazanç Modeli: Network + E-Ticaret</h3>
              <li>Her satıştan %25 komisyon.</li>
              <li>Ürün fiyatı üzerinden lisanslı üyelere ekstra indirim.</li>
              <li>Global e-ticaret platformu.</li>
              <p>lisans alarak elde ettiğiniz franchise hakları ile kendi işinizi kurabilirsiniz.</p>
              <p>Ftsline ile anlaşma imzalatıp yaptığımız her Ürün satışlarından %25 net kar üzerinden komisyon alırsınız.</p>
              <p>Bu sayede, hem kendi işinizi kurabilir hem de pasif gelir elde edebilirsiniz.</p>
              <p>Sizin verdiğiniz franchise hakları ile kendi işinizi kurabilirsiniz.</p>
              <p>referans olduğunuz kişilerin ticaretinden de ünilevel matığı ile kazanç elde edebilirsiniz</p>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Ürün</th>
                    <th>Maliyet</th>
                    <th>Net Kâr</th>
                    <th>Getiren (%25)</th>
                    <th>Unilevel (%25)</th>
                    <th>Şirket (%50)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>100 USDT</td><td>60</td><td>40</td><td>10</td><td>10</td><td>20</td></tr>
                  <tr><td>200 USDT</td><td>120</td><td>80</td><td>20</td><td>20</td><td>40</td></tr>
                  <tr><td>500 USDT</td><td>300</td><td>200</td><td>50</td><td>50</td><td>100</td></tr>
                  <tr><td>1000 USDT</td><td>600</td><td>400</td><td>100</td><td>100</td><td>200</td></tr>
                </tbody>
              </table>
            </section>

            {/* Kariyer Sistemi */}
            <section>
              <h3>🏆 FTSLine Kariyer Sistemi</h3>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Kariyer</th>
                    <th>Şartlar</th>
                    <th>Kazanç Avantajı</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>🥉 Bronz</td><td>2 aktif direkt</td><td>13 derinlik bonusu, aylık 245.000 TL’ye kadar</td></tr>
                  <tr><td>🥈 Gümüş</td><td>10 direkt + 20 toplam üye veya 3 Bronz ekip</td><td>4 derinlik</td></tr>
                  <tr><td>🥇 Altın</td><td>30 direkt + 100 toplam üye veya 3 Gümüş ekip (max 30/koldan)</td><td>6 derinlik</td></tr>
                  <tr><td>💎 Platin</td><td>100 direkt + 500 toplam üye veya 3 Altın ekip (max 150/koldan)</td><td>8 derinlik</td></tr>
                  <tr><td>👑 Elmas</td><td>2400 toplam + 3 Platin direkt (max 600/koldan)</td><td>10 derinlik + Elmas havuzu</td></tr>
                  <tr><td>👑💠 Taç Elmas</td><td>50.000 toplam üye (max 10.000/koldan)</td><td>En yüksek kariyer & özel ayrıcalıklar</td></tr>
                </tbody>
              </table>
            </section>

            {/* Matrix Kuralları */}
            <section>
              <h3>🔲 Matrix Kuralları</h3>
              <ul>
                <li>Kullanıcı lisans aldıktan sonra matrixe girer.</li>
                <li>Matrix binary (2’li), soldan sağa doldurulur.</li>
                <li>Lisans ödemesiyle Matrix’te uygun boş kola yerleşir.</li>
                <li>2 ay pasif kalan kullanıcı Matrix’ten düşer.</li>
                <li>Tekrar aktif olursa → en sona eklenir.</li>
                <li>Boşalan slot → en güçlü aktif üyeye verilir (lisans sayısı + tarih).</li>
                <li>Her lisans ödemesinden %3 bonus (12 derinlik garanti).</li>
                <li>Bronz & Gümüş → 13. derinlik, Altın & Platin → 14, Elmas & Yönetim → 15 derinlik kazancı.</li>
              </ul>
            </section>

            {/* Havuz Bonusları */}
            <section>
              <h3>💎 Havuz Bonusları</h3>
              <ul>
                <li>Platin Havuzu: Şirket kârının %2’si → Platin üyeler arasında pay.</li>
                <li>Elmas Havuzu: Şirket kârının %10’u → Elmas üyeler arasında pay.</li>
                <li>Ekstra: Altın iken sözleşme imzalayan Elmaslara %10 özel havuz.</li>
              </ul>
            </section>

            {/* USDT Kuralları */}
            <section>
              <h3>💳 USDT (TRC20) Ödeme Kuralları</h3>
              <ul>
                <li>Tüm ödemeler USDT (TRC20) ile yapılır.</li>
                <li>Üye kaydı sonrası TRC20 adresi tanımlanmalıdır.</li>
                <li>Şirket ödemeleri bu adrese yapar. Yanlış adres sorumluluğu üyeye aittir.</li>
              </ul>
            </section>
          </div>
        )}

        {/* ❓ SSS */}
        {activeTab === "faq" && (
          <div>
            <h2>❓ Sık Sorulan Sorular</h2>
            <p>Yakında...</p>
          </div>
        )}
      </main>
    </div>
  );
}

/* Basit Ağaç Bileşeni */
function Tree({ users }) {
  return (
    <ul className="tree">
      {users.map((u) => (
        <li key={u._id}>
          <span>
            👤 {u.username} ({u.fullname || "—"})
          </span>
          {u.children && u.children.length > 0 && <Tree users={u.children} />}
        </li>
      ))}
    </ul>
  );
}
