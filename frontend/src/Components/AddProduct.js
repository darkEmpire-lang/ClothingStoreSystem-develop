import React, { useState } from "react";
import Nav from "./Nav";
import { useNavigate } from "react-router";
import axios from "axios";
import Swal from 'sweetalert2';

// Helper function to check if a date is today's date
const isToday = (date) => {
  const today = new Date();
  const inputDate = new Date(date);
  return (
    today.getDate() === inputDate.getDate() &&
    today.getMonth() === inputDate.getMonth() &&
    today.getFullYear() === inputDate.getFullYear()
  );
};

const AddProduct = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate price and stock quantity
    if (inputs.price < 0 || inputs.stockQuantity < 0) {
      setError("Price and Stock Quantity must be non-negative values");
      setLoading(false);
      return;
    }

    if (!selectedImage) {
      setError("Please select an image");
      setLoading(false);
      return;
    }

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('name', inputs.name);
      formData.append('description', inputs.description);
      formData.append('price', inputs.price);
      formData.append('category', inputs.category);
      formData.append('stockQuantity', inputs.stockQuantity);
      formData.append('image', selectedImage);

      // Send request with FormData
      const response = await axios.post("http://localhost:4058/products", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Show success message
      Swal.fire({
        title: 'Success!',
        text: 'Product added successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/stock");
        }
      });
    } catch (error) {
      console.error("Error adding product:", error);
      setError(error.response?.data?.message || "Failed to add product. Please try again.");
      
      // Show error message
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || "Failed to add product. Please try again.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const formStyles = {
    formContainer: {
      width: "80%",
      maxWidth: "500px",
      margin: "0 auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      backgroundColor: "#f8f9fa",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
    heading: {
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "1.5rem",
      color: "#333",
    },
    inputField: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      fontWeight: "bold",
      marginBottom: "5px",
      color: "black",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    submitButton: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      fontWeight: "bold",
      cursor: "pointer",
      opacity: loading ? 0.7 : 1,
    },
    errorMessage: {
      color: "red",
      marginBottom: "10px",
      textAlign: "center",
    },
    imagePreview: {
      width: "100%",
      maxHeight: "200px",
      objectFit: "contain",
      marginTop: "10px",
      marginBottom: "10px",
    },
    fileInput: {
      display: "none",
    },
    fileInputLabel: {
      display: "inline-block",
      padding: "10px 20px",
      backgroundColor: "#6c757d",
      color: "white",
      borderRadius: "5px",
      cursor: "pointer",
      marginTop: "5px",
    },
  };

  return (
    <div>
      <Nav />
      <div style={formStyles.formContainer}>
        <h1 style={formStyles.heading}>Add New Product</h1>
        {error && <div style={formStyles.errorMessage}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={formStyles.inputField}>
            <label htmlFor="name" style={formStyles.label}>
              Product Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleChange}
              value={inputs.name}
              style={formStyles.input}
              required
            />
          </div>

          <div style={formStyles.inputField}>
            <label htmlFor="description" style={formStyles.label}>
              Description
            </label>
            <textarea
              name="description"
              id="description"
              onChange={handleChange}
              value={inputs.description}
              style={formStyles.input}
              rows="3"
              required
            ></textarea>
          </div>

          <div style={formStyles.inputField}>
            <label htmlFor="price" style={formStyles.label}>
              Price
            </label>
            <input
              type="number"
              name="price"
              id="price"
              onChange={handleChange}
              value={inputs.price}
              style={formStyles.input}
              min="0"
              required
            />
          </div>

          <div style={formStyles.inputField}>
            <label htmlFor="category" style={formStyles.label}>
              Category
            </label>
            <select
              name="category"
              id="category"
              onChange={handleChange}
              value={inputs.category}
              style={formStyles.input}
              required
            >
              <option value="">Select Category</option>
              <option value="GENTS-SHIRTS">Men's Shirts</option>
              <option value="GENTS-T-SHIRTS">Men's T-Shirts</option>
              <option value="GENTS-PANTS">Men's Pants</option>
              <option value="WOMENS-FROCKS">Women's Frocks</option>
              <option value="WOMENS-TOPS">Women's Tops</option>
              <option value="WOMENS-PANTS">Women's Pants</option>
              <option value="WOMENS-SKIRTS">Women's Skirts</option>
            </select>
          </div>

          <div style={formStyles.inputField}>
            <label htmlFor="stockQuantity" style={formStyles.label}>
              Stock Quantity
            </label>
            <input
              type="number"
              name="stockQuantity"
              id="stockQuantity"
              onChange={handleChange}
              value={inputs.stockQuantity}
              style={formStyles.input}
              min="0"
              required
            />
          </div>

          <div style={formStyles.inputField}>
            <label htmlFor="image" style={formStyles.label}>
              Product Image
            </label>
            <input
              type="file"
              name="image"
              id="image"
              onChange={handleImageChange}
              style={formStyles.fileInput}
              accept="image/*"
              required
            />
            <label htmlFor="image" style={formStyles.fileInputLabel}>
              Choose Image
            </label>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                style={formStyles.imagePreview}
              />
            )}
          </div>

          <button
            type="submit"
            style={formStyles.submitButton}
            disabled={loading}
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
