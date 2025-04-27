import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import axios from "axios";

const URL = "http://localhost:4058/suppliers";

const fetchHandler = async () => {
  try {
    const res = await axios.get(URL);
    return res.data;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw error;
  }
};

const deleteHandler = async (id) => {
  try {
    const res = await axios.delete(`${URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting supplier:", error);
    throw error;
  }
};

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchHandler()
      .then((data) => {
        if (data && data.suppliers) {
          setSuppliers(data.suppliers);
        }
      })
      .catch((error) => {
        console.error("Error during fetch:", error);
      });
  }, []);

  const handleDelete = (id) => {
    deleteHandler(id)
      .then(() => {
        setSuppliers((prevSuppliers) =>
          prevSuppliers.filter((supplier) => supplier._id !== id)
        );
      })
      .catch((error) => {
        console.error("Error deleting supplier:", error);
      });
  };

  return (
    <div className="suppliers-page">
      <Nav />
      <h1 className="title">Suppliers Page</h1>
      <div className="table-container">
        <table className="supplier-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact Number</th>
              <th>Address</th>
              <th>Items</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length > 0 ? (
              suppliers.map((supplier, index) => (
                <tr key={index}>
                  <td>{supplier.name}</td>
                  <td>{supplier.contactNumber}</td>
                  <td>{supplier.address}</td>
                  <td>{supplier.items}</td>
                  <td>
                    <button className="update-button">Update</button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(supplier._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No suppliers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Embedded CSS */}
      <style jsx="true">{`
        .suppliers-page {
          padding: 20px;
          background-color: #f9f9f9;
          min-height: 100vh;
        }

        .title {
          text-align: center;
          font-size: 2rem;
          color: #000;  /* Changed color to black */
          margin-bottom: 20px;
        }

        .table-container {
          display: flex;
          justify-content: center;
          margin: 20px 0;
        }

        .supplier-table {
          width: 90%;
          max-width: 1200px;
          border-collapse: collapse;
          border-radius: 10px;
          overflow: hidden;
          background-color: white;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .supplier-table thead {
          background: linear-gradient(to right, #6a11cb, #2575fc);
          color: white;
        }

        .supplier-table th,
        .supplier-table td {
          padding: 15px;
          text-align: center;
          border-bottom: 1px solid #ddd;
          color: #000;  /* Changed color to black for text in table rows */
        }

        .supplier-table tbody tr:hover {
          background-color: #f2f2f2;
        }

        .no-data {
          color: #999;
          text-align: center;
          padding: 20px;
        }

        .update-button,
        .delete-button {
          padding: 8px 12px;
          margin: 5px;
          font-size: 0.9rem;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .update-button {
          background: linear-gradient(to right, #34c759, #28a745);
          color: white;
        }

        .update-button:hover {
          background: #28a745;
          transform: translateY(-2px);
        }

        .delete-button {
          background: linear-gradient(to right, #ff3b30, #dc3545);
          color: white;
        }

        .delete-button:hover {
          background: #dc3545;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .supplier-table {
            width: 100%;
          }

          .title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Suppliers;
