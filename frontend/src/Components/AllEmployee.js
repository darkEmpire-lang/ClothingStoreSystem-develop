import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Button, Spinner, Badge, Dropdown } from "react-bootstrap";
import { FaSearch, FaSort, FaFilter, FaDownload, FaTrash, FaEdit, FaTimes, FaSave } from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";
import "./AllEmployee.css";

const AllEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [filterConfig, setFilterConfig] = useState({
    department: '',
    status: '',
    ageRange: ''
  });

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, status } = await axios.get("http://localhost:4058/api/employee/");
      if (status === 200 && Array.isArray(data)) {
        const normalized = data.map((emp) => ({
          employeeid: emp.employeeid || emp._id || emp.id || "N/A",
          name: emp.name || "",
          age: emp.age || "",
          department: emp.department || "",
          email: emp.email || "",
          mobile: emp.mobile || "",
          status: emp.status || "Active",
        }));
        setEmployees(normalized);
      } else {
        throw new Error("Unexpected response format or status.");
      }
    } catch (error) {
      setError(error.message);
      handleApiError(error, "Failed to fetch employee data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleApiError = (error, defaultMsg) => {
    const message = error?.response?.data?.message || defaultMsg;
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
      showConfirmButton: true,
      timer: 3000,
      timerProgressBar: true
    });
  };

  const handleDelete = async (employeeId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const { status } = await axios.delete(`http://localhost:4058/api/employee/delete/${employeeId}`);
          return status === 200;
        } catch (error) {
          Swal.showValidationMessage(`Delete failed: ${error.message}`);
          return false;
        }
      }
    });

    if (result.isConfirmed) {
      setEmployees((prev) => prev.filter((emp) => emp.employeeid !== employeeId));
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The employee has been deleted.",
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEmployees.length === 0) {
      Swal.fire("Warning", "Please select employees to delete", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "Delete Selected Employees?",
      text: `Are you sure you want to delete ${selectedEmployees.length} employees?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete them!"
    });

    if (result.isConfirmed) {
      try {
        await Promise.all(
          selectedEmployees.map(id => 
            axios.delete(`http://localhost:4058/api/employee/delete/${id}`)
          )
        );
        setEmployees(prev => prev.filter(emp => !selectedEmployees.includes(emp.employeeid)));
        setSelectedEmployees([]);
        Swal.fire("Deleted!", "Selected employees have been deleted.", "success");
      } catch (error) {
        handleApiError(error, "Failed to delete some employees. Please try again.");
      }
    }
  };

  const handleUpdate = async () => {
    const { name, email, department, employeeid } = selectedEmployee || {};
    if (!name || !email || !department) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fill in all required fields.",
        confirmButtonColor: "#3085d6"
      });
      return;
    }

    try {
      const { status } = await axios.put(
        `http://localhost:4058/api/employee/update/${employeeid}`,
        selectedEmployee
      );
      if (status === 200) {
        setEmployees((prev) =>
          prev.map((emp) => (emp.employeeid === employeeid ? { ...selectedEmployee } : emp))
        );
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Employee details updated successfully!",
          timer: 1500,
          showConfirmButton: false
        });
        handleCloseModal();
      }
    } catch (error) {
      handleApiError(error, "Failed to update employee. Please try again.");
    }
  };

  const handleViewAndUpdate = (employee) => {
    setSelectedEmployee({ ...employee });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setSelectedEmployee((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || "" : value,
    }));
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (type, value) => {
    setFilterConfig(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleExport = () => {
    const csvContent = [
      ['Employee ID', 'Name', 'Age', 'Department', 'Email', 'Mobile', 'Status'],
      ...employees.map(emp => [
        emp.employeeid,
        emp.name,
        emp.age,
        emp.department,
        emp.email,
        emp.mobile,
        emp.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredAndSortedEmployees = employees
    .filter(emp => {
      const matchesSearch = 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = !filterConfig.department || emp.department === filterConfig.department;
      const matchesStatus = !filterConfig.status || emp.status === filterConfig.status;
      const matchesAgeRange = !filterConfig.ageRange || 
        (filterConfig.ageRange === 'young' && emp.age < 30) ||
        (filterConfig.ageRange === 'middle' && emp.age >= 30 && emp.age < 50) ||
        (filterConfig.ageRange === 'senior' && emp.age >= 50);

      return matchesSearch && matchesDepartment && matchesStatus && matchesAgeRange;
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string') {
        return direction * aValue.localeCompare(bValue);
      }
      return direction * (aValue - bValue);
    });

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Employees</h4>
          <p>{error}</p>
          <hr />
          <button className="btn btn-outline-danger" onClick={fetchEmployees}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-page">
      <Header />
      <div className="container mt-5">
        <div className="card main-card shadow-lg rounded-4">
          <div className="card-header bg-gradient text-white text-center py-3">
            <h3 className="fw-bold mb-0">Employee Management</h3>
          </div>

          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="search-container flex-grow-1 me-3">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                    <FaSearch className="text-primary" />
                </span>
                <input
                  type="text"
                  className="form-control form-control-lg border-start-0 shadow-sm"
                  placeholder="Search by name, email, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

              <div className="d-flex gap-2">
                <Dropdown>
                  <Dropdown.Toggle variant="outline-primary" id="filter-dropdown">
                    <FaFilter className="me-2" />
                    Filters
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="p-3" style={{ minWidth: '250px' }}>
                    <div className="mb-3">
                      <label className="form-label">Department</label>
                      <select
                        className="form-select"
                        value={filterConfig.department}
                        onChange={(e) => handleFilterChange('department', e.target.value)}
                      >
                        <option value="">All Departments</option>
                        <option value="Sales">Sales</option>
                        <option value="Inventory">Inventory</option>
                        <option value="Customer Support">Customer Support</option>
                        <option value="Operation Management">Operation Management</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={filterConfig.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                      >
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Retired">Retired</option>
                        <option value="Terminated">Terminated</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Age Range</label>
                      <select
                        className="form-select"
                        value={filterConfig.ageRange}
                        onChange={(e) => handleFilterChange('ageRange', e.target.value)}
                      >
                        <option value="">All Ages</option>
                        <option value="young">Under 30</option>
                        <option value="middle">30-50</option>
                        <option value="senior">Over 50</option>
                      </select>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>

                <Button
                  variant="outline-success"
                  onClick={handleExport}
                  className="d-flex align-items-center"
                >
                  <FaDownload className="me-2" />
                  Export
                </Button>

                {selectedEmployees.length > 0 && (
                  <Button
                    variant="outline-danger"
                    onClick={handleBulkDelete}
                    className="d-flex align-items-center"
                  >
                    <FaTrash className="me-2" />
                    Delete Selected ({selectedEmployees.length})
                  </Button>
                )}
              </div>
            </div>

            {filteredAndSortedEmployees.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle table-bordered rounded-3 overflow-hidden custom-table">
                  <thead className="table-dark">
                    <tr>
                      <th className="text-center" style={{ width: '40px' }}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedEmployees.length === filteredAndSortedEmployees.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEmployees(filteredAndSortedEmployees.map(emp => emp.employeeid));
                            } else {
                              setSelectedEmployees([]);
                            }
                          }}
                        />
                      </th>
                      <th className="text-center sortable" onClick={() => handleSort('employeeid')}>
                        Employee ID <FaSort className="ms-1" />
                      </th>
                      <th className="sortable" onClick={() => handleSort('name')}>
                        Name <FaSort className="ms-1" />
                      </th>
                      <th className="text-center sortable" onClick={() => handleSort('age')}>
                        Age <FaSort className="ms-1" />
                      </th>
                      <th className="sortable" onClick={() => handleSort('department')}>
                        Department <FaSort className="ms-1" />
                      </th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedEmployees.map((emp) => (
                      <tr key={emp.employeeid} className="table-row">
                        <td className="text-center">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedEmployees.includes(emp.employeeid)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedEmployees([...selectedEmployees, emp.employeeid]);
                              } else {
                                setSelectedEmployees(selectedEmployees.filter(id => id !== emp.employeeid));
                              }
                            }}
                          />
                        </td>
                        <td className="text-center">{emp.employeeid}</td>
                        <td className="fw-medium">{emp.name}</td>
                        <td className="text-center">{emp.age}</td>
                        <td>{emp.department}</td>
                        <td>{emp.email}</td>
                        <td>{emp.mobile}</td>
                        <td className="text-center">
                          <Badge
                            bg={emp.status === 'Active' ? 'success' : 
                                emp.status === 'On Leave' ? 'warning' :
                                emp.status === 'Retired' ? 'info' : 'danger'}
                            className="status-badge"
                          >
                            {emp.status}
                          </Badge>
                        </td>
                        <td className="text-center">
                          <div className="btn-group">
                            <Button
                              variant="outline-info"
                              size="sm"
                              className="action-btn me-2"
                            onClick={() => handleViewAndUpdate(emp)}
                          >
                              <FaEdit className="me-1" /> Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="action-btn"
                            onClick={() => handleDelete(emp.employeeid)}
                          >
                              <FaTrash className="me-1" /> Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-warning text-center no-data-alert">
                <i className="fas fa-exclamation-circle me-2"></i>
                No employees found matching your criteria.
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {selectedEmployee && (
          <Modal show={showModal} onHide={handleCloseModal} centered className="custom-modal">
            <Modal.Header closeButton className="bg-gradient text-white">
              <Modal.Title>
                <FaEdit className="me-2" />
                Update Employee
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {["name", "age", "department", "email", "mobile"].map((field) => (
                <div className="mb-3" key={field}>
                  <label htmlFor={field} className="form-label text-capitalize fw-medium">
                    {field}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    id={field}
                    type={field === "age" ? "number" : "text"}
                    className="form-control custom-input"
                    name={field}
                    value={selectedEmployee?.[field] || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              ))}
              <label htmlFor="status" className="form-label fw-medium">
                Status
                <span className="text-danger">*</span>
              </label>
              <select
                id="status"
                className="form-select mb-3 custom-select"
                name="status"
                value={selectedEmployee?.status || "Active"}
                onChange={handleInputChange}
                required
              >
                <option>Active</option>
                <option>On Leave</option>
                <option>Retired</option>
                <option>Terminated</option>
              </select>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal} className="modal-btn">
                <FaTimes className="me-1" /> Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdate} className="modal-btn">
                <FaSave className="me-1" /> Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AllEmployees;
