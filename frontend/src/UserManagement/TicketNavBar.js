import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TicketNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Craftopia Ticket System
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            {user && (
              <>
                <Nav.Link as={Link} to="/my-tickets">My Tickets</Nav.Link>
                <Nav.Link as={Link} to="/raise-ticket">Raise Ticket</Nav.Link>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
              </>
            )}
            {user && user.email === "admin@admin.com" && (
              <Nav.Link as={Link} to="/admin">Admin Dashboard</Nav.Link>
            )}
          </Nav>
          <Nav>
            {user ? (
              <Nav.Link onClick={() => { logout(); navigate("/login"); }}>Logout</Nav.Link>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TicketNavbar;
