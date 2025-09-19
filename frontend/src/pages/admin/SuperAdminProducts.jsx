import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import "./SuperAdmin.css";

export default function SuperAdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    discountPrice: "",
    discountPercent: "",
    stock: "",
    description: "",
    images: [],
  });

  // 📌 API URL
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Ürünleri API'den çek
  const fetchProducts = async () => {
    try {
      const res = await api.get("/superadmin/products");
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Ürünler alınamadı:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Dosya seçme
  const handleFileChange = (e) => {
    setNewProduct({ ...newProduct, images: e.target.files });
  };

  // Form gönderme (ekle veya güncelle)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(newProduct).forEach((key) => {
        if (key !== "images") formData.append(key, newProduct[key]);
      });
      for (let i = 0; i < newProduct.images.length; i++) {
        formData.append("images", newProduct.images[i]);
      }

      if (isEditing) {
        const res = await api.put(`/superadmin/products/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setProducts(
          products.map((p) => (p._id === editId ? res.data.product : p))
        );
        alert("✅ Ürün güncellendi!");
      } else {
        const res = await api.post("/superadmin/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setProducts([...products, res.data.product]);
        alert("✅ Ürün eklendi!");
      }

      setIsEditing(false);
      setEditId(null);
      setNewProduct({
        name: "",
        price: "",
        discountPrice: "",
        discountPercent: "",
        stock: "",
        description: "",
        images: [],
      });
    } catch (err) {
      console.error("Ürün ekleme/güncelleme hatası:", err);
    }
  };

  // Ürün Sil
  const handleDelete = async (id) => {
    if (!window.confirm("Bu ürünü silmek istediğine emin misin?")) return;
    try {
      await api.delete(`/superadmin/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Ürün silme hatası:", err);
    }
  };

  // Düzenleme başlat
  const handleEdit = (product) => {
    setIsEditing(true);
    setEditId(product._id);
    setNewProduct({
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      discountPercent: product.discountPercent,
      stock: product.stock,
      description: product.description,
      images: [],
    });
  };

  return (
    <div className="super-admin">
      <h1 className="title">🛒 Ürün Yönetimi</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="super-card">
        <h3>{isEditing ? "Ürün Güncelle" : "Yeni Ürün Ekle"}</h3>
        <input
          type="text"
          placeholder="Ürün adı"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Fiyat"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="İndirimli Fiyat (opsiyonel)"
          value={newProduct.discountPrice}
          onChange={(e) =>
            setNewProduct({ ...newProduct, discountPrice: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="% İndirim (opsiyonel)"
          value={newProduct.discountPercent}
          onChange={(e) =>
            setNewProduct({ ...newProduct, discountPercent: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Stok"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
          required
        />
        <textarea
          placeholder="Açıklama"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
        />

        <input type="file" multiple accept="image/*" onChange={handleFileChange} />

        <div className="form-buttons">
          <button type="submit" className="btn btn-success">
            {isEditing ? "Güncelle" : "Ekle"}
          </button>
          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsEditing(false);
                setEditId(null);
                setNewProduct({
                  name: "",
                  price: "",
                  discountPrice: "",
                  discountPercent: "",
                  stock: "",
                  description: "",
                  images: [],
                });
              }}
            >
              İptal
            </button>
          )}
        </div>
      </form>

      {/* Tablo */}
      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <table className="super-table">
          <thead>
            <tr>
              <th>Resimler</th>
              <th>Ürün Adı</th>
              <th>Fiyat</th>
              <th>İndirimli</th>
              <th>%</th>
              <th>Stok</th>
              <th>Açıklama</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="8">Henüz ürün yok.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id}>
                  <td>
                    {product.images?.length > 0 ? (
                      <div className="thumbs">
                        {product.images.map((img, i) => (
                          <img
                            key={i}
                            src={`${API_URL}${img}`}   // ✅ burada düzelttik
                            alt={product.name}
                            className="thumb"
                          />
                        ))}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>₺{product.price}</td>
                  <td>
                    {product.discountPrice > 0 ? `₺${product.discountPrice}` : "-"}
                  </td>
                  <td>
                    {product.discountPercent > 0
                      ? `%${product.discountPercent}`
                      : "-"}
                  </td>
                  <td>{product.stock}</td>
                  <td>{product.description}</td>
                  <td className="actions">
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEdit(product)}
                    >
                      Düzenle
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(product._id)}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
