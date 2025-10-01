import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PenginapanCard from "../components/PenginapanCard";
import gowa from "../assets/gowa.png"; 
import penginapan from "../assets/penginapan.jpg";
import { useNavigate } from "react-router-dom";

function Home() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [resHotels, resFavorites] = await Promise.all([
          axios.get("http://localhost:3001/penginapan"),
          userId ? axios.get(`http://localhost:3001/favorite/${userId}`) : Promise.resolve({ data: [] }),
        ]);

        const favIds = resFavorites.data.map((f) => f.id);
        const merged = resHotels.data.map((h) => ({
          ...h,
          isFavorite: favIds.includes(h.id),
        }));

        setHotels(merged.slice(0, 3)); // hanya ambil 3 untuk ditampilkan di Home
      } catch (err) {
        console.error("fetch home:", err);
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
        await axios.delete(`http://localhost:3001/favorite/${userId}/${hotel.id}`);
      } else {
        await axios.post("http://localhost:3001/favorite", {
          user_id: userId,
          penginapan_id: hotel.id,
        });
      }

      // update state supaya UI langsung berubah
      setHotels((prev) =>
        prev.map((h) =>
          h.id === hotel.id ? { ...h, isFavorite: !h.isFavorite } : h
        )
      );
    } catch (err) {
      console.error("handleFavorite home:", err);
      alert("Terjadi kesalahan saat menyimpan favorit.");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
      <section className="container my-5">
        <div className="row align-items-center">
          <div className="col-md-5 text-center mb-4 mb-md-0">
            <img
              src={gowa}
              alt="Logo Gowa"
              className="img-fluid"
              style={{ maxWidth: "220px" }}
            />
          </div>
          <div className="col-md-7">
            <p className="text-muted">Jelajahi</p>
            <h1 className="fw-bold text-dark mb-3">Pesona Malino</h1>
            <p className="text-secondary" style={{ lineHeight: "1.8" }}>
            Nikmati keindahan alam yang memukau di Malino, destinasi wisata andalan Kabupaten Gowa, Sulawesi Selatan. Terletak di dataran tinggi dengan udara sejuk dan segar, Malino menawarkan panorama hijau yang menenangkan jiwa. Jelajahi hamparan kebun teh yang luas, hutan pinus yang menawan, serta air terjun spektakuler seperti Air Terjun Takapala dan Air Terjun Lembanna. Malino tidak hanya menawarkan keindahan alam, tetapi juga berbagai pilihan penginapan yang nyaman dan ramah di kantong. Mulai dari villa dengan pemandangan pegunungan, hotel berbintang, hingga homestay tradisional dengan sentuhan budaya lokal. Ayo, rencanakan perjalanan Anda dan temukan keajaiban alam di Malino!
            </p>
          </div>
        </div>
      </section>

      {/* Rekomendasi */}
      <section className="container mb-5">
        <div className="p-4 border rounded-3">
          <h4 className="fw-bold">Top Rekomendasi</h4>
          <p className="text-secondary" style={{ fontSize: "14px" }}>
            Menampilkan penginapan terbaik berdasarkan rating, lokasi strategis
            dan fasilitas modern...
          </p>

          <div className="row g-3">
            {loading ? (
              <p>Loading...</p>
            ) : (
              hotels.map((hotel) => (
                <div key={hotel.id} className="col-md-4 d-flex justify-content-center">
                  <PenginapanCard
                    id={hotel.id}
                    image={hotel.image ? `data:image/jpeg;base64,${hotel.image}` : penginapan}
                    name={hotel.nama_penginapan}
                    rating={hotel.rating || 0}
                    price={hotel.harga || 0}
                    isFavorite={!!hotel.isFavorite}
                    onFavorite={() => handleFavorite(hotel)}
                    onClick={() => navigate(`/detailpenginapan/${hotel.id}`)}
                  />
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-4">
            <a href="/daftarpenginapan" className="btn btn-outline-dark px-4">
              Lihat Semua Penginapan →
            </a>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
