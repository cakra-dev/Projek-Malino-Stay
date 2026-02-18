import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PenginapanCard from "../components/PenginapanCard";
import gpenginapan from "../assets/penginapan.jpg";

function DaftarPenginapan() {
  const [penginapan, setPenginapan] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search nama penginapan
  const [searchTerm, setSearchTerm] = useState("");

  // ===== FILTER BAR =====
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortRating, setSortRating] = useState(""); // "" | "ASC" | "DESC"
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resPenginapan, resFavorites] = await Promise.all([
          axios.get("http://localhost:3001/penginapan"),
          userId
            ? axios.get(`http://localhost:3001/favorite/${userId}`)
            : Promise.resolve({ data: [] }),
        ]);

        const favIds = resFavorites.data.map((f) => f.id);
        const merged = resPenginapan.data.map((p) => ({
          ...p,
          isFavorite: favIds.includes(p.id),
        }));

        setPenginapan(merged);
      } catch (err) {
        console.error("fetch penginapan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleFavorite = async (hotel) => {
    if (!userId) {
      alert("Silakan login dulu untuk menyimpan favorit.");
      return;
    }

    try {
      if (hotel.isFavorite) {
        await axios.delete(
          `http://localhost:3001/favorite/${userId}/${hotel.id}`
        );
      } else {
        await axios.post("http://localhost:3001/favorite", {
          user_id: userId,
          penginapan_id: hotel.id,
        });
      }

      setPenginapan((prev) =>
        prev.map((p) =>
          p.id === hotel.id ? { ...p, isFavorite: !p.isFavorite } : p
        )
      );
    } catch (err) {
      console.error("handleFavorite:", err);
      alert("Terjadi kesalahan saat menyimpan favorit.");
    }
  };

  // ===== Helpers =====
  const toNumberOrNull = (val) => {
    if (val === "" || val === null || val === undefined) return null;
    const n = Number(val);
    return Number.isFinite(n) ? n : null;
  };

  // Kategori diambil dari tipe_penginapan
  const getCategory = (p) => (p.tipe_penginapan || "").toString().trim();

  // Normalisasi biar konsisten (hotel/villa/pondok/resort)
  const normalizeCategory = (val) => {
    const v = (val || "").toString().trim().toLowerCase();
    if (!v) return "";
    if (v.includes("hotel")) return "hotel";
    if (v.includes("villa")) return "villa";
    if (v.includes("pondok")) return "pondok";
    if (v.includes("resort")) return "resort";
    return v; // kalau ada tipe lain
  };

  // Opsi kategori FIX: Hotel, Villa, Pondok, Resort
  const categoryOptions = [
    { value: "ALL", label: "Semua Kategori" },
    { value: "hotel", label: "Hotel" },
    { value: "villa", label: "Villa" },
    { value: "pondok", label: "Pondok" },
    { value: "resort", label: "Resort" },
  ];

  const minN = toNumberOrNull(minPrice);
  const maxN = toNumberOrNull(maxPrice);

  // ===== FILTER + SORT =====
  let filteredPenginapan = penginapan
    // search nama
    .filter((item) =>
      (item.nama_penginapan || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    // kategori dari tipe_penginapan
    .filter((item) => {
      if (selectedCategory === "ALL") return true;
      return normalizeCategory(getCategory(item)) === selectedCategory;
    })
    // harga minimum
    .filter((item) => {
      if (minN === null) return true;
      const harga = Number(item.harga || 0);
      return harga >= minN;
    })
    // harga maksimum
    .filter((item) => {
      if (maxN === null) return true;
      const harga = Number(item.harga || 0);
      return harga <= maxN;
    });

  // sort rating
  if (sortRating === "DESC") {
    filteredPenginapan = [...filteredPenginapan].sort(
      (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
    );
  } else if (sortRating === "ASC") {
    filteredPenginapan = [...filteredPenginapan].sort(
      (a, b) => Number(a.rating || 0) - Number(b.rating || 0)
    );
  }

  return (
    <>
      <Navbar />

      <section className="container my-5">
        {/* ===== FILTER BAR ===== */}
        <div className="border rounded p-3 mb-4 bg-white">
          <div className="row g-3 align-items-end">
            {/* Kategori */}
            <div className="col-12 col-md">
              <label className="form-label">Kategori</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Urutkan berdasarkan rating */}
            <div className="col-12 col-md">
              <label className="form-label">Urutkan Berdasarkan Rating</label>
              <select
                className="form-select"
                value={sortRating}
                onChange={(e) => setSortRating(e.target.value)}
              >
                <option value="">Pilih</option>
                <option value="DESC">Tertinggi → Terendah</option>
                <option value="ASC">Terendah → Tertinggi</option>
              </select>
            </div>

            {/* Harga Minimum */}
            <div className="col-6 col-md">
              <label className="form-label">Harga Minimum</label>
              <input
                type="number"
                min="150000"
                max="5500000"
                className="form-control"
                placeholder="150000"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            {/* Harga Maksimum */}
            <div className="col-6 col-md">
              <label className="form-label">Harga Maksimum</label>
              <input
                type="number"
                min="150000"
                max="5500000"
                className="form-control"
                placeholder="5500000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-4">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Cari penginapan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <h2 className="fw-bold mb-4">Daftar Penginapan di Malino</h2>

        {loading ? (
          <p>Loading...</p>
        ) : filteredPenginapan.length === 0 ? (
          <p className="text-muted">Penginapan tidak ditemukan</p>
        ) : (
          <div className="row g-4">
            {filteredPenginapan.map((item) => (
              <div
                key={item.id}
                className="col-md-4 d-flex justify-content-center"
              >
                <PenginapanCard
                  id={item.id}
                  name={item.nama_penginapan || "Penginapan Tanpa Nama"}
                  image={
                    item.image
                      ? `data:image/jpeg;base64,${item.image}`
                      : gpenginapan
                  }
                  rating={item.rating || 0}
                  price={item.harga || 0}
                  isFavorite={!!item.isFavorite}
                  onFavorite={() => handleFavorite(item)}
                  onClick={() => navigate(`/detailpenginapan/${item.id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}

export default DaftarPenginapan;
