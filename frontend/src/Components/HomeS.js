import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";

function HomeS() {
  const navigate = useNavigate();

  return (
    <div style={styles.homeContainer}>
      <div style={styles.overlay}>
        <Nav />
        <h1 style={styles.mainHeading}> Hello Welcome!!</h1>
        <div style={styles.buttonContainer}>
          <button
            onClick={() => navigate("/supplier-register")}
            style={{ ...styles.button, ...styles.blueButton }}
            className="animated-button"
          >
            Register Supplier
          </button>
          <button
            onClick={() => navigate("/addproduct")}
            style={{ ...styles.button, ...styles.greenButton }}
            className="animated-button"
          >
            Add New Product
          </button>
          <button
            onClick={() => navigate("/addcategory")}
            style={{ ...styles.button, ...styles.purpleButton }}
            className="animated-button"
          >
            Add New Category
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeS;

// Embedded CSS with JavaScript Object styles
const styles = {
  homeContainer: {
    height: "100vh",
    backgroundImage: `url("/images/shoes.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  mainHeading: {
    color: "#fff",
    fontSize: "3.5rem",
    fontWeight: "bold",
    marginBottom: "30px",
    textAlign: "center",
    textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column", // Change to column to stack buttons
    gap: "20px",
    alignItems: "center", // Center align buttons
  },
  button: {
    padding: "15px 25px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.4s ease",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
    position: "relative",
    overflow: "hidden",
  },
  blueButton: {
    background: "linear-gradient(to right, #6a11cb, #2575fc)",
    color: "white",
  },
  greenButton: {
    background: "linear-gradient(to right, #11998e, #38ef7d)",
    color: "white",
  },
  purpleButton: {
    background: "linear-gradient(to right, #9c27b0, #e040fb)", // New purple button style
    color: "white",
  },
};

// Add custom animations with CSS (you can paste this into an external stylesheet or <style> tag)
const styleSheet = `
  .animated-button {
    position: relative;
    overflow: hidden;
  }

  .animated-button::before {
    content: "";
    position: absolute;
    top: -100%;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transform: skewX(-45deg);
    transition: all 0.5s ease;
  }

  .animated-button:hover::before {
    top: 0;
  }

  .animated-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  }

  .animated-button:active {
    transform: translateY(0);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  }
`;

// Dynamically inject styles into the DOM
const styleTag = document.createElement("style");
styleTag.innerHTML = styleSheet;
document.head.appendChild(styleTag);
