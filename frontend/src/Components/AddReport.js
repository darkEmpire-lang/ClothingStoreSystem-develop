import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer"; 
import "./AddReport.css";

import {
  Box,
  Button,
  TextField,
  Tooltip,
  Typography,
  Alert,
  Container,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { FaMoneyBillWave, FaCoins, FaDownload, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import axios from "axios";
import logo from '../assets/logo.png';

function AddReport() {
  const [month, setMonth] = useState("");
  const [revenue, setRevenue] = useState("");
  const [expenses, setExpenses] = useState("");
  const [profitOrLoss, setProfitOrLoss] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportId, setReportId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [date, setDate] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [currency, setCurrency] = useState("LKR");

  // Auto-calculate profit/loss on revenue/expenses change
  useEffect(() => {
    setProfitOrLoss((parseFloat(revenue) || 0) - (parseFloat(expenses) || 0));
  }, [revenue, expenses]);

  // Format currency values with 2 decimal places
  const formatCurrency = (value) => {
    return parseFloat(value || 0).toFixed(2);
  };

  // Set default values when component mounts
  useEffect(() => {
    // Generate a random report ID
    const randomId = Math.floor(100000 + Math.random() * 900000);
    setReportId(`REP-${randomId}`);
    
    // Set current date
    const today = new Date();
    setDate(today.toLocaleDateString());
    
    // Set employee name (you might want to get this from user context or props)
    setEmployeeName("John Doe");
    
    // Set sample sales data (replace with actual data from your backend)
    setSalesData([
      { itemName: "T-Shirt", quantity: 10, price: 25.99 },
      { itemName: "Jeans", quantity: 5, price: 49.99 },
      { itemName: "Shoes", quantity: 3, price: 79.99 },
      { itemName: "Hat", quantity: 8, price: 15.99 }
    ]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Form validation - Updated month validation to be more flexible
    if (!month.trim()) {
      setError("Please enter a month.");
      return;
    }
    
    // Even more flexible month validation - allows various formats
    const monthRegex = /^([a-zA-Z]+|\d{1,2})(\s*|\/|\-|\.)\d{4}$/;
    if (!monthRegex.test(month)) {
      setError("Please enter a valid month and year (e.g., January 2025, Jan 2025, or 01/2025).");
      return;
    }

    if (isNaN(revenue) || isNaN(expenses) || revenue === "" || expenses === "") {
      setError("Please enter valid numeric values for revenue and expenses.");
      return;
    }

    if (parseFloat(revenue) < 0 || parseFloat(expenses) < 0) {
      setError("Revenue and expenses must be non-negative.");
      return;
    }

    const reportData = {
      month,
      revenue: parseFloat(revenue),
      expenses: parseFloat(expenses),
      profitOrLoss,
      reportId,
      employeeName,
      date,
      salesData,
      currency
    };

    console.log("Submitting report data:", reportData);

    try {
      setLoading(true);
      
      // Check if the API endpoint is accessible
      console.log("Attempting to connect to API endpoint: http://localhost:5005/api/finance/add");
      
      const response = await axios.post("http://localhost:5005/api/finance/add", reportData, {
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        timeout: 10000 // 10 second timeout
      });

      console.log("API response:", response);

      if (response.status >= 200 && response.status < 300) {
        setSuccess("Finance report successfully added and saved!");
        generatePDF();
        setTimeout(resetForm, 2000); // Reset form after success
      } else {
        setError(`Unexpected server response (${response.status}): ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error submitting the report:", error);
      
      // More detailed error handling
      if (error.code === 'ECONNREFUSED') {
        setError("Could not connect to the server. Please check if the backend server is running.");
      } else if (error.code === 'ETIMEDOUT') {
        setError("Request timed out. The server is taking too long to respond.");
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Server error (${error.response.status}): ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response received from the server. Please check your network connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Add decorative border with gradient effect
    doc.setDrawColor(218, 165, 32); // Gold color
    doc.setLineWidth(2);
    doc.roundedRect(10, 10, pageWidth - 20, pageHeight - 20, 5, 5);
    
    // Add inner border with shadow effect
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, 15, pageWidth - 30, pageHeight - 30, 3, 3);
    
    // Add logo with enhanced border and shadow effect
    doc.setDrawColor(218, 165, 32);
    doc.setLineWidth(1);
    doc.roundedRect(20, 20, 45, 45, 3, 3);
    doc.addImage(logo, 'PNG', 22, 22, 41, 41);
    
    // Add header with gradient background
    doc.setFillColor(245, 245, 245);
    doc.rect(10, 10, pageWidth - 20, 35, 'F');
    
    // Add decorative line under header with gradient effect
    doc.setDrawColor(218, 165, 32);
    doc.setLineWidth(1);
    doc.line(20, 45, pageWidth - 20, 45);
    
    // Add company name with enhanced styling
    doc.setFontSize(24);
    doc.setTextColor(51, 51, 51);
    doc.setFont('helvetica', 'bold');
    doc.text('Live Art Clothing Pvt Ltd', pageWidth/2, 30, { align: 'center' });
    
    // Add report title with modern styling
    doc.setFontSize(20);
    doc.setTextColor(64, 64, 64);
    doc.text('Finance Report', pageWidth/2, 55, { align: 'center' });
    
    // Add report details with enhanced styling
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);
    
    // Add report ID with enhanced styling
    doc.setFont('helvetica', 'bold');
    doc.text('Report ID:', 30, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(reportId, 70, 65);
    
    // Add date with modern styling
    const currentDate = new Date().toLocaleDateString();
    doc.setFont('helvetica', 'bold');
    doc.text('Issue Date:', pageWidth - 80, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(currentDate, pageWidth - 30, 65, { align: 'right' });
    
    // Add financial summary section with enhanced styling
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 51, 51);
    doc.text('Financial Summary', 30, 85);
    
    // Add decorative line under section title
    doc.setDrawColor(218, 165, 32);
    doc.setLineWidth(0.5);
    doc.line(30, 88, 100, 88);
    
    // Table with enhanced styling
    const startY = 100;
    const col1X = 30;
    const col2X = pageWidth - 60;
    
    // Table header with gold gradient background
    doc.setFillColor(218, 165, 32);
    doc.roundedRect(col1X - 5, startY - 5, col2X - col1X + 30, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Item', col1X, startY + 4);
    doc.text(`Amount (${currency})`, col2X, startY + 4);
    
    // Table content with enhanced styling
    const rowHeight = 12;
    const rows = [
      { label: 'Month:', value: month },
      { label: 'Revenue:', value: formatCurrency(revenue) },
      { label: 'Expenses:', value: formatCurrency(expenses) }
    ];
    
    rows.forEach((row, index) => {
      const y = startY + (index + 1) * rowHeight;
      
      // Alternate row colors with subtle gradient
      const rowColor = index % 2 === 0 ? [250, 250, 250] : [245, 245, 245];
      doc.setFillColor(rowColor[0], rowColor[1], rowColor[2]);
      doc.roundedRect(col1X - 5, y - 5, col2X - col1X + 30, rowHeight, 1, 1, 'F');
      
      // Row content with enhanced typography
      doc.setTextColor(64, 64, 64);
      doc.setFont('helvetica', 'normal');
      doc.text(row.label, col1X, y + 4);
      doc.text(row.value, col2X, y + 4);
    });
    
    // Profit/Loss row with enhanced styling
    const profitY = startY + (rows.length + 1) * rowHeight;
    
    // Background color based on profit/loss with gradient effect
    if (profitOrLoss >= 0) {
      doc.setFillColor(230, 245, 230); // Light green
      doc.setTextColor(76, 175, 80); // Green text
    } else {
      doc.setFillColor(255, 235, 235); // Light red
      doc.setTextColor(244, 67, 54); // Red text
    }
    
    doc.roundedRect(col1X - 5, profitY - 5, col2X - col1X + 30, rowHeight, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Profit/Loss:', col1X, profitY + 4);
    doc.text(formatCurrency(profitOrLoss), col2X, profitY + 4);
    
    // Add signature section with enhanced styling
    const signatureY = pageHeight - 80;
    
    // Add signature boxes with enhanced styling
    const signatureWidth = 80;
    const signatureSpacing = 20;
    
    // Finance Manager Signature with enhanced styling
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 51, 51);
    doc.text('Finance Manager', 30, signatureY);
    doc.setDrawColor(218, 165, 32);
    doc.setLineWidth(1);
    doc.line(30, signatureY + 5, 30 + signatureWidth, signatureY + 5);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);
    doc.text('Name & Signature', 30, signatureY + 15);
    doc.text(currentDate, 30, signatureY + 20);
    
    // CEO Signature with enhanced styling
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 51, 51);
    doc.text('Chief Executive Officer', pageWidth - 30 - signatureWidth, signatureY);
    doc.setDrawColor(218, 165, 32);
    doc.setLineWidth(1);
    doc.line(pageWidth - 30 - signatureWidth, signatureY + 5, pageWidth - 30, signatureY + 5);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);
    doc.text('Name & Signature', pageWidth - 30 - signatureWidth, signatureY + 15);
    doc.text(currentDate, pageWidth - 30 - signatureWidth, signatureY + 20);
    
    // Add footer with enhanced styling
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);
    
    // Add decorative line above footer with gradient effect
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25);
    
    // Footer text with enhanced styling
    doc.setFont('helvetica', 'bold');
    doc.text('© 2024 Clothing Store System', pageWidth/2, pageHeight - 15, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text('Confidential - For Internal Use Only', pageWidth/2, pageHeight - 10, { align: 'center' });
    
    // Add page number with enhanced styling
    doc.setFontSize(8);
    doc.text('Page 1 of 1', pageWidth - 20, pageHeight - 5, { align: 'right' });
    
    // Save the PDF
    doc.save(`finance_report_${month.replace(/\s+/g, '_')}.pdf`);
  };

  const resetForm = () => {
    setMonth("");
    setRevenue("");
    setExpenses("");
    setProfitOrLoss(0);
    setSuccess("");
    setError("");
  };

  return (
    <div className="report-container">
      <Header/>
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Card className="report-card" elevation={3}>
          <div className="report-card-header">
            <Typography variant="h4" className="report-card-title">
              Finance Report
            </Typography>
            <Typography variant="subtitle1" className="report-card-subtitle">
              Live Art Clothing Pvt Ltd
            </Typography>
          </div>
          <CardContent className="report-card-content">
            {error && <Alert severity="error" className="report-alert">{error}</Alert>}
            {success && <Alert severity="success" className="report-alert">{success}</Alert>}

            <Box component="form" onSubmit={handleSubmit} className="form-section">
              <Typography variant="h6" className="form-section-title">
                Report Details
              </Typography>
              
              <div className="report-form-group">
                <label className="report-label">
                  <span className="report-icon">📅</span> Month
                </label>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter month (e.g., January 2025)"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  required
                  className="modern-input"
                  helperText="Accepted formats: January 2025, Jan 2025, 01/2025"
                />
              </div>

              <div className="report-form-group">
                <FormControl fullWidth variant="outlined" className="modern-input">
                  <InputLabel id="currency-label">Currency</InputLabel>
                  <Select
                    labelId="currency-label"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    label="Currency"
                  >
                    <MenuItem value="LKR">LKR - Sri Lankan Rupee</MenuItem>
                    <MenuItem value="USD">USD - US Dollar</MenuItem>
                    <MenuItem value="EUR">EUR - Euro</MenuItem>
                    <MenuItem value="GBP">GBP - British Pound</MenuItem>
                    <MenuItem value="INR">INR - Indian Rupee</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="report-form-group">
                <label className="report-label">
                  <span className="report-icon revenue-icon"><FaMoneyBillWave /></span> Revenue
                </label>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  required
                  min="0"
                  className="modern-input"
                  InputProps={{
                    endAdornment: <span style={{ color: '#666' }}>{currency}</span>,
                  }}
                />
              </div>

              <div className="report-form-group">
                <label className="report-label">
                  <span className="report-icon expense-icon"><FaCoins /></span> Expenses
                </label>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="number"
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value)}
                  required
                  min="0"
                  className="modern-input"
                  InputProps={{
                    endAdornment: <span style={{ color: '#666' }}>{currency}</span>,
                  }}
                />
              </div>

              <Paper elevation={2} className="profit-loss-display">
                <div className="profit-loss-label">Profit or Loss (Auto-Calculated)</div>
                <div className={`profit-loss-value ${profitOrLoss >= 0 ? 'profit' : 'loss'}`}>
                  {currency} {formatCurrency(profitOrLoss)}
                </div>
              </Paper>

              <Button
                type="submit"
                variant="contained"
                className="modern-submit-button"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FaFilePdf />}
              >
                {loading ? "Processing..." : "Submit and Download PDF"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
      <Footer/>
    </div>
  );
}

export default AddReport;