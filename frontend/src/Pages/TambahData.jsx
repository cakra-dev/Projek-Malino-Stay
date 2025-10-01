import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function TambahData() {
  const [formData, setFormData] = useState({
    nama_penginapan: "",
    tipe_penginapan: "",
    rating: "",
    jumlah_review: "",
    harga: "",
    fasilitas: "",
    lokasi: "",
    deskripsi: "",
  });
  const [image, setImage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
    const [imagePreview, setImagePreview] = useState(null);

    const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
        setImagePreview(URL.createObjectURL(file)); // ✅ preview gambar
    }
    };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (image) {
        data.append("image", image);
      }

      await axios.post("http://localhost:3001/penginapan", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Data berhasil ditambahkan!");
      navigate("/penginapan");
    } catch (err) {
      console.error("Gagal tambah data:", err);
      alert("Terjadi kesalahan.");
    }
  };

  return (
    <>
      <div className="d-flex">
        {/* Sidebar */}
        {isSidebarOpen && <Sidebar />}

        {/* Konten utama */}
        <div className="flex-grow-1 d-flex flex-column min-vh-100">
          <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

          <main className="container mt-4 flex-grow-1">
            <h1 className="btn btn-light px-3" onClick={() => navigate("/penginapan")}>⬅ Kembali</h1>
            <div className="bg-white rounded shadow-sm p-4">
              <h2 className="fw-bold mb-4">Tambah Data Penginapan</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label>Nama Penginapan</label>
                  <input
                    type="text"
                    name="nama_penginapan"
                    className="form-control"
                    value={formData.nama_penginapan}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>Tipe Penginapan</label>
                  <input
                    type="text"
                    name="tipe_penginapan"
                    className="form-control"
                    value={formData.tipe_penginapan}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label>Rating</label>
                  <input
                    type="number"
                    name="rating"
                    className="form-control"
                    value={formData.rating}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    max="5"
                  />
                </div>

                <div className="mb-3">
                  <label>Jumlah Review</label>
                  <input
                    type="number"
                    name="jumlah_review"
                    className="form-control"
                    value={formData.jumlah_review}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label>Harga</label>
                  <input
                    type="number"
                    name="harga"
                    className="form-control"
                    value={formData.harga}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label>Fasilitas</label>
                  <input
                    type="text"
                    name="fasilitas"
                    className="form-control"
                    value={formData.fasilitas}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label>Lokasi</label>
                  <input
                    type="text"
                    name="lokasi"
                    className="form-control"
                    value={formData.lokasi}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label>Deskripsi</label>
                  <textarea
                    name="deskripsi"
                    className="form-control"
                    value={formData.deskripsi}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                    <label>Gambar</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={handleImage}
                        accept="image/*"
                    />
                    {imagePreview && (
                        <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ marginTop: "10px", width: "200px", borderRadius: "8px" }}
                        />
                    )}
                </div>


                <button type="submit" className="btn btn-success">
                  Simpan
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
     <Footer />
    </>
  );
}

export default TambahData;
