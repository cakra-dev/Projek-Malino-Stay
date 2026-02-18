import React from "react";
import { useNavigate } from "react-router-dom";

function Header({ user, onToggleSidebar }) {
    const navigate = useNavigate();
    const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3 py-2">
      <button className="btn btn-dark px-3" onClick={onToggleSidebar}>
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="ms-auto d-flex align-items-center p-1">
        <span className="text-white me-2">
          Halo, <b>{user?.name || "Admin"}</b>
        </span>
            <button
              onClick={handleLogout}
              className="btn btn-dark btn-outline-light rounded-pill px-3"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Logout
            </button>
      </div>
    </nav>
  );
}

export default Header;
