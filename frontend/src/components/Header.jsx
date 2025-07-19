import React from "react";
import { Link } from "react-router"; // ✅ Use 'react-router-dom' for routing

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
      <div className="container-fluid">
        <span className="navbar-brand text-danger fw-bold">🩸 BloodBridge</span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link fw-bold text-white" to="/home">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-bold text-white ms-3" to="/register">
                Become a Donor
              </Link>
            </li>
             <li className="nav-item">
              <Link className="nav-link fw-bold text-white ms-3" to="/find-donor">
                Find Donors
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-bold text-white ms-3" to="/login">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
