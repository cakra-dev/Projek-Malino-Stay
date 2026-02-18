import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function TambahData() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama_penginapan: "",
    tipe_penginapan: "",
    rating: "",
    harga: "",
    fasilitas: "",
    lokasi: "",
    noTelp: "",
    deskripsi: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // cleanup objectURL preview
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    setImage(file || null);

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    if (file) setImagePreview(URL.createObjectURL(file));
    else setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi sederhana (samakan dengan EditData)
    const ratingNum = Number(formData.rating);
    const hargaNum = Number(formData.harga);

    if (ratingNum < 0 || ratingNum > 5) {
      alert("Rating harus antara 0 - 5");
      return;
    }
    if (hargaNum <= 0) {
      alert("Harga harus lebih dari 0");
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (image) data.append("image", image);

      await axios.post("http://localhost:3001/penginapan", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Data berhasil ditambahkan!");
      navigate("/penginapan");
    } catch (err) {
      console.error("Gagal tambah data!", err);
      alert("Terjadi kesalahan saat menambahkan data.");
    }
  };

  return (
    <>
      <div className="d-flex">
        {isSidebarOpen && <Sidebar />}

        <div className="flex-grow-1 d-flex flex-column min-vh-100">
          <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

          <main className="container mt-4 flex-grow-1">
            <button
              type="button"
              className="btn btn-light px-3 mb-3"
              onClick={() => navigate("/penginapan")}
            >
              ⬅ Kembali
            </button>

            <div className="bg-white rounded shadow-sm p-4">
              <h2 className="fw-bold mb-4">Tambah Data Penginapan</h2>

              <form onSubmit={handleSubmit}>
                {/* Nama */}
                <div className="mb-3">
                  <label className="form-label">Nama Penginapan</label>
                  <input
                    type="text"
                    name="nama_penginapan"
                    className="form-control"
                    value={formData.nama_penginapan}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Tipe */}
                <div className="mb-3">
                  <label className="form-label">Tipe Penginapan</label>
                  <input
                    type="text"
                    name="tipe_penginapan"
                    className="form-control"
                    value={formData.tipe_penginapan}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Rating */}
                <div className="mb-3">
                  <label className="form-label">Rating</label>
                  <input
                    type="number"
                    name="rating"
                    className="form-control"
                    value={formData.rating}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    max="5"
                    required
                  />
                </div>

                {/* Harga */}
                <div className="mb-3">
                  <label className="form-label">Harga (Rp)</label>
                  <input
                    type="number"
                    name="harga"
                    className="form-control"
                    value={formData.harga}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>

                {/* Fasilitas */}
                <div className="mb-3">
                  <label className="form-label">Fasilitas</label>
                  <input
                    type="text"
                    name="fasilitas"
                    className="form-control"
                    value={formData.fasilitas}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Lokasi */}
                <div className="mb-3">
                  <label className="form-label">Lokasi</label>
                  <input
                    type="text"
                    name="lokasi"
                    className="form-control"
                    value={formData.lokasi}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Nomor Telepon */}
                <div className="mb-3">
                  <label className="form-label">Nomor Telepon</label>
                  <input
                    type="text"
                    name="noTelp"
                    className="form-control"
                    value={formData.noTelp}
                    onChange={handleChange}
                    placeholder="628xxxxxxxxx"
                    required
                  />
                </div>

                {/* Deskripsi */}
                <div className="mb-3">
                  <label className="form-label">Deskripsi</label>
                  <textarea
                    name="deskripsi"
                    className="form-control"
                    rows="3"
                    value={formData.deskripsi}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {/* Gambar */}
                <div className="mb-3">
                  <label className="form-label">Gambar</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImage}
                    accept="image/*"
                    required
                  />
                </div>

                {/* Preview */}
                {imagePreview && (
                  <div className="mb-3">
                    <p className="mb-2">Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-thumbnail"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                )}

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
