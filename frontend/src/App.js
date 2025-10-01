import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import DetailPenginapan from "./Pages/DetailPenginapan";
import DaftarPenginapan from "./Pages/DaftarPenginapan";
import Favorite from "./Pages/Favorite";
import Dashboard from "./Pages/Dashboard";
import DataPenginapan from "./Pages/DataPenginapan";
import DataUser from "./Pages/DataUser";
import TambahData from "./Pages/TambahData";   
import EditData from "./Pages/EditData";   
import ProtectedRoute from "./components/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute role="user">
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/daftarpenginapan"
          element={
            <ProtectedRoute role="user">
              <DaftarPenginapan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/favorite"
          element={
            <ProtectedRoute role="user">
              <Favorite />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detailpenginapan/:id"
          element={
            <ProtectedRoute role="user">
              <DetailPenginapan />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/penginapan"
          element={
            <ProtectedRoute role="admin">
              <DataPenginapan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/penginapan/tambah"  
          element={
            <ProtectedRoute role="admin">
              <TambahData />
            </ProtectedRoute>
          }
        />

        <Route
          path="/penginapan/edit/:id"
          element={
            <ProtectedRoute role="admin">
              <EditData />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute role="admin">
              <DataUser />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
