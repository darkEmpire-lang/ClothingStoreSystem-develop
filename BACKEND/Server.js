const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const connectCloudinary = require('./config/cloudinary');


require("dotenv").config(); // Load .env variables

const app = express();

// Server Port Configuration
const PORT = process.env.PORT || 4058; // Fixed port number

// Middleware
app.use(cors());
app.use(bodyParser.json());

connectCloudinary();

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection URL
const URL = process.env.MONGODB_URL;

mongoose
  .connect(URL, {
  
  })
  .then(() => {
    console.log("✅ MongoDB Connection Successful!");
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error);
  });

// Import Routers (Fixed path and naming)
const EmployeeRouter = require("./Routes/EmployeeRoutes");
const FinanceRouter = require("./Routes/financeRoutes");
const supplierRoutes = require("./Routes/SupplierRegiRoutes");
const productRoutes = require("./Routes/ProductRoutes");
const categoryRoutes = require("./Routes/CategoryRoutes");
const financialRoutes = require("./Routes/financialRoutes");


const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

app.use('/api/user', userRoutes);
app.use('/api/tickets', ticketRoutes);

// Use Routers (correct path and usage)
app.use("/api/employee", EmployeeRouter); // Employee routes
app.use("/api/finance", FinanceRouter);   // Finance routes
app.use("/suppliers", supplierRoutes); //suppliers Route
app.use("/products", productRoutes); //product Routes
app.use("/category", categoryRoutes); //category Routes
app.use("/api", financialRoutes);

// Test Route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Employee and Finance Management API!");
});

// Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server is up and running on http://localhost:${PORT}`);
});