import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import axios from "axios";

function Notification() {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [hoverIndex, setHoverIndex] = useState(null); // For managing hover dynamically

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4058/products");

        if (response.data && Array.isArray(response.data.products)) {
          const products = response.data.products;
          const lowStock = products.filter(
            (product) => product.stockQuantity < 3
          );
          setLowStockProducts(lowStock);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching product data:", error.message);
      }
    };

    fetchProducts();
  }, []);

  const styles = {
    container: {
      backgroundColor: "#d3d3d3",
      minHeight: "100vh",
      padding: "30px",
      color: "#1a1a1a",
      fontFamily: "'Poppins', sans-serif",
    },
    title: {
      textAlign: "center",
      fontSize: "3rem",
      fontWeight: "700",
      color: "#333333",
      marginBottom: "30px",
      textShadow: "2px 2px rgba(0, 0, 0, 0.6)",
    },
    alertBox: {
      backgroundColor: "#f2f2f2",
      padding: "30px",
      borderRadius: "12px",
      border: "1px solid #999",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    },
    listGroup: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    listItem: (isHovered) => ({
      padding: "20px",
      marginBottom: "15px",
      background: isHovered
        ? "linear-gradient(135deg, #bfbfbf, #a6a6a6)"
        : "linear-gradient(135deg, #cccccc, #bfbfbf)",
      borderRadius: "10px",
      color: "#1a1a1a",
      boxShadow: isHovered
        ? "0 6px 20px rgba(0,0,0,0.3)"
        : "0 4px 10px rgba(0,0,0,0.2)",
      transition: "transform 0.3s, background 0.3s",
      cursor: "pointer",
      transform: isHovered ? "translateY(-5px)" : "none",
    }),
    productName: {
      fontWeight: "600",
      fontSize: "1.5rem",
    },
    productCategory: {
      fontSize: "1.1rem",
      marginTop: "5px",
      color: "#666666",
    },
    stockInfo: {
      fontWeight: "700",
      fontSize: "1.2rem",
      marginTop: "8px",
      color: "#000",
    },
    successMessage: {
      textAlign: "center",
      fontSize: "1.8rem",
      fontWeight: "600",
      padding: "20px",
      borderRadius: "12px",
      backgroundColor: "#e6e6e6",
      color: "#333333",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    },
  };

  return (
    <div style={styles.container}>
      <Nav />
      <h1 style={styles.title}>Notification</h1>

      <div>
        {lowStockProducts.length > 0 ? (
          <div style={styles.alertBox}>
            <h2 className="text-center">
              ⚠️ Attention! These Products are Running Low on Stock:
            </h2>
            <ul style={styles.listGroup}>
              {lowStockProducts.map((product, index) => (
                <li
                  key={product._id || index} // Fallback to index if _id is missing
                  style={styles.listItem(hoverIndex === index)}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <div style={styles.productName}>{product.name}</div>
                  <div style={styles.productCategory}>
                    Category: <strong>{product.category}</strong>
                  </div>
                  <div style={styles.stockInfo}>
                    Current Stock: <strong>{product.stockQuantity}</strong>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p style={styles.successMessage}>
            🎉 All products have sufficient stock! Keep up the good work! 🎉
          </p>
        )}
      </div>
    </div>
  );
}

export default Notification;
