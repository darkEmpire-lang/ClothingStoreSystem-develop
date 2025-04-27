import React from "react";
import { Link } from "react-router-dom"; // For navigation between routes
import "bootstrap/dist/css/bootstrap.min.css";

function Header() {
  return (
    <div>
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-dark fixed-top"
        style={{ backgroundColor: "#1a1a1a", width: "100%", zIndex: "1030" }}
      >
        <div className="container-fluid">
          {/* Brand Name */}
          <Link
            className="navbar-brand text-light"
            to="/"
            style={{ fontWeight: "bold", fontSize: "24px" }}
          >
            Live Art Clothings
          </Link>

          {/* Hamburger menu for small screens */}
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
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/add-employee">
                  Join Us
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/view-salary">
                  View Salaries
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/all-reports">
                  View Reports
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/assign-salary">
                  Salary Management
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/add-report">
                  Report Analyze
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/inventory-management-Home"
                >
                  Inventory Management
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/all-employees">
                  View All Employees
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white" to="/admin-dashboard">
                  User management Dashboard
                </Link>
              </li>
            </ul>

            {/* Search Form */}
            <form className="d-flex">
              <input
                className="form-control me-2 bg-dark text-white border-light"
                type="search"
                placeholder="Search..."
                aria-label="Search"
              />
              <button className="btn btn-outline-light" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Adding padding to ensure content isn't hidden under the navbar */}
      <div style={{ paddingTop: "80px" }}>
      </div>
    </div>
  );
}

export default Header;
