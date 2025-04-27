import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Chatbot from "../UserManagement/Chatbot";

function Home() {
  const styles = {
    homeContainer: {
      position: "relative",
      height: "100vh",
      width: "100%",
      overflow: "hidden",
      backgroundImage: `url('/images/white.jpg')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      filter: "brightness(60%)",
    },
    overlayContent: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
      color: "white",
      padding: "20px",
      background: "rgba(0, 0, 0, 0.5)",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
    },
    mainTitle: {
      fontSize: "4rem",
      fontWeight: "bold",
      marginBottom: "10px",
      textShadow: "2px 2px 10px rgba(0, 0, 0, 0.7)",
    },
    subtitle: {
      fontSize: "1.5rem",
      marginBottom: "20px",
      textShadow: "1px 1px 5px rgba(0, 0, 0, 0.5)",
    },
    button: {
      padding: "12px 30px",
      fontSize: "1.2rem",
      borderRadius: "30px",
      backgroundColor: "#ffc107",
      color: "#2c2c2c",
      border: "none",
      cursor: "pointer",
      transition: "all 0.3s ease-in-out",
      boxShadow: "0 3px 8px rgba(0, 0, 0, 0.3)",
    },
    buttonHover: {
      backgroundColor: "#f8b700",
    },
  };

  return (
    <div>
      <Header />
      <div style={styles.homeContainer}>
        {/* Content Overlay */}
        <div style={styles.overlayContent}>
          <h1 style={styles.mainTitle}>Welcome to Live Art Clothings</h1>
          <p style={styles.subtitle}>
            Discover creativity, explore unique designs, and experience the power
            of art and fashion.
          </p>
          <button
            style={styles.button}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)
            }
            onMouseOut={(e) => (e.target.style.backgroundColor = "#ffc107")}
          >
            Explore Now
          </button>
        </div>
      </div>
      {/* Chatbot floats at bottom right */}
      <Chatbot />
      <Footer />
    </div>
  );
}

export default Home;
