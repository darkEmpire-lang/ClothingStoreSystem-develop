import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Table, Form } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";
import { PDFDocument, rgb } from "pdf-lib"; // Import from pdf-lib
import Header from "./Header";
import Footer from "./Footer"; 

function AllEmployees() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true); // Sort employees alphabetically by name
  const [departmentFilter, setDepartmentFilter] = useState(""); // Filter employees by department
  const [sortSalaryAsc, setSortSalaryAsc] = useState(true); // Sort employees by gross salary

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

  const calculateSalary = (employee) => {
    const baseSalaryRates = {
      Inventory: 110000.0,
      Sales: 90000.0,
      "Operation Management": 85000.0,
      "Customer Support": 100000.0,
    };

    const grossSalary = baseSalaryRates[employee.department] || 50000.0;
    const epf = (grossSalary * 12) / 100;
    const etf = (grossSalary * 3) / 100;
    const netSalary = grossSalary - epf - etf;

    return { grossSalary, epf, etf, netSalary };
  };

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());
  const handleSortByName = () => setSortAsc(!sortAsc); // Sort toggle by name
  const handleSortBySalary = () => setSortSalaryAsc(!sortSalaryAsc); // Sort toggle by salary

  const handleDepartmentFilter = (e) => setDepartmentFilter(e.target.value);

  const formatDepartment = (department) => {
    const formattedDepartments = {
      inventory: "Inventory",
      sales: "Sales",
      "customer support": "Customer Support",
      "operation management": "Operation Management",
    };
    return formattedDepartments[department.toLowerCase()] || department;
  };

  const downloadPDF = async (employee) => {
    const { grossSalary, epf, etf, netSalary } = calculateSalary(employee);
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { height } = page.getSize();

    // Add text content
    page.drawText("Live Art Clothing - Employee Salary Slip", {
      x: 20,
      y: height - 40,
      size: 20,
      color: rgb(0.2, 0.4, 0.8),
    });

    page.drawText(`Generated on: ${new Date().toLocaleString()}`, {
      x: 20,
      y: height - 60,
      size: 12,
    });

    page.drawText(`Employee ID: ${employee.employeeid}`, { x: 20, y: height - 100, size: 12 });
    page.drawText(`Name: ${employee.name}`, { x: 20, y: height - 120, size: 12 });
    page.drawText(`Department: ${formatDepartment(employee.department)}`, { x: 20, y: height - 140, size: 12 });

    page.drawText(`Gross Salary: LKR ${grossSalary.toLocaleString("en-LK")}`, { x: 20, y: height - 180, size: 12 });
    page.drawText(`EPF (12%): LKR ${epf.toLocaleString("en-LK")}`, { x: 20, y: height - 200, size: 12 });
    page.drawText(`ETF (3%): LKR ${etf.toLocaleString("en-LK")}`, { x: 20, y: height - 220, size: 12 });
    page.drawText(`Net Salary: LKR ${netSalary.toLocaleString("en-LK")}`, { x: 20, y: height - 240, size: 12 });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Salary_Slip_${employee.employeeid}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Apply search, department filter, and sorting
  const filteredEmployees = employees
    .filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm) &&
        (!departmentFilter || employee.department === departmentFilter)
    )
    .sort((a, b) =>
      sortSalaryAsc
        ? calculateSalary(a).grossSalary - calculateSalary(b).grossSalary
        : calculateSalary(b).grossSalary - calculateSalary(a).grossSalary
    )
    .sort((a, b) => (sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));

  return (
    <div>
      <Header/>
    <div className="container mt-5">
      
      <div className="card shadow-lg rounded-lg border-0 bg-light">
        <div className="card-header text-white fw-bold text-center py-3" style={{ backgroundColor: "#673ab7" }}>
          <h3>Employee Salaries</h3>
        </div>

        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Form.Control
              type="search"
              placeholder="Search by Name..."
              onChange={handleSearch}
              className="me-2 border-2 rounded-pill shadow-sm"
              style={{ padding: "12px", maxWidth: "300px" }}
            />

            <Form.Select onChange={handleDepartmentFilter} style={{ maxWidth: "200px" }}>
              <option value="">All Departments</option>
              <option value="Inventory">Inventory</option>
              <option value="Sales">Sales</option>
              <option value="Customer Support">Customer Support</option>
              <option value="Operation Management">Operation Management</option>
            </Form.Select>

            <Button onClick={handleSortBySalary} variant="info" className="text-white">
              Sort by Salary ({sortSalaryAsc ? "Asc" : "Desc"})
            </Button>
          </div>

          <div className="table-responsive">
            <Table striped bordered hover className="text-center">
              <thead className="bg-primary text-white">
                <tr>
                  <th>Employee ID</th>
                  <th onClick={handleSortByName}>Name</th>
                  <th>Department</th>
                  <th>Gross Salary (LKR)</th>
                  <th>EPF (12%)</th>
                  <th>ETF (3%)</th>
                  <th>Net Salary (LKR)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => {
                  const { grossSalary, epf, etf, netSalary } = calculateSalary(employee);

                  return (
                    <tr key={employee.employeeid}>
                      <td>{employee.employeeid}</td>
                      <td>{employee.name}</td>
                      <td>{formatDepartment(employee.department)}</td>
                      <td>LKR {grossSalary.toLocaleString("en-LK")}</td>
                      <td>LKR {epf.toLocaleString("en-LK")}</td>
                      <td>LKR {etf.toLocaleString("en-LK")}</td>
                      <td>LKR {netSalary.toLocaleString("en-LK")}</td>
                      <td>
                        <Button variant="success" onClick={() => downloadPDF(employee)}>
                          <FaDownload /> Download Salary Slip
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
}

export default AllEmployees;
