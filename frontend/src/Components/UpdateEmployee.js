import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer"; 

function UpdateEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:4058/api/employee/${id}`).then((response) => {
      setEmployee(response.data);
    });
  }, [id]);

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:4058/api/employee/${id}`, employee);
      alert("Employee updated successfully!");
      navigate("/"); // Redirect to AllEmployees page
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  return (
    <div>
      <Header/>
    <div className="container mt-5">
      
      <div className="card shadow-lg p-4 rounded-lg">
        <h3 className="text-center text-primary mb-4">Update Employee Details</h3>

        <div className="form-group mb-3">
          <label htmlFor="name" className="form-label fw-bold">Name:</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={employee.name || ""}
            onChange={handleChange}
            placeholder="Enter employee name"
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="age" className="form-label fw-bold">Age:</label>
          <input
            type="number"
            className="form-control"
            id="age"
            name="age"
            value={employee.age || ""}
            onChange={handleChange}
            placeholder="Enter employee age"
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="department" className="form-label fw-bold">Department:</label>
          <input
            type="text"
            className="form-control"
            id="department"
            name="department"
            value={employee.department || ""}
            onChange={handleChange}
            placeholder="Enter employee department"
          />
        </div>

        <div className="d-grid gap-2">
          <button onClick={handleUpdate} className="btn btn-success btn-lg">
            <i className="fas fa-save me-2"></i>Update Employee
          </button>

          <button
            className="btn btn-secondary btn-lg"
            onClick={() => navigate("/")}
          >
            <i className="fas fa-arrow-left me-2"></i>Back to Employee List
          </button>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
}

export default UpdateEmployee;
