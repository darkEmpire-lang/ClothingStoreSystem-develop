import React from "react";
import { useNavigate, Link } from 'react-router-dom';
import Footer from "./Footer";
import './HomeLiveArt.css';

// Import the single image
import kImage from '../assets/k.png';
// Import the logo
import logoImage from '../assets/logo.png';

const HomeLiveArt = () => {
  const navigate = useNavigate();
  
  const handleShopNow = () => {
    navigate('/productlist'); // Navigate to the product list page
  };

  return (
    <div className="home-live-art">
      <div className="hero-container">
        <div className="hero-image-container">
          <img 
            src={kImage} 
            alt="Live Art Fashion" 
            className="hero-image"
          />
          <div className="hero-overlay">
            <div className="login-icon-container">
              <Link to="/auth" className="login-icon-link">
                <div className="login-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </Link>
            </div>
            
            <div className="brand-logo-container">
              <img src={logoImage} alt="Live Art Logo" className="brand-logo" />
            </div>
            <h1 className="brand-name">LIVE ART</h1>
            <p className="brand-slogan">Express Yourself Through Fashion</p>
            <button className="shop-now-btn" onClick={handleShopNow}>
              Shop Now
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HomeLiveArt;
