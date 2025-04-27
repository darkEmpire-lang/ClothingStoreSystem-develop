import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook

const Checkout = ({ checkoutProducts, handleRemoveFromCart, setCheckoutProducts, setFilters }) => {
  const navigate = useNavigate();  // Initialize navigate hook

  const calculateTotal = () => {
    return checkoutProducts.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Handle "Process to Payment" button click
  const handleProcessPayment = () => {
    // Navigate to the payment page with the total amount
    navigate('/payment', { state: { totalAmount: calculateTotal() } });
  };

  // Clear checkout and reset filters
  const handleClearCheckout = () => {
    setCheckoutProducts([]);  // Clear checkout products
    setFilters({ name: '', category: '', minPrice: '', maxPrice: '' });  // Reset filters
  };

  return (
    <div className="checkout-container">
      <h2>CHECKOUT</h2>
      <h3>Products:</h3>
      {checkoutProducts.length === 0 ? (
        <p>No items in your checkout.</p>
      ) : (
        <div className="checkout-products-list">
          {checkoutProducts.map((item, index) => (
            <div key={index} className="checkout-product-item">
              <h4>{item.name}</h4>
              <p>Category: {item.category}</p>
              <p>Price: Rs. {item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Total: Rs. {item.price * item.quantity}</p>
              <button className="remove-button" onClick={() => handleRemoveFromCart(item._id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
      <h3>Total: Rs. {calculateTotal()}</h3>

      <button className="process-payment-button" onClick={handleProcessPayment}>
        Process to Payment
      </button>

      <button className="clear-checkout-button" onClick={handleClearCheckout}>
        Clear Checkout
      </button>

      <style jsx>{`
        .checkout-container {
          font-family: Arial, sans-serif;
          background-color: white;
          padding: 20px;
          color: #333;
          width: 80%;
          margin: 0 auto;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
        }

        h2 {
          text-align: center;
          color: #333;
        }

        h3 {
          color: #333;
          margin-bottom: 10px;
        }

        .checkout-products-list {
          margin-top: 20px;
        }

        .checkout-product-item {
          background-color: #f8f8f8;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 8px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
          border: 1px solid #e0e0e0;
        }

        .checkout-product-item h4 {
          color: #333;
          font-size: 18px;
        }

        .checkout-product-item p {
          color: #666;
          margin: 5px 0;
        }

        .remove-button {
          background-color: #dc3545;
          color: #fff;
          border: none;
          padding: 8px 15px;
          cursor: pointer;
          border-radius: 5px;
          transition: background-color 0.3s;
        }

        .remove-button:hover {
          background-color: #c82333;
        }

        .process-payment-button, .clear-checkout-button {
          background-color: #333;
          color: #fff;
          border: none;
          padding: 10px 20px;
          cursor: pointer;
          border-radius: 5px;
          font-size: 16px;
          margin-top: 20px;
          display: block;
          width: 100%;
          text-align: center;
          transition: background-color 0.3s;
        }

        .process-payment-button:hover {
          background-color: #555;
        }

        .clear-checkout-button {
          background-color: #6c757d;
          margin-top: 10px;
        }

        .clear-checkout-button:hover {
          background-color: #5a6268;
        }

        .checkout-container p {
          color: #666;
          font-size: 14px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Checkout;
