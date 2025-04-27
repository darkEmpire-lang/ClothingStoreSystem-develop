import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavB from './NavBar';
import './OrderStatus.css';
import Swal from 'sweetalert2';

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real application, you would fetch orders from an API
    // For now, we'll use localStorage to store and retrieve orders
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  // Calculate remaining time for delivery
  const calculateRemainingTime = (orderDate) => {
    const orderTime = new Date(orderDate).getTime();
    const currentTime = new Date().getTime();
    const elapsedHours = (currentTime - orderTime) / (1000 * 60 * 60);
    const remainingHours = 24 - elapsedHours;
    
    if (remainingHours <= 0) {
      return 'Delivered';
    }
    
    return `${Math.floor(remainingHours)} hours remaining`;
  };

  // Handle order removal
  const handleRemoveOrder = (orderId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Remove order from state and localStorage
        const updatedOrders = orders.filter(order => order.id !== orderId);
        setOrders(updatedOrders);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        
        Swal.fire(
          'Removed!',
          'Your order has been removed.',
          'success'
        );
      }
    });
  };

  // Handle order update
  const handleUpdateOrder = (order) => {
    // Navigate to payment page with order details
    navigate('/payment', {
      state: {
        totalAmount: order.totalAmount,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerMobile: order.customerMobile,
        customerAddress: order.location,
        deliveryMethod: order.deliveryMethod,
        isUpdate: true,
        orderId: order.id
      }
    });
  };

  return (
    <div className="order-status-page">
      <NavB />
      <div className="order-status-container">
        <h2 className="order-status-title">Order Status</h2>
        
        {orders.length === 0 ? (
          <div className="no-orders-message">
            <p>No orders found. Your orders will appear here once confirmed.</p>
            <button 
              className="back-to-home-btn"
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Location</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Delivery Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.id}</td>
                    <td>{order.customerName}</td>
                    <td>{order.location}</td>
                    <td>Rs. {order.totalAmount}</td>
                    <td>
                      <span className={`status-badge ${order.status === 'Active' ? 'active' : 'inactive'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{calculateRemainingTime(order.orderDate)}</td>
                    <td className="actions-column">
                      <button 
                        className="action-btn update-btn"
                        onClick={() => handleUpdateOrder(order)}
                      >
                        Update
                      </button>
                      <button 
                        className="action-btn remove-btn"
                        onClick={() => handleRemoveOrder(order.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatus; 