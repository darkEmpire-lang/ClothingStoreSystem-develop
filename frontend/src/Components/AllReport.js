import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer"; 
import {
  Table,
  Badge,
  Container,
  Spinner,
  Alert,
  InputGroup,
  FormControl,
  Button,
  Dropdown
} from "react-bootstrap";
import axios from "axios";
import {
  FaArrowUp,
  FaArrowDown,
  FaSortUp,
  FaSortDown,
  FaEye,
  FaTrashAlt,
  FaDownload
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";

function AllReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "month", direction: "asc" });
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;

  const navigate = useNavigate();

  const fetchReports = () => {
    setLoading(true);
    setError("");
    axios
      .get("http://localhost:4058/api/finance/")
      .then((response) => {
        setReports(response.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching finance reports:", err);
        setError("Failed to load finance reports. Please check your connection or try again later.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const sortedReports = [...reports].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredReports = sortedReports.filter((report) => {
    const matchesSearch =
      report.month.toLowerCase().includes(search.toLowerCase()) ||
      report.revenue.toString().includes(search) ||
      report.expenses.toString().includes(search);

    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Profit" && report.profitOrLoss > 0) ||
      (filterStatus === "Loss" && report.profitOrLoss < 0);

    return matchesSearch && matchesStatus;
  });

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleDelete = (reportId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:4058/api/finance/delete/${reportId}`)
          .then(() => {
            fetchReports();
            Swal.fire("Deleted!", "The report has been deleted.", "success");
          })
          .catch((err) => {
            console.error("Error deleting report:", err);
            Swal.fire("Error!", "Failed to delete the report. Please try again.", "error");
          });
      }
    });
  };

  const handleDownloadPDF = (report) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 255);
    doc.setFontSize(18);
    doc.text("Live Art Clothing Pvt Ltd - Financial Report", 20, 20);
    doc.setLineWidth(0.5);
    doc.line(20, 22, 190, 22);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text("Generated on: " + new Date().toLocaleString(), 20, 30);
    doc.line(20, 32, 190, 32);
    doc.setTextColor(0, 102, 204);
    doc.text(`Report for ${report.month}`, 20, 40);
    doc.setTextColor(0, 0, 0);
    doc.rect(20, 45, 170, 40);
    doc.text(`Month: ${report.month}`, 25, 50);
    doc.text(`Revenue: LKR ${report.revenue.toLocaleString()}`, 25, 60);
    doc.text(`Expenses: LKR ${report.expenses.toLocaleString()}`, 25, 70);
    doc.setTextColor(report.profitOrLoss >= 0 ? 34 : 255, report.profitOrLoss >= 0 ? 139 : 69, report.profitOrLoss >= 0 ? 34 : 0);
    doc.text(`Profit/Loss: LKR ${report.profitOrLoss.toLocaleString()}`, 25, 80);
    doc.setLineWidth(0.5);
    doc.line(20, 90, 190, 90);
    doc.setTextColor(0, 0, 0);
    doc.text("Signed by: [Store Manager Name]", 20, 100);
    doc.text("____________________", 20, 110);
    doc.setTextColor(128, 0, 128);
    doc.text("Live Art Clothing Pvt Ltd | All rights reserved", 20, 120);
    doc.save(`LiveArtClothing_FinancialReport_${report.month}.pdf`);
  };

  return (
    <div>
      <Header />
      <Container className="my-5">
        <h2 className="text-center mb-4 text-primary fw-bold">All Finance Reports - Live Art Clothing Pvt Ltd</h2>

        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
          <InputGroup style={{ maxWidth: "400px" }} className="shadow-sm rounded-pill">
            <FormControl
              placeholder="Search by month, revenue, or expenses"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-start-pill border-end-0"
            />
            <InputGroup.Text className="bg-white rounded-end-pill">🔍</InputGroup.Text>
          </InputGroup>

          <Dropdown onSelect={(eventKey) => setFilterStatus(eventKey)}>
            <Dropdown.Toggle variant="outline-info" className="shadow-sm">
              Filter: {filterStatus}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="All">All</Dropdown.Item>
              <Dropdown.Item eventKey="Profit">Profit</Dropdown.Item>
              <Dropdown.Item eventKey="Loss">Loss</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status" />
            <p className="mt-2">Loading reports, please wait...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <Alert variant="danger">{error}</Alert>
            <Button variant="primary" onClick={fetchReports}>Retry</Button>
          </div>
        ) : (
          <>
            {filteredReports.length > 0 ? (
              <>
                <Table striped bordered hover responsive className="shadow-sm rounded-3 overflow-hidden">
                  <thead className="bg-dark text-white text-center">
                    <tr>
                      <th>#</th>
                      <th onClick={() => handleSort("month")} style={{ cursor: "pointer" }}>
                        Month {sortConfig.key === "month" && (sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />)}
                      </th>
                      <th onClick={() => handleSort("revenue")} style={{ cursor: "pointer" }}>
                        Revenue {sortConfig.key === "revenue" && (sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />)}
                      </th>
                      <th onClick={() => handleSort("expenses")} style={{ cursor: "pointer" }}>
                        Expenses {sortConfig.key === "expenses" && (sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />)}
                      </th>
                      <th>Profit or Loss</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentReports.map((report, index) => (
                      <tr key={report.id || report._id}>
                        <td>{indexOfFirstReport + index + 1}</td>
                        <td className="fw-bold text-primary">{report.month}</td>
                        <td>LKR {report.revenue.toLocaleString()}</td>
                        <td>LKR {report.expenses.toLocaleString()}</td>
                        <td>
                          {report.profitOrLoss >= 0 ? (
                            <Badge bg="success" className="px-3 py-2 rounded-pill">
                              <FaArrowUp /> Profit: LKR {report.profitOrLoss.toLocaleString()}
                            </Badge>
                          ) : (
                            <Badge bg="danger" className="px-3 py-2 rounded-pill">
                              <FaArrowDown /> Loss: LKR {Math.abs(report.profitOrLoss).toLocaleString()}
                            </Badge>
                          )}
                        </td>
                        <td className="text-center">
                          <Button variant="outline-primary" size="sm" className="me-2" onClick={() => navigate(`/view-report/${report.id || report._id}`)}>
                            <FaEye /> View
                          </Button>
                          <Button variant="outline-danger" size="sm" className="me-2" onClick={() => handleDelete(report.id || report._id)}>
                            <FaTrashAlt /> Delete
                          </Button>
                          <Button variant="outline-info" size="sm" onClick={() => handleDownloadPDF(report)}>
                            <FaDownload /> PDF
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <div className="d-flex justify-content-between align-items-center mt-4">
                  <Button variant="outline-secondary" disabled={currentPage === 1} onClick={handlePrevPage}>
                    Previous
                  </Button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <Button variant="outline-secondary" disabled={currentPage === totalPages} onClick={handleNextPage}>
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <Alert variant="info" className="text-center">No reports found.</Alert>
            )}
          </>
        )}
      </Container>
      <Footer />
    </div>
  );
}

export default AllReport;
