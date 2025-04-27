import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavB from './NavBar';
import './Locations.css';
import pImage from '../assets/p.png';
import lImage from '../assets/l.png';
import logo from '../assets/logo.png';
import Swal from 'sweetalert2';

const Locations = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Sample location data
  const locations = [
    {
      id: 1,
      name: "Colombo",
      description: "Our flagship store in the heart of Colombo offers a premium shopping experience with the latest fashion trends. Visit us for exclusive collections and personalized styling services.",
      phone: "0110101012"
    },
    {
      id: 2,
      name: "Kandy",
      description: "Located in the cultural capital of Sri Lanka, our Kandy store brings fashion to the hill country. Discover our curated selection of traditional and modern clothing.",
      phone: "0110101012"
    },
    {
      id: 3,
      name: "Galle",
      description: "Our Galle store combines coastal charm with contemporary fashion. Experience our unique collection of beachwear and casual clothing in this historic setting.",
      phone: "0110101012"
    },
    {
      id: 4,
      name: "Jaffna",
      description: "Bringing fashion to the northern region, our Jaffna store offers a diverse range of clothing options. Visit us for traditional and modern fashion choices.",
      phone: "0110101012"
    },
    {
      id: 5,
      name: "Anuradhapura",
      description: "Our Anuradhapura store serves the ancient city with modern fashion. Explore our collection of comfortable and stylish clothing suitable for the region's climate.",
      phone: "0110101012"
    }
  ];

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    
    Swal.fire({
      title: location.name,
      html: `
        <div class="location-popup">
          <img src="${lImage}" alt="${location.name}" class="location-image" />
          <p class="location-description">${location.description}</p>
          <p class="location-phone">Contact: ${location.phone}</p>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        container: 'location-popup-container',
        popup: 'location-popup-content',
        closeButton: 'location-popup-close'
      }
    });
  };

  return (
    <div className="locations-page">
      <NavB />
      <div className="locations-container">
        <h2 className="locations-title">Our Locations</h2>
        
        <div className="locations-content">
          <div className="locations-map">
            <img src={pImage} alt="Locations Map" className="map-image" />
          </div>
          
          <div className="location-buttons">
            <h3>Locations Right Now</h3>
            {locations.map((location) => (
              <button
                key={location.id}
                className={`location-button ${selectedLocation?.id === location.id ? 'active' : ''}`}
                onClick={() => handleLocationClick(location)}
              >
                {location.name}
              </button>
            ))}
            
            <div className="branding-section">
              <img src={logo} alt="Live Art Logo" className="brand-logo" />
              <h4 className="brand-name">LIVE ART PVT LTD</h4>
              <p className="brand-slogan">Fashion for Every Style</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Locations; 