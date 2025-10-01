import React, { useState } from "react";
import logo from "../assets/logo.png";
import bg from "../assets/background.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BsEnvelope } from "react-icons/bs";

function Register() {
  // state untuk menampung input dari user
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  
  const navigate = useNavigate();
  
  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/register", values);
      if (res.data.message === "Register Success") {
        alert("Registrasi berhasil, silakan login!");
        navigate("/");
      } else {
        alert("Registrasi gagal!!");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server!");
    }
  };

  return (
    
    <section
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="card shadow border-dark rounded-4 p-4" style={{ maxWidth: "400px", width: "100%", backgroundColor: "#EFE5D1" }}>
        <form onSubmit={handleSubmit}>
          {/* Logo */}
          <div className="text-center mb-3">
            <img
              src={logo}
              alt="Logo"
              className="mb-3"
              style={{ width: "75px", height: "75px" }}
            />
            <h2 className="fw-bold text-dark mb-0">Daftar Akun</h2>
            <h2 className="fw-bold" style={{ color: "#04712E" }}>
              Malino Stay
            </h2>
          </div>

          {/* Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Nama</label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                name="name"
                onChange={handleInput}
                className="form-control"
                placeholder="Masukkan nama"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <BsEnvelope />
              </span>
              <input
                type="email"
                name="email"
                onChange={handleInput}
                required
                className="form-control"
                placeholder="Masukkan email"

              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                name="password"
                onChange={handleInput}
                className="form-control"
                placeholder="Masukkan password"
                required
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="btn w-100 fw-semibold border-dark"
            style={{ backgroundColor: "#24BC5E", color: "#000" }}
          >
            Daftar
          </button>

          {/* Link ke login */}
          <div className="text-center mt-2">
            <p className="mb-0">
              Sudah punya akun?{" "}
              <a href="/" className="fw-bold text-dark text-decoration-none">
                Masuk
              </a>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Register;
