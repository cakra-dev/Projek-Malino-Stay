import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function DataPenginapan() {
  const [penginapan, setPenginapan] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // 🔹 Ambil data dari backend
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3001/penginapan");
      setPenginapan(res.data);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Hapus data
  const handleDelete = async (id) => {
    if (window.confirm("Yakin mau hapus data ini?")) {
      try {
        await axios.delete(`http://localhost:3001/penginapan/${id}`);
        fetchData();
      } catch (err) {
        console.error("Gagal hapus data:", err);
      }
    }
  };

  // 🔹 Helper untuk potong teks
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <>
      <div className="d-flex">
        {/* Sidebar */}
        {isSidebarOpen && <Sidebar />}

        {/* Konten utama */}
        <div className="flex-grow-1 d-flex flex-column min-vh-100">
          <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

          <div className="container mt-4 flex-grow-1 px-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>Data Penginapan</h2>
              <button
                className="btn btn-primary px-3"
                onClick={() => navigate("/penginapan/tambah")}
              >
                + Tambah Data
              </button>
            </div>

            {/* Tabel Data */}
            <table className="table table-striped table-bordered shadow-sm">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Tipe</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Harga</th>
                  <th>Fasilitas</th>
                  <th>Lokasi</th>
                  <th>Deskripsi</th>
                  <th>Gambar</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {penginapan.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.nama_penginapan}</td>
                    <td>{item.tipe_penginapan}</td>
                    <td>{item.rating}</td>
                    <td>{item.jumlah_review}</td>
                    <td>Rp {item.harga.toLocaleString("id-ID")}</td>
                    <td>{item.fasilitas}</td>
                    {/* Lokasi & Deskripsi dipotong */}
                    <td title={item.lokasi}>{truncateText(item.lokasi, 30)}</td>
                    <td title={item.deskripsi}>{truncateText(item.deskripsi, 50)}</td>
                    <td>
                      {item.image ? (
                        <img
                          src={`data:image/jpeg;base64,${item.image}`}
                          alt={item.nama_penginapan}
                          width="100"
                          height="70"
                          style={{ objectFit: "cover", borderRadius: "5px" }}
                        />
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => navigate(`/penginapan/edit/${item.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DataPenginapan;
