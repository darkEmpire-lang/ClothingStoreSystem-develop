import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Badge,
  Spinner,
  Alert,
  Container,
  InputGroup,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { FaEdit, FaTrash, FaCalendarAlt,FaCloudUploadAlt } from "react-icons/fa";

const MyTickets = () => {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editForm, setEditForm] = useState({
    productCategory: "",
    product: "",
    subject: "",
    inquiry: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4058/api/tickets/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data.tickets.reverse());
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to fetch your tickets."
      );
    }
    setLoading(false);
  };

  // Filtering by date
  const filteredTickets = tickets.filter((ticket) => {
    let match = true;
    if (dateFrom) {
      match = match && new Date(ticket.createdAt) >= new Date(dateFrom + "T00:00:00");
    }
    if (dateTo) {
      match = match && new Date(ticket.createdAt) <= new Date(dateTo + "T23:59:59");
    }
    return match;
  });

  // Open edit modal
  const handleEdit = (ticket) => {
    setSelectedTicket(ticket);
    setEditForm({
      productCategory: ticket.productCategory,
      product: ticket.product,
      subject: ticket.subject,
      inquiry: ticket.inquiry,
      image: null,
    });
    setPreview(ticket.image || null);
    setEditModal(true);
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setEditForm((prev) => ({ ...prev, image: file }));
      setPreview(file ? URL.createObjectURL(file) : null);
    } else if (name === "productCategory") {
      setEditForm((prev) => ({
        ...prev,
        productCategory: value,
        product: "",
      }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessMsg("");
    if (
      !editForm.productCategory ||
      !editForm.product ||
      !editForm.subject ||
      !editForm.inquiry
    ) {
      setMessage("Please fill all required fields.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("productCategory", editForm.productCategory);
      formData.append("product", editForm.product);
      formData.append("subject", editForm.subject);
      formData.append("inquiry", editForm.inquiry);
      if (editForm.image) formData.append("image", editForm.image);

      await axios.put(
        `http://localhost:4058/api/tickets/update/${selectedTicket._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccessMsg("Ticket updated successfully!");
      setEditModal(false);
      fetchTickets();
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Failed to update ticket. (May only edit every 24 hours)"
      );
    }
  };

  // Delete ticket
  const handleDelete = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    setLoading(true);
    setMessage("");
    setSuccessMsg("");
    try {
      await axios.delete(
        `http://localhost:4058/api/tickets/delete/${ticketId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMsg("Ticket deleted.");
      fetchTickets();
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to delete ticket."
      );
    }
    setLoading(false);
  };

  // Clothing categories and products
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

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">My Tickets</h2>
        <span className="badge bg-dark fs-6 px-3 py-2">
          Total: {filteredTickets.length}
        </span>
      </div>
      <Row className="mb-4">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <FaCalendarAlt />
            </InputGroup.Text>
            <Form.Control
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              max={dateTo || ""}
              placeholder="From"
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <FaCalendarAlt />
            </InputGroup.Text>
            <Form.Control
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              min={dateFrom || ""}
              placeholder="To"
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          {(dateFrom || dateTo) && (
            <Button
              variant="outline-dark"
              className="w-100"
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
            >
              Clear Dates
            </Button>
          )}
        </Col>
      </Row>
      {loading && (
        <div className="text-center my-3">
          <Spinner animation="border" variant="dark" />
        </div>
      )}
      {message && <Alert variant="danger">{message}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}
      {filteredTickets.length === 0 && !loading && (
        <div className="text-center text-muted">No tickets found.</div>
      )}
      <Row xs={1} md={2} lg={2} className="g-4">
        {filteredTickets.map((ticket) => (
          <Col key={ticket._id}>
            <Card
              className="shadow h-100 border-0"
              style={{
                borderRadius: 18,
                background: "#fafafb",
              }}
            >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Card.Title className="mb-0 fs-5 fw-bold text-dark">
                    {ticket.subject}
                  </Card.Title>
                  <Badge
                    bg={ticket.replies.length > 0 ? "success" : "warning"}
                    text={ticket.replies.length > 0 ? "light" : "dark"}
                  >
                    {ticket.replies.length > 0 ? "Solved" : "Pending"}
                  </Badge>
                </div>
                <Card.Subtitle className="mb-2 text-secondary">
                  {ticket.productCategory} - {ticket.product}
                </Card.Subtitle>
                <Card.Text className="mb-2">
                  <span className="fw-bold">Inquiry:</span>{" "}
                  <span className="text-dark">{ticket.inquiry}</span>
                </Card.Text>
                {ticket.image && (
                  <div className="mb-2">
                    <img
                      src={ticket.image}
                      alt="Ticket"
                      className="rounded border"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        border: "1px solid #eee",
                      }}
                    />
                  </div>
                )}
                <div>
                  <span className="fw-bold">Replies:</span>
                  {ticket.replies && ticket.replies.length > 0 ? (
                    <ul className="list-group list-group-flush mt-1">
                      {ticket.replies.map((reply, idx) => (
                        <li
                          key={idx}
                          className="list-group-item small bg-light"
                        >
                          <span className="fw-bold text-success">Admin:</span>{" "}
                          {reply.message}{" "}
                          <span className="text-muted float-end">
                            {new Date(reply.date).toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-muted small mt-1">
                      No replies yet.
                    </div>
                  )}
                </div>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-end gap-2 bg-white border-0">
                <Button
                  variant="outline-dark"
                  size="sm"
                  onClick={() => handleEdit(ticket)}
                  title="Edit"
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(ticket._id)}
                  title="Delete"
                >
                  <FaTrash />
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Edit Modal */}
      <Modal show={editModal} onHide={() => setEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Ticket</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Product Category *</Form.Label>
              <Form.Select
                name="productCategory"
                value={editForm.productCategory}
                onChange={handleEditChange}
                required
              >
                <option value="">Select a category</option>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Product *</Form.Label>
              <Form.Select
                name="product"
                value={editForm.product}
                onChange={handleEditChange}
                required
                disabled={!editForm.productCategory}
              >
                <option value="">Select a product</option>
                {editForm.productCategory &&
                  PRODUCTS[editForm.productCategory]?.map((prod) => (
                    <option key={prod} value={prod}>
                      {prod}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subject *</Form.Label>
              <Form.Control
                type="text"
                name="subject"
                value={editForm.subject}
                onChange={handleEditChange}
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
                value={editForm.inquiry}
                onChange={handleEditChange}
                required
                maxLength={500}
              />
            </Form.Group>
            <Form.Group className="mb-3">
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
                    onChange={handleEditChange}
                    style={{ display: "none" }}
                  />
                  <div className="d-flex flex-column align-items-center">
                    <FaCloudUploadAlt size={32} color="#444" />
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditModal(false)}>
              Cancel
            </Button>
            <Button variant="dark" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default MyTickets;
