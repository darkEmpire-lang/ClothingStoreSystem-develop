import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Button, Table, Form, Row, Col, DropdownButton, Dropdown } from "react-bootstrap";
import { FaSearch, FaSortAlphaDown, FaSortAlphaUpAlt } from "react-icons/fa";
import Select from "react-select";
import Header from "./Header";
import Footer from "./Footer"; 

function AllEmployees() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [filterBy, setFilterBy] = useState({ department: "", status: "" });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:4058/api/employee/");
      if (response && response.data) {
        setEmployees(response.data);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const assignSalary = (employee) => {
    if (!employee.salary) {
      const salaryDetails = calculateSalary(employee.department);
      const updatedEmployee = { ...employee, ...salaryDetails };
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.employeeid === employee.employeeid ? updatedEmployee : emp
        )
      );
      Swal.fire("Success", "Salary assigned successfully!", "success");
    }
  };

  const calculateSalary = (department) => {
    const baseSalaryRates = {
      Inventory: 110000.0,
      Sales: 90000.0,
      "Operation Management": 85000.0,
      "Customer Support": 100000.0,
    };

    const salary = baseSalaryRates[department] || 50000.0;
    const epf = (salary * 12) / 100;
    const etf = (salary * 3) / 100;
    const netSalary = salary - epf - etf;

    return { salary, epf, etf, netSalary };
  };

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setSelectedEmployee(null);
  };

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const handleSort = () => setSortAsc(!sortAsc);

  const formatDepartment = (department) => {
    const formattedDepartments = {
      inventory: "Inventory",
      sales: "Sales",
      "customer support": "Customer Support",
      "operation management": "Operation Management",
    };
    return formattedDepartments[department.toLowerCase()] || department;
  };

  // Search and Filter logic
  const filteredEmployees = employees
    .filter((employee) => {
      return (
        employee.name.toLowerCase().includes(searchTerm) &&
        (filterBy.department ? employee.department === filterBy.department : true) &&
        (filterBy.status ? employee.status === filterBy.status : true)
      );
    })
    .sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

  return (
    <div>
      <Header/>
    <div className="container mt-5">
      <div className="card shadow-lg rounded-lg border-0 bg-light">
        <div
          className="card-header text-white fw-bold text-center py-3"
          style={{ backgroundColor: "#673ab7" }}
        >
          <h3>Salaries of Employees</h3>
        </div>

        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Row className="w-100">
              <Col md={4}>
                <Form className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="Search by Name..."
                    onChange={handleSearch}
                    className="me-2 border-2 rounded-pill shadow-sm"
                    style={{ padding: "12px" }}
                  />
                  <FaSearch className="text-primary mt-2" />
                </Form>
              </Col>

              <Col md={4}>
                <Select
                  options={[
                    { value: "", label: "All Departments" },
                    { value: "Inventory", label: "Inventory" },
                    { value: "Sales", label: "Sales" },
                    { value: "Customer Support", label: "Customer Support" },
                    { value: "Operation Management", label: "Operation Management" },
                  ]}
                  onChange={(selectedOption) => setFilterBy((prev) => ({ ...prev, department: selectedOption.value }))}
                  placeholder="Filter by Department"
                />
              </Col>

              <Col md={4}>
                <Select
                  options={[
                    { value: "", label: "All Statuses" },
                    { value: "Active", label: "Active" },
                    { value: "Inactive", label: "Inactive" },
                  ]}
                  onChange={(selectedOption) => setFilterBy((prev) => ({ ...prev, status: selectedOption.value }))}
                  placeholder="Filter by Status"
                />
              </Col>
            </Row>

            <Button
              variant="light"
              onClick={handleSort}
              className="btn-sm border rounded-pill shadow-sm mt-4"
            >
              {sortAsc ? <FaSortAlphaDown /> : <FaSortAlphaUpAlt />} Sort by Name
            </Button>
          </div>

          {filteredEmployees.length > 0 ? (
            <div className="table-responsive">
              <Table striped bordered hover className="text-center table-hover">
                <thead className="bg-primary text-white">
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Department</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Status</th>
                    <th>Salary (LKR)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.employeeid}>
                      <td>{employee.employeeid}</td>
                      <td>{employee.name}</td>
                      <td>{employee.age}</td>
                      <td>{formatDepartment(employee.department)}</td>
                      <td>{employee.email}</td>
                      <td>{employee.mobile}</td>
                      <td>{employee.status}</td>
                      <td>
                        {employee.salary
                          ? `LKR ${employee.salary.toLocaleString("en-LK")}`
                          : <span className="badge bg-warning">Not Assigned</span>}
                      </td>
                      <td>
                        <Button
                          className={`btn-sm ${employee.salary ? "btn-secondary" : "btn-outline-primary"} me-2`}
                          onClick={() => assignSalary(employee)}
                          disabled={!!employee.salary}
                        >
                          {employee.salary ? "Salary Assigned" : "Assign Salary"}
                        </Button>
                        <Button
                          className="btn-sm btn-outline-info"
                          onClick={() => handleView(employee)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="alert alert-info text-center">No employees found.</div>
          )}
        </div>
      </div>

      {/* View Employee Modal */}
      {selectedEmployee && (
        <Modal show={showViewModal} onHide={handleCloseModal} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Employee Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Employee ID:</strong> {selectedEmployee.employeeid}</p>
            <p><strong>Name:</strong> {selectedEmployee.name}</p>
            <p><strong>Department:</strong> {selectedEmployee.department}</p>
            {selectedEmployee.salary && (
              <>
                <p><strong>Salary:</strong> LKR {selectedEmployee.salary.toLocaleString("en-LK")}</p>
                <p><strong>EPF (12%):</strong> LKR {selectedEmployee.epf.toLocaleString("en-LK")}</p>
                <p><strong>ETF (3%):</strong> LKR {selectedEmployee.etf.toLocaleString("en-LK")}</p>
                <p><strong>Net Salary:</strong> LKR {selectedEmployee.netSalary.toLocaleString("en-LK")}</p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
          <Footer/>
        </Modal>
      )}
    </div>
    </div>
  );
}

export default AllEmployees;
