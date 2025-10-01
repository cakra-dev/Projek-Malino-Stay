import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo1.png";


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleCloseMenu = () => setOpen(false);

  // Style inline untuk nav-link
  const navLinkStyle = ({ isActive }) => ({
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    position: "relative",
    color: isActive ? "#000000ff" : "#000",
    textDecoration: "none",
    paddingBottom: "4px",
    transition: "color 0.3s ease",
    borderBottom: isActive ? "2px solid #000000ff" : "2px solid transparent",
  });

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light sticky-top shadow-sm"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="container">
        {/* Logo */}
        <NavLink
          to="/home"
          className="navbar-brand d-flex align-items-center fw-bold text-success"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <img
            src={logo}
            alt="Logo Malino Stay"
            style={{ height: 32, marginRight: 8 }}
          />
          Malino Stay
        </NavLink>

        {/* Hamburger */}
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Menu */}
        <div
          className={`collapse navbar-collapse ${open ? "show" : ""} text-center`}
          id="navbarNav"
        >
          <ul className="navbar-nav mx-auto d-flex flex-column flex-lg-row align-items-center gap-3">
            <li className="nav-item">
              <NavLink to="/home" className="nav-link" style={navLinkStyle} onClick={handleCloseMenu}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/daftarpenginapan" className="nav-link" style={navLinkStyle} onClick={handleCloseMenu}>
                Penginapan
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/favorite" className="nav-link" style={navLinkStyle} onClick={handleCloseMenu}>
                Favorite
              </NavLink>
            </li>
          </ul>

          {/* Tombol Logout */}
          <div className="d-flex justify-content-center mt-3 mt-lg-0">
            <button
              onClick={handleLogout}
              className="btn btn-dark px-3"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
