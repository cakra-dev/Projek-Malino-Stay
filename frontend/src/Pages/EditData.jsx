import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function EditData() {
  const { id } = useParams(); // ambil id dari URL
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

  const [image, setImage] = useState(null); // file baru
  const [preview, setPreview] = useState(null); // preview gambar lama/baru
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 🔹 Ambil data lama berdasarkan ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/penginapan/${id}`);
        const data = res.data;

        setFormData({
          nama_penginapan: data.nama_penginapan || "",
          tipe_penginapan: data.tipe_penginapan || "",
          rating: data.rating || "",
          harga: data.harga || "",
          fasilitas: data.fasilitas || "",
          lokasi: data.lokasi || "",
          noTelp: data.noTelp || "",
          deskripsi: data.deskripsi || "",
        });

        if (data.image) {
          setPreview(`data:image/jpeg;base64,${data.image}`);
        }
      } catch (err) {
        console.error("Gagal ambil data!", err);
        alert("Data tidak ditemukan.");
        navigate("/penginapan");
      }
    };

    fetchData();
  }, [id, navigate]);

  // 🔹 Input text/number/textarea
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Input file
  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file)); // preview gambar baru
    }
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi sederhana
    if (formData.rating < 0 || formData.rating > 5) {
      alert("Rating harus antara 0 - 5");
      return;
    }
    if (formData.harga <= 0) {
      alert("Harga harus lebih dari 0");
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (image) {
        data.append("image", image); // hanya kirim kalau ada gambar baru
      }

      await axios.put(`http://localhost:3001/penginapan/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Data berhasil diupdate!");
      navigate("/penginapan");
    } catch (err) {
      console.error("Gagal update data!", err);
      alert("Terjadi kesalahan saat update.");
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
          <button
            className="btn btn-light px-3 mb-3"
            onClick={() => navigate("/penginapan")}
          >
            ⬅ Kembali
          </button>

          <div className="bg-white rounded shadow-sm p-4">
            <h2 className="fw-bold mb-4">Edit Data Penginapan</h2>

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

              {/* noTelp */}
              <div className="mb-3">
                <label className="form-label">Nomor Telepon</label>
                <input
                  type="number"
                  name="noTelp"
                  className="form-control"
                  value={formData.noTelp}
                  onChange={handleChange}
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
                />
              </div>

              {/* Preview */}
              {preview && (
                <div className="mb-3">
                  <p>Preview:</p>
                  <img
                    src={preview}
                    alt="Preview"
                    className="img-thumbnail"
                    style={{ maxHeight: "200px" }}
                  />
                </div>
              )}

              <button type="submit" className="btn btn-success">
                Simpan Perubahan
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

export default EditData;
