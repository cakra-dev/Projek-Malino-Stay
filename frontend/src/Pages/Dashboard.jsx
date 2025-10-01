import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [statistik, setStatistik] = useState({});
  const [perTipe, setPerTipe] = useState([]);
  const [totalUser, setTotalUser] = useState(0);

  useEffect(() => {
    // Statistik penginapan
    axios.get("http://localhost:3001/penginapan/statistik")
      .then(res => setStatistik(res.data))
      .catch(err => console.error("❌ Error statistik:", err));

    // Data per-tipe untuk Pie Chart
    axios.get("http://localhost:3001/penginapan/per-tipe")
      .then(res => setPerTipe(res.data))
      .catch(err => console.error("❌ Error per-tipe:", err));

    // Statistik user
    axios.get("http://localhost:3001/users/statistik")
      .then(res => setTotalUser(res.data.total_user))
      .catch(err => console.error("❌ Error users:", err));
  }, []);

  // 🔹 Data untuk Pie Chart
  const chartData = {
    labels: perTipe.length > 0 
      ? perTipe.map(item => item.tipe_penginapan) 
      : ["Tidak ada data"],
    datasets: [
      {
        label: "Jumlah Penginapan",
        data: perTipe.length > 0 
          ? perTipe.map(item => item.total) 
          : [0],
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56",
          "#4BC0C0", "#9966FF", "#FF9F40", "#2ecc71"
        ],
        borderWidth: 1,
      }
    ]
  };

  return (
    <>
      <div className="d-flex">
        {/* Sidebar */}
        {isSidebarOpen && <Sidebar />}

        {/* Konten utama */}
        <div className="flex-grow-1">
          <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

          <div className="container mt-4 pb-5 px-4">
            <h2>Dashboard Penginapan</h2>

            {/* Cards Statistik */}
            <div className="row my-4 g-3">
              <div className="col-md-3">
                <div className="card text-center border-0 shadow-sm rounded-4 p-3 bg-primary text-white">
                  <h6 className="mb-2">Total Penginapan</h6>
                  <h3 className="fw-bold">{statistik.total_penginapan || 0}</h3>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card text-center border-0 shadow-sm rounded-4 p-3 bg-secondary text-white">
                  <h6 className="mb-2">Rata-rata Rating</h6>
                  <h3 className="fw-bold">{statistik.rata_rating || 0}</h3>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card text-center border-0 shadow-sm rounded-4 p-3 bg-success text-white">
                  <h6 className="mb-2">Rata-rata Harga</h6>
                  <h3 className="fw-bold">
                    Rp {statistik.rata_harga ? statistik.rata_harga.toLocaleString("id-ID") : 0}
                  </h3>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card text-center border-0 shadow-sm rounded-4 p-3 bg-danger text-white">
                  <h6 className="mb-2">Total User</h6>
                  <h3 className="fw-bold">{totalUser}</h3>
                </div>
              </div>
            </div>

            {/* 📈 Grafik Distribusi */}
            <div className="mt-5">
              <h4>Distribusi Penginapan per Tipe</h4>
              <div style={{ maxWidth: "500px", margin: "auto" }}>
                <Pie data={chartData} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Dashboard;
