import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { PDFDocument, rgb } from "pdf-lib";
import Header from "./Header";
import Footer from "./Footer";


function AddEmployee({ isAdmin }) {
  const [employeeData, setEmployeeData] = useState({
    employeeid: "",
    name: "",
    age: "",
    department: "",
    email: "",
    mobile: "",
    status: "",
    address: "",
    salary: isAdmin ? "" : "Not Assigned",
  });

  const [errors, setErrors] = useState({});

  const nameRegex = /^[A-Za-z\s]*$/;
  const emailRegex = /\S+@\S+\.\S+/;
  const mobileRegex = /^\d{0,10}$/;

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "employeeid":
        if (!value.trim()) error = "Employee ID is required";
        break;
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (!nameRegex.test(value)) error = "Only letters and spaces allowed";
        break;
      case "age":
        if (!value || isNaN(value) || value < 18) error = "Must be ≥ 18";
        break;
      case "department":
        if (!value) error = "Department is required";
        break;
      case "email":
        if (!emailRegex.test(value)) error = "Invalid email";
        break;
      case "mobile":
        if (!mobileRegex.test(value)) error = "Invalid mobile (10 digits)";
        break;
      case "status":
        if (!value) error = "Status is required";
        break;
      case "address":
        if (!value.trim()) error = "Address is required";
        break;
      case "salary":
        if (isAdmin) {
          if (value === "") error = "Salary required";
          else if (isNaN(value) || Number(value) < 0) error = "Invalid salary";
        }
        break;
      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.entries(employeeData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" && !nameRegex.test(value)) return;
    if (name === "mobile" && !/^\d*$/.test(value)) return;

    const updatedData = { ...employeeData, [name]: value };
    setEmployeeData(updatedData);

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post("http://localhost:4058/api/employee/add", employeeData);
      if (res.status === 201) {
        Swal.fire("Success", "Employee added!", "success");
        await generatePDF(employeeData);
        setEmployeeData({
          employeeid: "",
          name: "",
          age: "",
          department: "",
          email: "",
          mobile: "",
          status: "",
          address: "",
          salary: isAdmin ? "" : "Not Assigned",
        });
        setErrors({});
      }
    } catch (err) {
      Swal.fire("Error", "Failed to add employee", "error");
    }
  };

  const generatePDF = async (employee) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const fontSize = 12;

    page.drawText("Employee Registration Receipt", { x: 200, y: 750, size: 18, color: rgb(0.2, 0.4, 0.8) });
    page.drawText(`Registration Date: ${new Date().toLocaleString()}`, { x: 150, y: 720, size: fontSize });

    const content = `
ID         : ${employee.employeeid}
Name       : ${employee.name}
Age        : ${employee.age}
Department : ${employee.department}
Email      : ${employee.email}
Mobile     : ${employee.mobile}
Status     : ${employee.status}
Address    : ${employee.address}
Salary     : $${employee.salary}
    `;

    page.drawText(content, { x: 50, y: 650, size: fontSize, color: rgb(0.1, 0.1, 0.1) });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${employee.name}_Employee_Receipt.pdf`;
    link.click();
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <div className="card shadow-lg rounded-lg">
          <div className="card-header text-white fw-bold text-center py-3" style={{ backgroundColor: "#007bff" }}>
            <h3>Employee Registration Form</h3>
          </div>
          <div className="card-body p-5" style={{ backgroundColor: "#f8f9fa" }}>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {[
                  { name: "employeeid", label: "Employee ID", type: "text" },
                  { name: "name", label: "Name", type: "text" },
                  { name: "age", label: "Age", type: "number" },
                  {
                    name: "department",
                    label: "Department",
                    type: "select",
                    options: ["Sales", "Inventory", "Customer Support", "Operation Management"],
                  },
                  { name: "email", label: "Email", type: "email" },
                  { name: "mobile", label: "Mobile", type: "text" },
                  {
                    name: "status",
                    label: "Employment Status",
                    type: "select",
                    options: ["Active", "On Leave", "Retired", "Terminated"],
                  },
                ].map((field, i) => (
                  <div className={`col-md-${field.name === "status" ? 12 : 6}`} key={i}>
                    <label className="form-label fw-bold">{field.label}</label>
                    {field.type === "select" ? (
                      <select
                        className="form-select"
                        name={field.name}
                        value={employeeData[field.name]}
                        onChange={handleChange}
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map((opt, i) => (
                          <option value={opt} key={i}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        className="form-control"
                        name={field.name}
                        value={employeeData[field.name]}
                        onChange={handleChange}
                      />
                    )}
                    {errors[field.name] && <div className="text-danger">{errors[field.name]}</div>}
                  </div>
                ))}

                {/* Address */}
                <div className="col-md-12">
                  <label className="form-label fw-bold">Address</label>
                  <textarea
                    className="form-control"
                    name="address"
                    rows="3"
                    value={employeeData.address}
                    onChange={handleChange}
                  ></textarea>
                  {errors.address && <div className="text-danger">{errors.address}</div>}
                </div>

                {/* Salary (only Admin) */}
                {isAdmin && (
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Salary ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="salary"
                      value={employeeData.salary}
                      onChange={handleChange}
                    />
                    {errors.salary && <div className="text-danger">{errors.salary}</div>}
                  </div>
                )}
              </div>

              <div className="text-center mt-4">
                <button type="submit" className="btn btn-primary btn-lg rounded-pill">
                  Register Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AddEmployee;
