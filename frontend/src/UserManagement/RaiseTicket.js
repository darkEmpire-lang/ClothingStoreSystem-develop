import React, { useState } from "react";
import { Form, Button, Card, Container, Row, Col, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";

const PRODUCT_CATEGORIES = [
  "Tops", "Bottoms", "Outerwear", "Dresses", "Footwear", "Accessories"
];

const PRODUCTS = {
  Tops: ["T-Shirt", "Shirt", "Blouse", "Sweater", "Hoodie"],
  Bottoms: ["Jeans", "Shorts", "Skirt", "Trousers", "Leggings"],
  Outerwear: ["Jacket", "Coat", "Blazer", "Raincoat"],
  Dresses: ["Casual Dress", "Evening Dress", "Party Dress", "Sundress"],
  Footwear: ["Sneakers", "Boots", "Sandals", "Heels", "Loafers"],
  Accessories: ["Hat", "Belt", "Scarf", "Bag", "Jewelry"],
};

const RaiseTicket = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    productCategory: "",
    product: "",
    subject: "",
    inquiry: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (file) {
        setForm((prev) => ({ ...prev, image: file }));
        setPreview(URL.createObjectURL(file));
      }
    } else if (name === "productCategory") {
      setForm((prev) => ({
        ...prev,
        productCategory: value,
        product: "",
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (
      !form.productCategory ||
      !form.product ||
      !form.subject ||
      !form.inquiry
    ) {
      setError("Please fill all required fields.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("productCategory", form.productCategory);
      formData.append("product", form.product);
      formData.append("subject", form.subject);
      formData.append("inquiry", form.inquiry);
      if (form.image) formData.append("image", form.image);

      await axios.post("http://localhost:4058/api/tickets/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Ticket submitted successfully!");
      setTimeout(() => navigate("/my-tickets"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit ticket.");
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg border-0" style={{ borderRadius: 18 }}>
            <Card.Body>
              <h2 className="mb-4 text-center fw-bold" style={{ color: "#111" }}>Raise a Ticket</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Product Category *</Form.Label>
                      <Form.Select
                        name="productCategory"
                        value={form.productCategory}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a category</option>
                        {PRODUCT_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Product *</Form.Label>
                      <Form.Select
                        name="product"
                        value={form.product}
                        onChange={handleChange}
                        required
                        disabled={!form.productCategory}
                      >
                        <option value="">Select a product</option>
                        {form.productCategory &&
                          PRODUCTS[form.productCategory]?.map((prod) => (
                            <option key={prod} value={prod}>{prod}</option>
                          ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Subject *</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    maxLength={80}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Inquiry *</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="inquiry"
                    rows={3}
                    placeholder="Describe your issue..."
                    value={form.inquiry}
                    onChange={handleChange}
                    required
                    maxLength={500}
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Attach Image (optional)</Form.Label>
                  <div
                    className="d-flex align-items-center gap-3"
                    style={{
                      background: "#fafafb",
                      border: "2px dashed #bbb",
                      borderRadius: 12,
                      padding: "18px 20px",
                      minHeight: 120,
                    }}
                  >
                    <label className="mb-0" style={{ cursor: "pointer" }}>
                      <input
                        type="file"
                        name="image"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleChange}
                        style={{ display: "none" }}
                      />
                      <div className="d-flex flex-column align-items-center">
                        <FaCloudUploadAlt size={36} color="#444" />
                        <span className="small text-muted">Click to upload</span>
                      </div>
                    </label>
                    {preview && (
                      <img
                        src={preview}
                        alt="Preview"
                        className="rounded border"
                        style={{ width: 90, height: 90, objectFit: "cover" }}
                      />
                    )}
                  </div>
                </Form.Group>
                <Button
                  variant="dark"
                  type="submit"
                  className="w-100 fw-bold py-2"
                  style={{ fontSize: "1.1rem", borderRadius: 8 }}
                >
                  Submit Ticket
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RaiseTicket;
