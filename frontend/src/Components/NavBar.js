import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { Dropdown, Nav, Navbar, Container } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <Navbar
        expand="lg"
        bg="dark"
        variant="dark"
        fixed="top"
        style={{ zIndex: "1030" }}
      >
        <Container fluid>
          <Navbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center"
            style={{ fontWeight: "bold", fontSize: "24px" }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{ height: "40px", marginRight: "10px" }}
            />
            Live Art Clothings
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="mx-auto" style={{ gap: "2rem" }}>
              <Nav.Link as={Link} to="/productlist">Products</Nav.Link>
              <Nav.Link as={Link} to="/order-status">Orders</Nav.Link>
              <Nav.Link as={Link} to="/locations">Locations</Nav.Link>
              <Nav.Link as={Link} to="/contact">Contact Us</Nav.Link>
              <Nav.Link as={Link} to="/ticket">Tickets</Nav.Link>
              <Nav.Link as={Link} to="/aboutus">About us</Nav.Link>
              <Nav.Link as={Link} to="/chat">Chat With us</Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              {!user ? (
                <Nav.Link
                  as={Link}
                  to="/auth"
                  className="d-flex align-items-center"
                  style={{ marginRight: "20px" }}
                >
                  <FaUserCircle style={{ marginRight: "6px" }} />
                  Login / Sign Up
                </Nav.Link>
              ) : (
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="link"
                    id="dropdown-user"
                    className="d-flex align-items-center text-white"
                    style={{ textDecoration: "none", boxShadow: "none" }}
                  >
                    <img
                      src={user.profilePic || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name) + "&background=222&color=fff"}
                      alt="avatar"
                      className="rounded-circle me-2"
                      style={{ width: "32px", height: "32px", objectFit: "cover", border: "2px solid #fff" }}
                    />
                    <span className="fw-bold">{user.name}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">My Profile</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/raise-ticket">Raise Ticket</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/my-tickets">My Tickets</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div style={{ paddingTop: "70px" }}></div>
    </>
  );
}

export default NavBar;
