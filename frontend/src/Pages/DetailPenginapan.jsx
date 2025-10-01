import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart } from "react-icons/fa";
import penginapan from "../assets/penginapan.jpg";
import RekomendasiPenginapan from "../components/RekomendasiPenginapan";

function DetailPenginapan() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // 🔹 Fetch detail penginapan
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);

        // ambil detail hotel
        const res = await axios.get(`http://localhost:3001/penginapan/${id}`);
        setHotel(res.data);

        // cek apakah sudah favorit
        if (userId) {
          const resFav = await axios.get(
            `http://localhost:3001/favorite/${userId}`
          );
          const favIds = resFav.data.map((f) => f.id);
          setIsFavorite(favIds.includes(parseInt(id)));
        }
      } catch (err) {
        console.error("fetch detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id, userId]);

  // 🔹 Toggle favorite
  const handleFavorite = async () => {
    if (!userId) {
      alert("Silakan login untuk menyimpan favorit.");
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:3001/favorite/${userId}/${id}`);
        setIsFavorite(false);
      } else {
        await axios.post("http://localhost:3001/favorite", {
          user_id: userId,
          penginapan_id: id,
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("handleFavorite detail:", err);
      alert("Terjadi kesalahan saat menyimpan favorit.");
    }
  };

  // 🔹 Kondisi loading
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container text-center py-5">
          <p>Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  // 🔹 Kondisi tidak ada hotel
  if (!hotel) {
    return (
      <>
        <Navbar />
        <div className="container text-center py-5">
          <p>Penginapan tidak ditemukan.</p>
        </div>
        <Footer />
      </>
    );
  }

  // 🔹 Render utama
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
      <section className="container py-4">
        <button
          className="btn btn-light px-3 mb-4"
          onClick={() => navigate("/daftarpenginapan")}
        >
          ⬅ Kembali
        </button>

        <div className="row">
          {/* Gambar */}
          <div className="col-md-6 mb-4 ">
            <img
              src={
                hotel.image
                  ? `data:image/jpeg;base64,${hotel.image}`
                  : penginapan
              }
              alt={hotel.nama_penginapan}
              className="img-fluid rounded-4 shadow-sm"
            />
          </div>

          {/* Info */}
          <div className="col-md-6">
            <h2 className="fw-bold mb-3">{hotel.nama_penginapan}</h2>

            {/* Tipe Penginapan */}
            <span className="badge bg-info mb-3">{hotel.tipe_penginapan}</span>

            {/* Rating */}
            <div className="d-flex align-items-center mb-3">
              {[1, 2, 3, 4, 5].map((star) => {
                if (hotel.rating >= star) {
                  return <FaStar key={star} color="#ffc107" size={18} />;
                } else if (hotel.rating >= star - 0.5) {
                  return <FaStarHalfAlt key={star} color="#ffc107" size={18} />;
                } else {
                  return <FaRegStar key={star} color="#ffc107" size={18} />;
                }
              })}
              <span className="ms-2 text-muted">
                ({Number(hotel.rating || 0).toFixed(1)})
              </span>
            </div>
            
            {/* Fasilitas */}
            <tr className="fs-5"> 
                <td className="fw-bold pe-2">Fasilitas</td>
                <td className="pe-2">:</td>
                <td>{hotel.fasilitas}</td>
            </tr>

            {/* Harga */}
            <tr className="fs-5">
                <td className="fw-bold pe-2">Harga</td>
                <td className="pe-2">:</td>
                <td className="text-primary fw-bold">
                    Rp {Number(hotel.harga || 0).toLocaleString("id-ID")}
                </td>
            </tr>

            {/* Tombol aksi */}
            <div className="mt-4 d-flex gap-2">
              <button
                className={`btn ${
                  isFavorite ? "btn-danger" : "btn-outline-danger"
                }`}
                onClick={handleFavorite}
              >
                <FaHeart className="me-2" />
                {isFavorite ? "Hapus Favorit" : "Simpan Favorit"}
              </button>
            </div>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="row mt-4 py">
          <div className="col-12">
            <h3 className="fw-bold mb-3">Deskripsi</h3>
            <p className="text-secondary" style={{ lineHeight: "1.8" }}>
              {hotel.deskripsi || "Tidak ada deskripsi."}
            </p>
          </div>
        </div>

        {/* Rekomendasi Penginapan */}
        <RekomendasiPenginapan penginapanId={id} />

        {/* Lokasi / Google Maps */}
        <div className="row mt-4">
          <div className="col-12">
            <h3 className="fw-bold mb-3">Lokasi</h3>
            {hotel.lokasi ? (
              <div className="ratio ratio-21x9 rounded-4 shadow-sm">
                <iframe
                  src={hotel.lokasi}
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Penginapan"
                ></iframe>
              </div>
            ) : (
              <p className="text-muted">Lokasi belum tersedia</p>
            )}
          </div>
        </div>
          
      </section>
      </main>

      <Footer />
    </div>
  );
}

export default DetailPenginapan;
