import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Nav() {
  return (
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-dark fixed-top"
        style={{ backgroundColor: "#1a1a1a", zIndex: "1030" }}
      >
        <div className="container-fluid">
          <Link className="navbar-brand text-light mr-auto" to="/" style={{ fontWeight: "bold", fontSize: "24px" }}>
            Live Art Clothings
          </Link>

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
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/inventory-management-Home">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/stock">Stock</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/category">Categories</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/supplier">Suppliers</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/report">Report</Link>
              </li>
            </ul>

            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/notify" style={{ marginRight: "20px" }}>
                  Notification
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Add top padding to avoid content hiding under the navbar */}
      <div style={{ paddingTop: "70px" }}>
      </div>
    </div>
  );
}

export default Nav;
