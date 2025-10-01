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
  const [searchTerm, setSearchTerm] = useState(""); 
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

  // filter berdasarkan search
  const filteredPenginapan = penginapan.filter((item) =>
    item.nama_penginapan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <section className="container my-5">
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
                image={item.image ? `data:image/jpeg;base64,${item.image}` : gpenginapan}
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
