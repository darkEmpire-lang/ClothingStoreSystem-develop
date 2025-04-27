import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from 'axios';

// Finance Manager Components
import AddEmployee from "./Components/AddEmployee";
import AllEmployees from "./Components/AllEmployee";
import UpdateEmployee from "./Components/UpdateEmployee";
import ViewEmployee from "./Components/ViewEmployee";
import AddReport from "./Components/AddReport";
import AllReport from "./Components/AllReport";
import ReportDetails from "./Components/Reportdetails";
import AssignSalary from "./Components/AssignSalary";
import ViewSalary from "./Components/ViewSalary";
import Home from "./Components/Home";
import FinanceDashboard from "./Components/FinanceDashboard";

// Product Manager Components
import Checkout from './Components/Checkout';
import Payment from './Components/Payment';
import ProductList from './Components/ProductList';
import ProductDetail from './Components/ProductDetail';
import Aboutus from './Components/Aboutus';
import OrderStatus from './Components/OrderStatus';
import Locations from './Components/Locations';
import Contact from './Components/Contact';

// Inventory Manager Components
import HomeS from "./Components/HomeS";
import Stock from "./Components/Stock";
import Supplier from "./Components/Suppliers";
import Notify from "./Components/Notification";
import SupplierRegi from "./Components/SupplierRegi";
import AddProduct from "./Components/AddProduct";
import Success from "./Components/Success";
import UpdateProduct from "./Components/UpdateProduct";
import Item from "./Components/Item";
import AddCategory from "./Components/AddCategory";
import Category from "./Components/Category";

// User Management
import AuthPage from "./UserManagement/AuthPage";
import AdminDashboard from "./UserManagement/AdminDashboard";
import Profile from "./UserManagement/Profile";
import RaiseTicket from "./UserManagement/RaiseTicket";
import MyTickets from "./UserManagement/MyTickets";
import Chatbot from "./UserManagement/Chatbot";

// Navbar
import NavBar from "./Components/NavBar";

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import HomeLiveArt from "./Components/HomeLiveArt";

// Auth Context
import { AuthProvider, useAuth } from "./context/AuthContext";

// Protected Route
function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/auth" />;
}

function App() {
  const [cart, setCart] = useState([]);
  const [checkoutProducts, setCheckoutProducts] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchProducts = async () => {
    try {
      await axios.get('http://localhost:4058/products/search', { params: filters });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddToCart = (product) => {
    const updatedCart = [...cart];
    const existingProduct = updatedCart.find(item => item._id === product._id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }
    setCart(updatedCart);
  };

  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter(item => item._id !== productId);
    setCart(updatedCart);
  };

  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <div className="container mt-4">
          <Routes>
            {/* Finance Dashboard Route */}
            <Route path="/finance-dashboard" element={<FinanceDashboard />} />

            {/* Product Catalogue Routes */}
            <Route path="/" element={<HomeLiveArt />} />
            <Route path="/productlist" element={<ProductList />} />
            <Route path="/product/:productId" element={<ProductDetail handleAddToCart={handleAddToCart} />} />
            <Route path="/checkout" element={<Checkout checkoutProducts={checkoutProducts} handleRemoveFromCart={handleRemoveFromCart} />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/order-status" element={<OrderStatus />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/aboutus" element={<Aboutus />} />
            <Route path="/contact" element={<Contact />} />

            {/* Employee Management Routes */}
            <Route path="/add-employee" element={<AddEmployee />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/all-employees" element={<AllEmployees />} />
            <Route path="/update-employee/:id" element={<UpdateEmployee />} />
            <Route path="/view-employee/:id" element={<ViewEmployee />} />

            {/* Report Management Routes */}
            <Route path="/add-report" element={<AddReport />} />
            <Route path="/all-reports" element={<AllReport />} />
            <Route path="/view-report/:id" element={<ReportDetails />} />

            {/* Salary Management Routes */}
            <Route path="/assign-salary" element={<AssignSalary />} />
            <Route path="/view-salary" element={<ViewSalary />} />

            {/* Inventory Management Routes */}
            <Route path="/inventory-management-Home" element={<HomeS />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/supplier" element={<Supplier />} />
            <Route path="/notify" element={<Notify />} />
            <Route path="/supplier-register" element={<SupplierRegi />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/success" element={<Success />} />
            <Route path="/stock/update/:id" element={<UpdateProduct />} />
            <Route path="/stock/item/:id" element={<Item />} />
            <Route path="/addcategory" element={<AddCategory />} />
            <Route path="/category" element={<Category />} />

            
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/chat" element={<Chatbot />} />
            

            <Route path="/profile"element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="/raise-ticket"
              element={
                <PrivateRoute>
                  <RaiseTicket />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-tickets"
              element={
                <PrivateRoute>
                  <MyTickets />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

       
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
