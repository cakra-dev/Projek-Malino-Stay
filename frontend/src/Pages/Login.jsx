import React, { useState } from "react";
import logo from "../assets/logo.png";
import bg from "../assets/background.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BsEnvelope, BsLock, BsEye, BsEyeSlash } from "react-icons/bs";

function Login() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // onInput sudah menangani setCustomValidity("") di input masing-masing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trigger validasi HTML5 manual (karena form pakai noValidate)
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity(); // memunculkan tooltip & memicu onInvalid
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/login", values);

      if (res.data.message === "Success") {
        localStorage.setItem("userId", res.data.id);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("name", res.data.name);

        if (res.data.role === "admin") navigate("/dashboard");
        else navigate("/home");
      } else {
        alert("Email atau password salah!");
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
      <div
        className="card shadow-lg border-0 rounded-4 p-4"
        style={{ maxWidth: "400px", width: "100%", backgroundColor: "#EFE5D1" }}
      >
        <form onSubmit={handleSubmit} noValidate>
          <div className="text-center mb-3">
            <img
              src={logo}
              alt="Logo"
              style={{ width: "75px", height: "75px" }}
            />
            <h2 className="fw-bold text-dark mt-3 mb-0">Welcome To</h2>
            <h2 className="fw-bold" style={{ color: "#04712E" }}>
              Malino Stay
            </h2>
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
                value={values.email}
                onChange={handleInput}
                className="form-control"
                placeholder="Masukkan email"
                required
                onInvalid={(e) => {
                  const v = e.target.validity;
                  if (v.valueMissing) {
                    e.target.setCustomValidity("Email wajib diisi");
                  } else if (v.typeMismatch) {
                    e.target.setCustomValidity("Format email tidak valid");
                  } else {
                    e.target.setCustomValidity("");
                  }
                }}
                onInput={(e) => e.target.setCustomValidity("")}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <BsLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={values.password}
                onChange={handleInput}
                className="form-control"
                placeholder="Masukkan password"
                required
                minLength={1}  
                onInvalid={(e) => {
                  const v = e.target.validity;
                  if (v.valueMissing) {
                    e.target.setCustomValidity("Password wajib diisi");
                  } else if (v.tooShort) {
                    e.target.setCustomValidity("Password minimal 6 karakter");
                  } else {
                    e.target.setCustomValidity("");
                  }
                }}
                onInput={(e) => e.target.setCustomValidity("")}
              />
              <span
                className="input-group-text bg-white"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword((p) => !p)}
                title={showPassword ? "Sembunyikan password" : "Lihat password"}
              >
                {showPassword ? <BsEyeSlash /> : <BsEye />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="btn w-100 fw-semibold border-dark"
            style={{ backgroundColor: "#24BC5E", color: "#000" }}
          >
            Login
          </button>

          <div className="text-center mt-3">
            <p className="mb-0">
              Belum punya akun?{" "}
              <a
                href="/register"
                className="fw-bold text-decoration-none text-dark"
              >
                Daftar
              </a>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;
