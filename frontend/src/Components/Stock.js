import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const URL = "http://localhost:4058/products";

const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    return response.data?.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const deleteHandler = async (id) => {
  try {
    const res = await axios.delete(`${URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

function Stock() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchHandler()
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = filteredProducts.sort((a, b) => {
    const aVal = a[sortField] || "";
    const bVal = b[sortField] || "";
    if (sortField === "price" || sortField === "stockQuantity") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }
    return sortOrder === "asc"
      ? aVal.toString().toLowerCase().localeCompare(bVal.toString().toLowerCase())
      : bVal.toString().toLowerCase().localeCompare(aVal.toString().toLowerCase());
  });

  const handleSortChange = (field) => {
    setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    deleteHandler(id)
      .then(() => {
        setProducts((prev) => prev.filter((product) => product._id !== id));
      })
      .catch(() => {
        alert("Failed to delete the product. Try again.");
      })
      .finally(() => {
        setDeletingId(null);
      });
  };

  const getTotalAvailableItems = () => products.length;
  const getTotalStockQuantity = () =>
    products.reduce((total, product) => total + (product.stockQuantity || 0), 0);
  const getLowStockItemsCount = () =>
    products.filter((product) => (product.stockQuantity || 0) <= 2).length;

  return (
    <div className="container-fluid px-5 py-4" style={{ backgroundColor: "#f4f7fa", minHeight: "100vh" }}>
      <Nav />
      <h1 className="text-center mb-4 display-5 fw-bold text-primary">
        Product Stock Dashboard
      </h1>

      <div className="row mb-5 text-white">
        <div className="col-md-4 mb-3">
          <div
            className="card shadow-lg border-0"
            style={{ backgroundColor: "#e2e2e2", boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)" }}
          >
            <div className="card-body text-center">
              <h5 className="card-title fw-bold">Available Variations</h5>
              <p className="card-text fs-5">{getTotalAvailableItems()} Items</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div
            className="card shadow-lg border-0"
            style={{ backgroundColor: "#e2e2e2", boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)" }}
          >
            <div className="card-body text-center">
              <h5 className="card-title fw-bold">Total Stock Quantity</h5>
              <p className="card-text fs-5">{getTotalStockQuantity()}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div
            className="card shadow-lg border-0"
            style={{ backgroundColor: "#e2e2e2", boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)" }}
          >
            <div className="card-body text-center">
              <h5 className="card-title fw-bold">Low Stock Alert</h5>
              <p className="card-text fs-5">{getLowStockItemsCount()} Items</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 d-flex justify-content-center">
        <input
          type="text"
          className="form-control w-50 shadow-sm border-primary"
          placeholder="🔍 Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="table-responsive shadow-sm">
        {loading ? (
          <div className="text-center text-secondary py-5">
            Loading products...
          </div>
        ) : (
          <table className="table table-bordered table-hover table-striped align-middle">
            <thead className="table-dark text-center" style={{ backgroundColor: "#e2e2e2" }}>
              <tr>
                <th onClick={() => handleSortChange("name")} style={{ cursor: "pointer" }}>
                  Item Name {sortField === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSortChange("price")} style={{ cursor: "pointer" }}>
                  Price {sortField === "price" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
                <th>Category</th>
                <th onClick={() => handleSortChange("stockQuantity")} style={{ cursor: "pointer" }}>
                  Stock Quantity {sortField === "stockQuantity" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
                <th>Image</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>${(product.price || 0).toFixed(2)}</td>
                    <td>{product.category}</td>
                    <td>{product.stockQuantity}</td>
                    <td>
                      <img
                        src={product.imageUrl || "https://via.placeholder.com/50x50.png?text=No+Image"}
                        alt={product.name}
                        width="50"
                        className="rounded"
                      />
                    </td>
                    <td>{new Date(product.createdAt).toLocaleString()}</td>
                    <td>{new Date(product.updatedAt).toLocaleString()}</td>
                    <td>
                      <Link to={`/stock/update/${product._id}`} className="btn btn-sm btn-outline-secondary me-2">
                        Update
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(product._id)}
                        disabled={deletingId === product._id}
                      >
                        {deletingId === product._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">
                    <div className="text-muted text-center py-3">
                      No products available 💤
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Stock;
