// ReportDetails.js
// ReportDetails.js
import React, { useEffect, useState } from "react";
import { Container, Card, Spinner, Alert, ProgressBar, Button } from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import Footer from "./Footer"; 

function ReportDetails() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`http://localhost:5005/api/finance/${id}`);
        if (response.data) {
          console.log("Fetched report data:", response.data);
          setReport(response.data);
        } else {
          throw new Error("No report data found.");
        }
      } catch (err) {
        console.error("Error fetching report data:", err);
        setError("Failed to load report details. Please check your connection or try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading report details, please wait...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="danger">{error}</Alert>
        <Button variant="info" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  const { month = "N/A", revenue = 0, expenses = 0, profitOrLoss = 0 } = report;
  const revenueValue = parseFloat(revenue) || 0;
  const expensesValue = parseFloat(expenses) || 0;
  const profitValue = revenueValue - expensesValue;
  const totalRevenue = revenueValue > 0 ? revenueValue : 1;

  const expensesPercentage = ((expensesValue / totalRevenue) * 100).toFixed(1);
  const profitPercentage = profitValue >= 0 ? ((profitValue / totalRevenue) * 100).toFixed(1) : 0;
  const lossPercentage = profitValue < 0 ? ((Math.abs(profitValue) / totalRevenue) * 100).toFixed(1) : 0;

  return (
    <div>
      <Header/>
    <Container className="my-5">
      <Card className="shadow-lg border-0">
        <Card.Header
          className="text-white text-center py-4"
          style={{
            background: "linear-gradient(135deg, #6a11cb, #2575fc)",
            borderBottom: "5px solid #ffffff",
          }}
        >
          <h2 style={{ fontWeight: "bold" }}>Financial Report - {month}</h2>
        </Card.Header>
        <Card.Body style={{ backgroundColor: "#f9f9f9", padding: "2rem" }}>
          <div className="mb-4">
            <h4 className="mb-3" style={{ borderBottom: "2px solid #007bff", paddingBottom: "0.5rem" }}>Overview</h4>
            <p><strong>Month:</strong> {month}</p>
            <p><strong>Revenue:</strong> <span className="text-success">LKR {revenueValue.toLocaleString()}</span></p>
            <p><strong>Expenses:</strong> <span className="text-danger">LKR {expensesValue.toLocaleString()}</span></p>
            <p>
              <strong>Profit or Loss:</strong>{" "}
              {profitValue >= 0 ? (
                <span style={{ color: "green", fontWeight: "bold" }}>Profit: LKR {profitValue.toLocaleString()}</span>
              ) : (
                <span style={{ color: "red", fontWeight: "bold" }}>Loss: LKR {Math.abs(profitValue).toLocaleString()}</span>
              )}
            </p>
          </div>

          <div className="mb-4">
            <h5 className="mb-2">Revenue Overview</h5>
            <ProgressBar animated striped variant="info" now={100} label={`LKR ${revenueValue.toLocaleString()}`} />
          </div>

          <div className="mb-4">
            <h5 className="mb-2">Expenses (Percentage of Revenue)</h5>
            <ProgressBar
              animated
              striped
              variant="danger"
              now={expensesPercentage}
              label={`${expensesPercentage}%`}
              style={{ height: "1.5rem" }}
            />
          </div>

          <div className="mb-4">
            <h5 className="mb-2">Profit or Loss Overview</h5>
            {profitValue >= 0 ? (
              <ProgressBar
                animated
                striped
                variant="success"
                now={profitPercentage}
                label={`${profitPercentage}% Profit`}
                style={{ height: "1.5rem" }}
              />
            ) : (
              <ProgressBar
                animated
                striped
                variant="warning"
                now={lossPercentage}
                label={`${lossPercentage}% Loss`}
                style={{ height: "1.5rem" }}
              />
            )}
          </div>
        </Card.Body>
        <Card.Footer className="text-center" style={{ backgroundColor: "#f0f8ff" }}>
          <Button
            variant="outline-primary"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-pill"
            style={{
              background: "linear-gradient(135deg, #3a6073, #16222a)",
              border: "none",
              color: "#fff",
            }}
          >
            Go Back
          </Button>
        </Card.Footer>
      </Card>
    </Container>
    <Footer/>
    </div>
  );
}

export default ReportDetails;
