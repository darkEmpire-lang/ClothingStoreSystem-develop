import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';
import NavBar from './NavBar';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4058/products/${productId}`);
        setProduct(response.data.product);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product details. Please try again later.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleSizeSelect = (e) => {
    setSelectedSize(e.target.value);
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert('Please select both color and size before adding to cart');
      return;
    }
    
    // Get existing cart from localStorage or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingProductIndex = existingCart.findIndex(item => item._id === product._id);
    
    if (existingProductIndex >= 0) {
      // Update quantity if product exists
      existingCart[existingProductIndex].quantity += 1;
    } else {
      // Add new product to cart
      existingCart.push({
        ...product,
        quantity: 1,
        selectedColor,
        selectedSize
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Show success message
    alert('Product added to cart!');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <NavBar />
        <div className="loading-message">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <NavBar />
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found-container">
        <NavBar />
        <div className="not-found-message">Product not found</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <NavBar />
      <div className="product-detail-container">
        <div className="product-image-section">
          <img 
            src={`http://localhost:4058/${product.imageUrl}`} 
            alt={product.name} 
            className="product-image"
          />
        </div>
        
        <div className="product-details-section">
          <h2>{product.name}</h2>
          <p className="product-price">Rs. {product.price}</p>
          <p className="product-description">{product.description}</p>
          <p className="product-category">Category: {product.category}</p>
          <p className="product-stock">In Stock: {product.stockQuantity}</p>
          <p className="product-sku">SKU: {product._id}</p>
          
          <div className="color-selection">
            <h3>Select Color</h3>
            <div className="color-options">
              {product.colors ? (
                product.colors.map((color) => (
                  <div
                    key={color}
                    className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                    title={color}
                  />
                ))
              ) : (
                <p>No color options available</p>
              )}
            </div>
            {selectedColor && (
              <p className="selected-color">Selected: {selectedColor}</p>
            )}
          </div>
          
          <div className="size-selection">
            <h3>Select Size</h3>
            <select 
              className="size-select"
              value={selectedSize}
              onChange={handleSizeSelect}
            >
              <option value="">Choose a size</option>
              {product.sizes ? (
                product.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))
              ) : (
                <>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                </>
              )}
            </select>
          </div>
          
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
          
          <div className="size-chart">
            <h3>Size Chart</h3>
            <table>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest (inches)</th>
                  <th>Waist (inches)</th>
                  <th>Hip (inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>S</td>
                  <td>36-38</td>
                  <td>28-30</td>
                  <td>36-38</td>
                </tr>
                <tr>
                  <td>M</td>
                  <td>38-40</td>
                  <td>30-32</td>
                  <td>38-40</td>
                </tr>
                <tr>
                  <td>L</td>
                  <td>40-42</td>
                  <td>32-34</td>
                  <td>40-42</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
