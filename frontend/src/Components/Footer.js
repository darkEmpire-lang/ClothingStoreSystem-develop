import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import Header from "./Header";

function Footer() {
  return (
    <footer className="text-center text-white" style={{ backgroundColor: "#1e2125", paddingTop: "2rem" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        <div className="row">
          {/* About Section */}
          <div className="col-md-3 mb-4">
            <h5 className="text-uppercase mb-3 font-weight-bold">About Live Art</h5>
            <p className="text-muted" style={{ fontSize: "0.9rem" }}>
              Live Art empowers creativity, uniting artists to transform visions into reality. Join us in celebrating artistic expression.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="col-md-3 mb-4">
            <h5 className="text-uppercase mb-3 font-weight-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-muted text-decoration-none">Home</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Join Us</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Salary Management</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Report Analyze</a></li>
            </ul>
          </div>

          {/* Google Maps Section */}
          <div className="col-md-3 mb-4">
            <h5 className="text-uppercase mb-3 font-weight-bold">Visit Us</h5>
            <iframe
              title="Live Art Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.83543450923!2d144.95373631531787!3d-37.81627967975178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577ee2a8b9dc8f2!2sMelbourne%20CBD%2C%20VIC%203000%2C%20Australia!5e0!3m2!1sen!2sin!4v1614732163489!5m2!1sen!2sin"
              width="100%"
              height="150"
              style={{ border: "0", borderRadius: "10px" }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>

          {/* Newsletter Section */}
          <div className="col-md-3 mb-4">
            <h5 className="text-uppercase mb-3 font-weight-bold">Newsletter</h5>
            <p className="text-muted" style={{ fontSize: "0.9rem" }}>
              Stay updated with the latest news and special offers from Live Art.
            </p>
            <div className="input-group mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                aria-label="Subscriber's email"
              />
              <button className="btn btn-primary" type="button">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <hr style={{ borderTop: "1px solid rgba(255, 255, 255, 0.3)" }} />

        {/* Social Media Section with Animation */}
        <div className="d-flex justify-content-center mb-3">
          <a href="#" className="animated-icon me-3" style={{ fontSize: "1.6rem" }}>
            <FaFacebook />
          </a>
          <a href="#" className="animated-icon me-3" style={{ fontSize: "1.6rem" }}>
            <FaTwitter />
          </a>
          <a href="#" className="animated-icon me-3" style={{ fontSize: "1.6rem" }}>
            <FaInstagram />
          </a>
          <a href="#" className="animated-icon" style={{ fontSize: "1.6rem" }}>
            <FaLinkedin />
          </a>
        </div>

        <p className="text-center small mb-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.1)", padding: "0.5rem 0" }}>
          © 2025 Live Art Clothings | All Rights Reserved
        </p>
      </div>

      {/* Embedded CSS for Animation */}
      <style jsx>{`
        .animated-icon {
          color: white;
          transition: all 0.3s ease-in-out;
        }

        .animated-icon:hover {
          animation: rgbColorShift 2s infinite;
        }

        @keyframes rgbColorShift {
          0% {
            color: rgb(255, 0, 0); /* Red */
          }
          33% {
            color: rgb(0, 255, 0); /* Green */
          }
          66% {
            color: rgb(0, 0, 255); /* Blue */
          }
          100% {
            color: rgb(255, 0, 0); /* Back to Red */
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
