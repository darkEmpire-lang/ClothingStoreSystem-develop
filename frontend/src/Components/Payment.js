import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jsPDF } from "jspdf"; // Import jsPDF
import NavB from './NavBar';
import './Payment.css';
import Swal from 'sweetalert2'; // Import SweetAlert
import logo from '../assets/logo.png'; // Import logo from assets
import visaLogo from '../assets/v.png'; // Import Visa logo
import mastercardLogo from '../assets/m.png'; // Import Mastercard logo

const Payment = () => {
  const location = useLocation();
  const [totalAmount, setTotalAmount] = useState(location.state?.totalAmount || '');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showCardPopup, setShowCardPopup] = useState(false);
  const [showSlipPopup, setShowSlipPopup] = useState(false);
  const [cardType, setCardType] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [customerNIC, setCustomerNIC] = useState('');
  const [slipUpload, setSlipUpload] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Delivery options state
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);
  const [showHomeDeliveryPopup, setShowHomeDeliveryPopup] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [locationUrl, setLocationUrl] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [addressError, setAddressError] = useState('');

  const navigate = useNavigate();

  // List of banks for dropdown
  const banks = [
    "NSB Bank",
    "Commercial Bank",
    "BOC",
    "People's Bank",
    "HNB",
    "Other"
  ];

  // List of pickup locations
  const pickupLocations = [
    "Kalutara South",
    "Colombo 7",
    "Matara",
    "Rathnapura",
    "Nittabuwa",
    "Kandy",
    "Jafna",
    "Galle"
  ];

  // Format amount to always show two decimal places
  const formatAmount = (amount) => {
    if (!amount) return '';
    // Convert to number and format with 2 decimal places
    return parseFloat(amount).toFixed(2);
  };

  // Handle amount input
  const handleAmountChange = (e) => {
    setTotalAmount(e.target.value);
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method === 'Card') {
      setShowCardPopup(true);
    } else if (method === 'Online Slip') {
      setShowSlipPopup(true);
    }
  };

  // Handle delivery method change
  const handleDeliveryMethodChange = (method) => {
    setDeliveryMethod(method);
    if (method === 'Pickup') {
      setShowDeliveryPopup(true);
    } else if (method === 'Home Delivery') {
      setShowHomeDeliveryPopup(true);
    }
  };

  // Handle card type selection
  const handleCardTypeSelect = (type) => {
    setCardType(type);
  };

  // Handle bank selection
  const handleBankChange = (e) => {
    setSelectedBank(e.target.value);
  };

  // Handle pickup location selection
  const handlePickupLocationChange = (e) => {
    setPickupLocation(e.target.value);
    setLocationError('');
  };

  // Handle NIC input
  const handleNICChange = (e) => {
    setCustomerNIC(e.target.value);
  };

  // Handle customer name input with validation
  const handleCustomerNameChange = (e) => {
    const name = e.target.value;
    setCustomerName(name);
    
    // Validate name (no special characters)
    const nameRegex = /^[a-zA-Z\s]*$/;
    if (!nameRegex.test(name) && name !== '') {
      setNameError('Name cannot contain special characters');
    } else {
      setNameError('');
    }
  };

  // Handle customer email input with validation
  const handleCustomerEmailChange = (e) => {
    const email = e.target.value;
    setCustomerEmail(email);
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) && email !== '') {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  // Handle customer mobile input with validation
  const handleCustomerMobileChange = (e) => {
    const mobile = e.target.value;
    setCustomerMobile(mobile);
    
    // Validate mobile (10 digits)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile) && mobile !== '') {
      setMobileError('Please enter a valid 10-digit mobile number');
    } else {
      setMobileError('');
    }
  };

  // Handle file upload for online slip
  const handleSlipUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2MB limit. Please upload a smaller file.");
        e.target.value = null;
        return;
      }
      setSlipUpload(file);
    }
  };

  // Show verification popup
  const showVerificationPopup = () => {
    setIsVerifying(true);
    Swal.fire({
      title: 'Verifying...',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <img src="${logo}" alt="Logo" style="width: 100px; margin-bottom: 20px;">
          <div class="loader"></div>
        </div>
      `,
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        // Simulate verification process
        setTimeout(() => {
          Swal.close();
          showSuccessMessage();
        }, 2000);
      }
    });
  };

  // Show success message
  const showSuccessMessage = () => {
    Swal.fire({
      title: 'Successfully created an order',
      text: 'Your order has been processed successfully!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'See Current Status',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#007bff'
    }).then((result) => {
      if (result.isDismissed) {
        // Navigate to order status page
        navigate('/order-status');
      }
    });
  };

  // Handle card form submission
  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (cardNumber && cardName && expiryDate && cvv) {
      setShowCardPopup(false);
      showVerificationPopup();
    }
  };

  // Handle slip form submission
  const handleSlipSubmit = (e) => {
    e.preventDefault();
    if (selectedBank && customerNIC && slipUpload) {
      setShowSlipPopup(false);
      showVerificationPopup();
    }
  };

  // Handle customer address input
  const handleCustomerAddressChange = (e) => {
    setCustomerAddress(e.target.value);
    setAddressError('');
  };

  // Handle location URL input
  const handleLocationUrlChange = (e) => {
    setLocationUrl(e.target.value);
  };

  // Show location not available popup
  const showLocationNotAvailablePopup = () => {
    Swal.fire({
      title: 'Service Not Available',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <img src="${logo}" alt="Logo" style="width: 100px; margin-bottom: 20px;">
          <p>Oops! We are still not available this service right now.</p>
          <p>Please enter your location URL instead.</p>
        </div>
      `,
      confirmButtonText: 'OK',
      confirmButtonColor: '#28a745'
    });
  };

  // Handle home delivery form submission
  const handleHomeDeliverySubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    
    if (!customerName) {
      setNameError('Please enter your name');
      isValid = false;
    } else if (nameError) {
      isValid = false;
    }
    
    if (!customerEmail) {
      setEmailError('Please enter your email');
      isValid = false;
    } else if (emailError) {
      isValid = false;
    }
    
    if (!customerMobile) {
      setMobileError('Please enter your mobile number');
      isValid = false;
    } else if (mobileError) {
      isValid = false;
    }
    
    if (!customerAddress) {
      setAddressError('Please enter your address');
      isValid = false;
    }
    
    if (isValid) {
      setShowHomeDeliveryPopup(false);
    }
  };

  // Handle home delivery form clear
  const handleHomeDeliveryClear = () => {
    setCustomerName('');
    setCustomerEmail('');
    setCustomerMobile('');
    setCustomerAddress('');
    setLocationUrl('');
    setNameError('');
    setEmailError('');
    setMobileError('');
    setAddressError('');
  };

  // Generate home delivery PDF
  const generateHomeDeliveryPDF = () => {
    if (!customerName || !customerEmail || !customerMobile || !customerAddress) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill in all delivery details before downloading',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    const doc = new jsPDF();
    
    // Add black border around the page
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 277);
    
    // Add company name
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text("LIVE ART PVT LTD", 20, 25);
    
    // Add invoice title
    doc.setFontSize(16);
    doc.text("DELIVERY INVOICE", 20, 45);
    
    // Add Date and Time
    const date = new Date();
    const formattedDate = date.toLocaleString();
    doc.setFontSize(10);
    doc.text(`Date: ${formattedDate}`, 20, 55);
    
    // Add Invoice Number (random for demo)
    const invoiceNumber = "INV-" + Math.floor(100000 + Math.random() * 900000);
    doc.text(`Invoice #: ${invoiceNumber}`, 150, 55);
    
    // Add horizontal line
    doc.setLineWidth(0.2);
    doc.line(20, 60, 190, 60);
    
    // PERSONAL DETAILS SECTION
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text("PERSONAL DETAILS", 20, 75);
    
    // Reset font
    doc.setFont(undefined, 'normal');
    
    // Create personal details table
    const personalDetails = [
      ["Name:", customerName || "N/A"],
      ["Email:", customerEmail || "N/A"],
      ["Phone:", customerMobile || "N/A"],
      ["Address:", customerAddress || "N/A"]
    ];
    
    if (locationUrl) {
      personalDetails.push(["Location URL:", locationUrl]);
    }
    
    let yPos = 85;
    personalDetails.forEach(row => {
      doc.setFont(undefined, 'bold');
      doc.text(row[0], 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(row[1], 60, yPos);
      yPos += 10;
    });
    
    // Add horizontal line
    doc.setLineWidth(0.2);
    doc.line(20, yPos + 5, 190, yPos + 5);
    
    // DELIVERY INFORMATION SECTION
    yPos += 15;
    doc.setFont(undefined, 'bold');
    doc.text("DELIVERY INFORMATION", 20, yPos);
    
    // Reset font
    doc.setFont(undefined, 'normal');
    
    // Create delivery details table
    yPos += 10;
    doc.setFont(undefined, 'bold');
    doc.text("Delivery Method:", 20, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(deliveryMethod, 60, yPos);
    
    // Add horizontal line
    doc.setLineWidth(0.2);
    doc.line(20, yPos + 5, 190, yPos + 5);
    
    // Add footer
    yPos += 20;
    doc.setFontSize(10);
    doc.text("Thank you for your business!", 20, yPos);
    doc.text("For any queries, please contact our customer service.", 20, yPos + 10);
    
    // Add signature line
    yPos += 30;
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 80, yPos);
    doc.text("Customer Signature", 20, yPos + 5);
    
    // Save the PDF
    doc.save('home_delivery_invoice.pdf');
  };

  // Handle Confirm button click
  const handleConfirm = () => {
    // Simple validation: Ensure total amount is a number
    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      setIsValid(false);
      return;
    }
    
    // Validate delivery method if selected
    if (deliveryMethod === 'Pickup' && (!pickupLocation || !customerName || !customerEmail || !customerMobile)) {
      setShowDeliveryPopup(true);
      return;
    }
    
    if (deliveryMethod === 'Home Delivery' && (!customerName || !customerEmail || !customerMobile || !customerAddress)) {
      setShowHomeDeliveryPopup(true);
      return;
    }

    // Create PDF after validation
    const doc = new jsPDF();
    
    // Add black border around the page
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 277);
    
    // Add company name and header
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text("LIVE ART PVT LTD", 105, 25, { align: 'center' });
    
    // Add invoice title
    doc.setFontSize(16);
    doc.text("INVOICE", 20, 45);
    
    // Add Date and Time
    const date = new Date();
    const formattedDate = date.toLocaleString();
    doc.setFontSize(10);
    doc.text(`Date: ${formattedDate}`, 20, 55);
    
    // Add Invoice Number (random for demo)
    const invoiceNumber = "INV-" + Math.floor(100000 + Math.random() * 900000);
    doc.text(`Invoice #: ${invoiceNumber}`, 150, 55);
    
    // Add horizontal line
    doc.setLineWidth(0.2);
    doc.line(20, 60, 190, 60);
    
    // PERSONAL DETAILS SECTION
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text("PERSONAL DETAILS", 20, 75);
    
    // Reset font
    doc.setFont(undefined, 'normal');
    
    // Create personal details table
    const personalDetails = [
      ["Name:", customerName || "N/A"],
      ["Email:", customerEmail || "N/A"],
      ["Phone:", customerMobile || "N/A"]
    ];
    
    if (deliveryMethod === 'Home Delivery') {
      personalDetails.push(["Address:", customerAddress || "N/A"]);
      if (locationUrl) {
        personalDetails.push(["Location URL:", locationUrl]);
      }
    } else if (deliveryMethod === 'Pickup') {
      personalDetails.push(["Pickup Location:", pickupLocation || "N/A"]);
    }
    
    let yPos = 85;
    personalDetails.forEach(row => {
      doc.setFont(undefined, 'bold');
      doc.text(row[0], 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(row[1], 60, yPos);
      yPos += 10;
    });
    
    // Add horizontal line
    doc.setLineWidth(0.2);
    doc.line(20, yPos + 5, 190, yPos + 5);
    
    // BILLING INFORMATION SECTION
    yPos += 15;
    doc.setFont(undefined, 'bold');
    doc.text("BILLING INFORMATION", 20, yPos);
    
    // Reset font
    doc.setFont(undefined, 'normal');
    
    // Calculate VAT and discount
    const subtotal = parseFloat(totalAmount);
    const vatRate = 0.15; // 15% VAT
    const vatAmount = subtotal * vatRate;
    const discount = 0; // No discount for now
    const total = subtotal + vatAmount - discount;
    
    // Create billing table
    yPos += 10;
    doc.setFont(undefined, 'bold');
    doc.text("Subtotal:", 120, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(`Rs. ${subtotal.toFixed(2)}`, 170, yPos, { align: 'right' });
    
    yPos += 10;
    doc.setFont(undefined, 'bold');
    doc.text("VAT (15%):", 120, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(`Rs. ${vatAmount.toFixed(2)}`, 170, yPos, { align: 'right' });
    
    if (discount > 0) {
      yPos += 10;
      doc.setFont(undefined, 'bold');
      doc.text("Discount:", 120, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(`Rs. ${discount.toFixed(2)}`, 170, yPos, { align: 'right' });
    }
    
    // Add horizontal line for total
    yPos += 10;
    doc.setLineWidth(0.2);
    doc.line(120, yPos - 5, 190, yPos - 5);
    
    yPos += 10;
    doc.setFont(undefined, 'bold');
    doc.text("Total:", 120, yPos);
    doc.text(`Rs. ${total.toFixed(2)}`, 170, yPos, { align: 'right' });
    
    // Add horizontal line
    doc.setLineWidth(0.2);
    doc.line(20, yPos + 5, 190, yPos + 5);
    
    // PAYMENT DETAILS SECTION
    yPos += 15;
    doc.setFont(undefined, 'bold');
    doc.text("PAYMENT DETAILS", 20, yPos);
    
    // Reset font
    doc.setFont(undefined, 'normal');
    
    // Create payment details table
    yPos += 10;
    doc.setFont(undefined, 'bold');
    doc.text("Payment Method:", 20, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(paymentMethod, 60, yPos);
    
    if (paymentMethod === 'Card') {
      yPos += 10;
      doc.setFont(undefined, 'bold');
      doc.text("Card Type:", 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(cardType, 60, yPos);
      
      yPos += 10;
      doc.setFont(undefined, 'bold');
      doc.text("Card Number:", 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(`**** **** **** ${cardNumber.slice(-4)}`, 60, yPos);
    } else if (paymentMethod === 'Online Slip') {
      yPos += 10;
      doc.setFont(undefined, 'bold');
      doc.text("Bank:", 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(selectedBank, 60, yPos);
      
      yPos += 10;
      doc.setFont(undefined, 'bold');
      doc.text("Customer NIC:", 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(customerNIC, 60, yPos);
      
      yPos += 10;
      doc.setFont(undefined, 'bold');
      doc.text("Slip Uploaded:", 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(slipUpload ? slipUpload.name : 'No Slip Uploaded', 60, yPos);
    }
    
    // Add horizontal line
    doc.setLineWidth(0.2);
    doc.line(20, yPos + 5, 190, yPos + 5);
    
    // Add footer
    yPos += 20;
    doc.setFontSize(10);
    doc.text("Thank you for your business!", 20, yPos);
    doc.text("For any queries, please contact our customer service.", 20, yPos + 10);
    
    // Add signature line
    yPos += 30;
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 80, yPos);
    doc.text("Customer Signature", 20, yPos + 5);
    
    // Save the PDF
    doc.save('invoice.pdf');
    
    // Save order information to localStorage
    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const location = deliveryMethod === 'Home Delivery' ? customerAddress : pickupLocation;
    
    const newOrder = {
      id: orderId,
      customerName: customerName,
      location: location,
      totalAmount: total.toFixed(2),
      status: 'Active',
      orderDate: new Date().toISOString()
    };
    
    // Get existing orders from localStorage
    const existingOrders = localStorage.getItem('orders');
    const orders = existingOrders ? JSON.parse(existingOrders) : [];
    
    // Add new order to the list
    orders.push(newOrder);
    
    // Save updated orders to localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Show verification popup
    showVerificationPopup();
  };

  // Handle Cancel button click
  const handleCancel = () => {
    navigate(-1); // Navigate back to the previous page (Checkout page)
  };

  // Handle delivery form submission
  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    
    if (!pickupLocation) {
      setLocationError('Please select a pickup location');
      isValid = false;
    }
    
    if (!customerName) {
      setNameError('Please enter your name');
      isValid = false;
    } else if (nameError) {
      isValid = false;
    }
    
    if (!customerEmail) {
      setEmailError('Please enter your email');
      isValid = false;
    } else if (emailError) {
      isValid = false;
    }
    
    if (!customerMobile) {
      setMobileError('Please enter your mobile number');
      isValid = false;
    } else if (mobileError) {
      isValid = false;
    }
    
    if (isValid) {
      setShowDeliveryPopup(false);
    }
  };

  // Generate delivery PDF
  const generateDeliveryPDF = () => {
    if (!pickupLocation || !customerName || !customerEmail || !customerMobile) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill in all delivery details before downloading',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    const doc = new jsPDF();
    
    // Add black border around the page
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 277);
    
    // Add company name
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text("LIVE ART PVT LTD", 20, 25);
    
    // Add invoice title
    doc.setFontSize(16);
    doc.text("PICKUP INVOICE", 20, 45);
    
    // Add Date and Time
    const date = new Date();
    const formattedDate = date.toLocaleString();
    doc.setFontSize(10);
    doc.text(`Date: ${formattedDate}`, 20, 55);
    
    // Add Invoice Number (random for demo)
    const invoiceNumber = "INV-" + Math.floor(100000 + Math.random() * 900000);
    doc.text(`Invoice #: ${invoiceNumber}`, 150, 55);
    
    // Add horizontal line
    doc.setLineWidth(0.2);
    doc.line(20, 60, 190, 60);
    
    // PERSONAL DETAILS SECTION
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text("PERSONAL DETAILS", 20, 75);
    
    // Reset font
    doc.setFont(undefined, 'normal');
    
    // Create personal details table
    const personalDetails = [
      ["Name:", customerName || "N/A"],
      ["Email:", customerEmail || "N/A"],
      ["Phone:", customerMobile || "N/A"],
      ["Pickup Location:", pickupLocation || "N/A"]
    ];
    
    let yPos = 85;
    personalDetails.forEach(row => {
      doc.setFont(undefined, 'bold');
      doc.text(row[0], 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(row[1], 60, yPos);
      yPos += 10;
    });
    
    // Add horizontal line
    doc.setLineWidth(0.2);
    doc.line(20, yPos + 5, 190, yPos + 5);
    
    // PICKUP INFORMATION SECTION
    yPos += 15;
    doc.setFont(undefined, 'bold');
    doc.text("PICKUP INFORMATION", 20, yPos);
    
    // Reset font
    doc.setFont(undefined, 'normal');
    
    // Create pickup details table
    yPos += 10;
    doc.setFont(undefined, 'bold');
    doc.text("Delivery Method:", 20, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(deliveryMethod, 60, yPos);
    
    // Add horizontal line
    doc.setLineWidth(0.2);
    doc.line(20, yPos + 5, 190, yPos + 5);
    
    // Add footer
    yPos += 20;
    doc.setFontSize(10);
    doc.text("Thank you for your business!", 20, yPos);
    doc.text("For any queries, please contact our customer service.", 20, yPos + 10);
    
    // Add signature line
    yPos += 30;
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 80, yPos);
    doc.text("Customer Signature", 20, yPos + 5);
    
    // Save the PDF
    doc.save('pickup_invoice.pdf');
  };

  // Handle delivery form clear
  const handleDeliveryClear = () => {
    setPickupLocation('');
    setCustomerName('');
    setCustomerEmail('');
    setCustomerMobile('');
    setLocationError('');
    setNameError('');
    setEmailError('');
    setMobileError('');
  };

  // Generate payment confirmation PDF
  const generatePDF = async () => {
    try {
      const doc = new jsPDF();
      
      // Add header
      doc.setFontSize(20);
      doc.text('Payment Confirmation', 105, 20, { align: 'center' });
      
      // Add payment details
      doc.setFontSize(12);
      doc.text(`Payment Method: ${paymentMethod}`, 20, 40);
      doc.text(`Amount: Rs. ${totalAmount}`, 20, 50);
      
      // Add timestamp
      const now = new Date();
      doc.text(`Date: ${now.toLocaleDateString()}`, 20, 60);
      doc.text(`Time: ${now.toLocaleTimeString()}`, 20, 70);
      
      // Add footer
      doc.setFontSize(10);
      doc.text('Thank you for your payment!', 105, 280, { align: 'center' });
      
      // Save the PDF
      doc.save('payment_confirmation.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    }
  };

  return (
    <div className="payment-page">
      <NavB />
      <div className="payment-container">
        <h2 className="payment-title">Order Details</h2>

        <div className="payment-amount-section">
          <label className="payment-label">Total Amount (Rs.)</label>
          <input
            type="text"
            value={formatAmount(totalAmount)}
            onChange={handleAmountChange}
            placeholder="Enter Total Amount"
            className="payment-input"
            readOnly
          />
        </div>

        <div className="payment-method-section">
          <label className="payment-label">Select Payment Method</label>
          <div className="payment-method-options">
            <button 
              className={`payment-method-btn ${paymentMethod === 'Card' ? 'active' : ''}`}
              onClick={() => handlePaymentMethodChange('Card')}
            >
              <i className="fas fa-credit-card"></i> Card
            </button>
            <button 
              className={`payment-method-btn ${paymentMethod === 'Online Slip' ? 'active' : ''}`}
              onClick={() => handlePaymentMethodChange('Online Slip')}
            >
              <i className="fas fa-university"></i> Online Banking
            </button>
          </div>
        </div>

        {paymentMethod === 'Card' && (
          <div className="selected-payment-info">
            <p>Selected Payment: Card</p>
            {cardType && <p>Card Type: {cardType}</p>}
          </div>
        )}

        {paymentMethod === 'Online Slip' && (
          <div className="selected-payment-info">
            <p>Selected Payment: Online Banking</p>
            {selectedBank && <p>Bank: {selectedBank}</p>}
          </div>
        )}
        
        <div className="delivery-method-section">
          <label className="payment-label">Select Delivery Option</label>
          <div className="payment-method-options">
            <button 
              className={`payment-method-btn ${deliveryMethod === 'Pickup' ? 'active' : ''}`}
              onClick={() => handleDeliveryMethodChange('Pickup')}
            >
              <i className="fas fa-store"></i> Pickup
            </button>
            <button 
              className={`payment-method-btn ${deliveryMethod === 'Home Delivery' ? 'active' : ''}`}
              onClick={() => handleDeliveryMethodChange('Home Delivery')}
            >
              <i className="fas fa-truck"></i> Home Delivery
            </button>
          </div>
        </div>
        
        {deliveryMethod === 'Pickup' && (
          <div className="selected-payment-info">
            <p>Selected Delivery: Pickup</p>
            {pickupLocation && <p>Location: {pickupLocation}</p>}
            {customerName && <p>Name: {customerName}</p>}
            {customerEmail && <p>Email: {customerEmail}</p>}
            {customerMobile && <p>Mobile: {customerMobile}</p>}
          </div>
        )}
        
        {deliveryMethod === 'Home Delivery' && (
          <div className="selected-payment-info">
            <p>Selected Delivery: Home Delivery</p>
            {customerName && <p>Name: {customerName}</p>}
            {customerEmail && <p>Email: {customerEmail}</p>}
            {customerMobile && <p>Mobile: {customerMobile}</p>}
            {customerAddress && <p>Address: {customerAddress}</p>}
          </div>
        )}

        {!isValid && <p className="error-message">Please enter a valid amount.</p>}

        <div className="payment-actions">
          <button className="confirm-btn" onClick={handleConfirm}>Confirm</button>
          <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
      </div>

      {/* Card Payment Popup */}
      {showCardPopup && (
        <div className="card-popup-overlay">
          <div className="card-popup">
            <h3>Enter Card Details</h3>
            
            <div className="card-type-selection">
              <button 
                className={`card-type-btn ${cardType === 'Visa' ? 'active' : ''}`}
                onClick={() => handleCardTypeSelect('Visa')}
              >
                <img src={visaLogo} alt="Visa" className="card-logo" />
              </button>
              <button 
                className={`card-type-btn ${cardType === 'Mastercard' ? 'active' : ''}`}
                onClick={() => handleCardTypeSelect('Mastercard')}
              >
                <img src={mastercardLogo} alt="Mastercard" className="card-logo" />
              </button>
            </div>

            <form onSubmit={handleCardSubmit} className="card-form">
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    maxLength="3"
                    required
                  />
                </div>
              </div>
              
              <div className="card-popup-actions">
                <button type="submit" className="submit-btn">Submit</button>
                <button type="button" className="close-btn" onClick={() => setShowCardPopup(false)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Online Slip Upload Popup */}
      {showSlipPopup && (
        <div className="card-popup-overlay">
          <div className="card-popup">
            <h3>Online Banking Details</h3>
            
            <form onSubmit={handleSlipSubmit} className="card-form">
              <div className="form-group">
                <label>Select Bank</label>
                <select 
                  value={selectedBank} 
                  onChange={handleBankChange}
                  className="form-select"
                  required
                >
                  <option value="">Select a bank</option>
                  {banks.map((bank, index) => (
                    <option key={index} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Customer NIC</label>
                <input
                  type="text"
                  value={customerNIC}
                  onChange={handleNICChange}
                  placeholder="Enter your NIC number"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Upload Bank Slip</label>
                <div className="file-upload-container">
                  <input
                    type="file"
                    onChange={handleSlipUpload}
                    className="file-upload-input"
                    accept=".jpg,.jpeg,.png,.pdf"
                    required
                  />
                  <p className="file-size-info">Maximum file size: 2MB</p>
                </div>
              </div>
              
              <div className="card-popup-actions">
                <button type="submit" className="submit-btn">Submit</button>
                <button type="button" className="close-btn" onClick={() => setShowSlipPopup(false)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delivery Popup */}
      {showDeliveryPopup && (
        <div className="card-popup-overlay">
          <div className="card-popup">
            <h3>Pickup Details</h3>
            
            <form onSubmit={handleDeliverySubmit} className="card-form">
              <div className="form-group">
                <label>Select Pickup Location</label>
                <select 
                  value={pickupLocation} 
                  onChange={handlePickupLocationChange}
                  className="form-select"
                  required
                >
                  <option value="">Select a location</option>
                  {pickupLocations.map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                  ))}
                </select>
                {locationError && <p className="error-text">{locationError}</p>}
              </div>
              
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={handleCustomerNameChange}
                  placeholder="Enter your name"
                  required
                />
                {nameError && <p className="error-text">{nameError}</p>}
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={handleCustomerEmailChange}
                  placeholder="Enter your email"
                  required
                />
                {emailError && <p className="error-text">{emailError}</p>}
              </div>
              
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="text"
                  value={customerMobile}
                  onChange={handleCustomerMobileChange}
                  placeholder="Enter your mobile number"
                  required
                />
                {mobileError && <p className="error-text">{mobileError}</p>}
              </div>
              
              <div className="card-popup-actions">
                <button type="submit" className="submit-btn">Save</button>
                <button type="button" className="download-btn" onClick={generateDeliveryPDF}>Download</button>
                <button type="button" className="clear-btn" onClick={handleDeliveryClear}>Clear</button>
                <button type="button" className="close-btn" onClick={() => setShowDeliveryPopup(false)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Home Delivery Popup */}
      {showHomeDeliveryPopup && (
        <div className="card-popup-overlay">
          <div className="card-popup">
            <h3>Home Delivery Details</h3>
            
            <form onSubmit={handleHomeDeliverySubmit} className="card-form">
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={handleCustomerNameChange}
                  placeholder="Enter your name"
                  required
                />
                {nameError && <p className="error-text">{nameError}</p>}
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={handleCustomerEmailChange}
                  placeholder="Enter your email"
                  required
                />
                {emailError && <p className="error-text">{emailError}</p>}
              </div>
              
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="text"
                  value={customerMobile}
                  onChange={handleCustomerMobileChange}
                  placeholder="Enter your mobile number"
                  required
                />
                {mobileError && <p className="error-text">{mobileError}</p>}
              </div>
              
              <div className="form-group">
                <label>Delivery Address</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={handleCustomerAddressChange}
                  placeholder="Enter your delivery address"
                  required
                  className="address-input"
                />
                {addressError && <p className="error-text">{addressError}</p>}
              </div>

              <div className="location-url-container">
                <div className="form-group">
                  <label>Location</label>
                  <div className="location-input-group">
                    <input
                      type="text"
                      value={locationUrl}
                      onChange={handleLocationUrlChange}
                      placeholder="Enter your location URL from Google Maps"
                      className="location-url-input"
                    />
                    <button 
                      type="button" 
                      className="location-selector-btn"
                      onClick={() => {
                        setShowLocationPopup(true);
                        showLocationNotAvailablePopup();
                      }}
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="card-popup-actions">
                <button type="submit" className="submit-btn">Save</button>
                <button type="button" className="download-btn" onClick={generateHomeDeliveryPDF}>Download</button>
                <button type="button" className="clear-btn" onClick={handleHomeDeliveryClear}>Clear</button>
                <button type="button" className="close-btn" onClick={() => setShowHomeDeliveryPopup(false)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;