import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PenginapanCard from "./PenginapanCard";
import penginapan from "../assets/penginapan.jpg";

function RekomendasiPenginapan({ penginapanId }) {
  const [rekomendasi, setRekomendasi] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

useEffect(() => {
  if (!penginapanId || isNaN(Number(penginapanId))) return;

  const fetchRekomendasi = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/recommendations/${Number(penginapanId)}`
      );

      // 🔒 Ambil hanya array recommendations
      const recommendations = Array.isArray(res.data?.recommendations)
        ? res.data.recommendations
        : [];

      // mapping aman
      const mapped = recommendations.map((p) => ({
        ...p,
        isFavorite: false,
      }));

      setRekomendasi(mapped);
    } catch (err) {
      console.error("Gagal fetch rekomendasi:", err);
      setRekomendasi([]);
    }
  };

  fetchRekomendasi();
}, [penginapanId]);


  // 🔹 Handle klik favorite
  const handleFavorite = async (hotel) => {

    try {
      if (hotel.isFavorite) {
        // hapus dari favorit
        await axios.delete(
          `http://localhost:3001/favorite/${userId}/${hotel.id}`
        );
        setRekomendasi((prev) =>
          prev.map((p) =>
            p.id === hotel.id ? { ...p, isFavorite: false } : p
          )
        );
      } else {
        // tambah ke favorit
        await axios.post("http://localhost:3001/favorite", {
          user_id: userId,
          penginapan_id: hotel.id,
        });
        setRekomendasi((prev) =>
          prev.map((p) =>
            p.id === hotel.id ? { ...p, isFavorite: true } : p
          )
        );
      }
    } catch (err) {
      console.error("Gagal update favorit:", err);
      alert("Terjadi kesalahan saat menyimpan favorit.");
    }
  };

  return (
    <div className="mt-5">
      <h3 className="fw-bold mb-3">Rekomendasi Penginapan</h3>

      {rekomendasi.length === 0 ? (
        <p className="text-muted">Belum ada rekomendasi tersedia.</p>
      ) : (
        <div
          className="d-flex gap-3 overflow-auto pb-3"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {rekomendasi.map((item) => (
            <div
              key={item.id}
              style={{ minWidth: "370px", scrollSnapAlign: "start" }}
            >
              <PenginapanCard
                id={item.id}
                image={
                  item.image
                    ? `data:image/jpeg;base64,${item.image}`
                    : penginapan
                }
                name={item.nama_penginapan}
                rating={item.rating || 0}
                price={item.harga || 0}
                similarity={item.final_score} 
                isFavorite={item.isFavorite}
                onFavorite={() => handleFavorite(item)}
                onClick={() => navigate(`/detailpenginapan/${item.id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RekomendasiPenginapan;
