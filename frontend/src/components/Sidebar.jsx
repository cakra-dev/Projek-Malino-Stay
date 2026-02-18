import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BsGrid1X2Fill, BsHouseDoorFill, BsPeopleFill } from "react-icons/bs";
import logo from "../assets/logo1.png";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    
    <div className="d-flex flex-column p-2 bg-light text-white" style={{ height: "135vh", width: "250px" }}>    
    <NavLink
    to="/dashboard"
    className="navbar-brand d-flex align-items-center fw-bold text-success py-2 px-3 mb-4 "
    style={{ fontFamily: "'Poppins', sans-serif", fontSize: "20px" }}>
    <img src={logo} alt="Logo Malino Stay" style={{ height: 40, marginRight: 10 }}/>
    Malino Stay
    </NavLink>
      <ul className="nav nav-pills flex-column">
        <li className="nav-item mb-4">
          <Link to="/dashboard" className={`nav-link text-black ${isActive("/dashboard")}`}>
            <BsGrid1X2Fill className="me-2" /> Dashboard
          </Link>
        </li>
        <li>
            <Link to="/penginapan" className={`nav-link text-black ${isActive("/penginapan")}`}>
                <BsHouseDoorFill className="me-2" /> Data Penginapan
            </Link>
        </li>
        <li>
          <Link to="/users" className={`nav-link text-black ${isActive("/users")}`}>
            <BsPeopleFill className="me-2" /> Data User
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
