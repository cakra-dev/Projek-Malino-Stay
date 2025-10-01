import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PenginapanCard from "../components/PenginapanCard";
import penginapan from "../assets/penginapan.jpg";

function Favorite() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3001/favorite/${userId}`);
        const mapped = res.data.map((p) => ({ ...p, isFavorite: true }));
        setFavorites(mapped);
      } catch (err) {
        console.error("fetchFavorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  const handleFavorite = async (hotel) => {
    if (!userId) {
      alert("Silakan login dulu.");
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/favorite/${userId}/${hotel.id}`);
      setFavorites((prev) => prev.filter((f) => f.id !== hotel.id));
    } catch (err) {
      console.error("hapus favorite:", err);
      alert("Gagal menghapus favorit.");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <section className="container my-5">
          <h2 className="fw-bold mb-4">Penginapan Favorit</h2>

          {loading ? (
            <p>Loading...</p>
          ) : favorites.length === 0 ? (
            <p className="text-muted">Belum ada penginapan favorit.</p>
          ) : (
            <div className="row g-4">
              {favorites.map((item) => (
                <div
                  key={item.id}
                  className="col-md-4 d-flex justify-content-center"
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
                    isFavorite={true}
                    onFavorite={() => handleFavorite(item)}
                    onClick={() => navigate(`/detailpenginapan/${item.id}`)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Favorite;
