import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Table,
  Card,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  Badge,
  Spinner,
  Alert,
  Container,
  Modal,
} from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FaSearch, FaTrash, FaDownload, FaEye, FaUserTimes } from "react-icons/fa";
import html2canvas from "html2canvas";

const COLORS = ["#4f46e5", "#22c55e", "#f59e42", "#ef4444", "#a855f7"];
const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User&background=eee&color=222";
const USERS_PER_PAGE = 10;

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [replyData, setReplyData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const reportRef = useRef();

  // Modal state for image viewing
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");

  // Analytics
  const [solvedData, setSolvedData] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);

  // All users state
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersPage, setUsersPage] = useState(1);

  useEffect(() => {
    fetchTickets();
    fetchAllUsers();
    // eslint-disable-next-line
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4058/api/tickets/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(response.data.tickets);

      // Analytics: solved tickets per day
      const solvedByDay = {};
      response.data.tickets.forEach((ticket) => {
        if (ticket.replies.length > 0) {
          const day = new Date(ticket.updatedAt).toLocaleDateString();
          solvedByDay[day] = (solvedByDay[day] || 0) + 1;
        }
      });
      setSolvedData(
        Object.entries(solvedByDay)
          .sort((a, b) => new Date(a[0]) - new Date(b[0]))
          .map(([date, count]) => ({ date, count }))
      );

      // Top customers with profilePic
      const customerMap = {};
      response.data.tickets.forEach((ticket) => {
        const email = ticket.userId?.email || "Unknown";
        if (!customerMap[email]) {
          customerMap[email] = {
            name: ticket.userId?.name || "Unknown",
            email,
            profilePic: ticket.userId?.profilePic || "",
            count: 0,
          };
        }
        customerMap[email].count += 1;
      });
      setTopCustomers(
        Object.values(customerMap)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
      );
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to fetch tickets");
    }
  };

  // Fetch all users for admin
  const fetchAllUsers = async () => {
    setUsersLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4058/api/user/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Sort users by lastLogin (if available), else by createdAt, descending
      const sorted = [...res.data.users].sort((a, b) => {
        const aTime = a.lastLogin ? new Date(a.lastLogin) : new Date(a.createdAt);
        const bTime = b.lastLogin ? new Date(b.lastLogin) : new Date(b.createdAt);
        return bTime - aTime;
      });
      setAllUsers(sorted);
    } catch (err) {
      // handle error if needed
    }
    setUsersLoading(false);
  };

  // Admin deletes any user
  const handleAdminDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4058/api/user/admin-delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAllUsers();
    } catch (err) {
      // handle error if needed
    }
  };

  // Stats
  const totalTickets = tickets.length;
  const solvedTickets = tickets.filter((t) => t.replies.length > 0).length;
  const pendingTickets = tickets.filter((t) => t.replies.length === 0).length;
  const todaySolved = tickets.filter(
    (t) =>
      t.replies.length > 0 &&
      new Date(t.updatedAt).toLocaleDateString() === new Date().toLocaleDateString()
  ).length;

  // Search and filter logic
  const filteredTickets = tickets.filter((ticket) => {
    const searchMatch =
      ticket.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.userId?.email?.toLowerCase().includes(search.toLowerCase());
    let dateMatch = true;
    if (dateFrom) {
      dateMatch = dateMatch && new Date(ticket.createdAt) >= new Date(dateFrom + "T00:00:00");
    }
    if (dateTo) {
      dateMatch = dateMatch && new Date(ticket.createdAt) <= new Date(dateTo + "T23:59:59");
    }
    return searchMatch && dateMatch;
  });

  // Download daily report as PNG
  const downloadReport = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, {
      useCORS: true,
      backgroundColor: "#f3f4f6",
      scale: 2,
    });
    const link = document.createElement("a");
    link.download = `ticket_report_${new Date().toLocaleDateString().replace(/\//g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Ticket actions
  const handleReplyChange = (ticketId, value) => {
    setReplyData((prev) => ({ ...prev, [ticketId]: value }));
  };

  const handleReplySubmit = async (ticketId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:4058/api/tickets/reply",
        { ticketId, reply: replyData[ticketId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Reply sent successfully");
      setReplyData((prev) => ({ ...prev, [ticketId]: "" }));
      fetchTickets();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send reply");
    } finally {
      setLoading(false);
    }
  };

  const deleteTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4058/api/tickets/delete/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(tickets.filter((ticket) => ticket._id !== ticketId));
      setMessage("Ticket deleted successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete ticket");
    }
  };

  // Pie chart data
  const pieData = [
    { name: "Solved", value: solvedTickets },
    { name: "Pending", value: pendingTickets },
  ];

  // Modal handlers
  const handleShowImageModal = (imageUrl) => {
    setModalImageSrc(imageUrl);
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setModalImageSrc("");
  };

  // Pagination for users
  const pagedUsers = allUsers.slice(0, usersPage * USERS_PER_PAGE);
  const hasMoreUsers = allUsers.length > pagedUsers.length;

  return (
    <div className="bg-light min-vh-100 py-4 px-2">
      <Container>
        <Row className="mb-4 align-items-center">
          <Col>
            <h2 className="fw-bold text-primary">Admin Dashboard</h2>
          </Col>
          <Col className="text-end">
            <Button variant="success" onClick={downloadReport}>
              <FaDownload className="me-2" />
              Download Today's Report (PNG)
            </Button>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center shadow-sm mb-3">
              <Card.Body>
                <h5 className="fw-bold text-secondary">Total Tickets</h5>
                <h2 className="fw-bold text-primary">{totalTickets}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center shadow-sm mb-3">
              <Card.Body>
                <h5 className="fw-bold text-secondary">Solved</h5>
                <h2 className="fw-bold text-success">{solvedTickets}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center shadow-sm mb-3">
              <Card.Body>
                <h5 className="fw-bold text-secondary">Pending</h5>
                <h2 className="fw-bold text-warning">{pendingTickets}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center shadow-sm mb-3">
              <Card.Body>
                <h5 className="fw-bold text-secondary">Solved Today</h5>
                <h2 className="fw-bold text-info">{todaySolved}</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={8}>
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <h5 className="fw-bold mb-3">Solved Tickets Over Time</h5>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={solvedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <h5 className="fw-bold mb-3">Ticket Status</h5>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} label>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <h5 className="fw-bold mb-3">Top Customers</h5>
                <ul className="list-group">
                  {topCustomers.map((c, i) => (
                    <li
                      key={i}
                      className="list-group-item d-flex align-items-center"
                    >
                      <span
                        className="me-2 badge bg-primary rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: 26,
                          height: 26,
                          fontSize: 14,
                        }}
                      >
                        {i + 1}
                      </span>
                      <img
                        src={c.profilePic || DEFAULT_AVATAR}
                        alt="avatar"
                        className="rounded-circle me-2"
                        style={{
                          width: 38,
                          height: 38,
                          objectFit: "cover",
                          border: "2px solid #eee",
                          background: "#f5f5f7",
                        }}
                      />
                      <span className="fw-bold me-2 text-dark">{c.name}</span>
                      <span className="text-muted small">{c.email}</span>
                      <Badge bg="info" className="ms-auto">
                        {c.count} Tickets
                      </Badge>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <h5 className="fw-bold mb-3">Search & Filter</h5>
                <InputGroup className="mb-2">
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search by name or email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </InputGroup>
                <Form.Group className="mb-2">
                  <Form.Label>From</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    max={dateTo || ""}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>To</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    min={dateFrom || ""}
                  />
                </Form.Group>
                {(dateFrom || dateTo) && (
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => {
                      setDateFrom("");
                      setDateTo("");
                    }}
                  >
                    Clear Dates
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div ref={reportRef}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="fw-bold mb-3">Recent Tickets</h5>
              {message && <Alert variant="danger">{message}</Alert>}
              <div style={{ overflowX: "auto" }}>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Product</th>
                      <th>Subject</th>
                      <th>Inquiry</th>
                      <th>Image</th>
                      <th>Status</th>
                      <th>Reply</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.slice(0, 10).map((ticket) => (
                      <tr key={ticket._id}>
                        <td>
                          <div>
                            <span className="fw-bold">{ticket.userId?.name || "Unknown"}</span>
                            <br />
                            <span className="text-muted small">{ticket.userId?.email || "No Email"}</span>
                          </div>
                        </td>
                        <td>{ticket.product}</td>
                        <td>{ticket.subject}</td>
                        <td>{ticket.inquiry}</td>
                        <td>
                          {ticket.image ? (
                            <>
                              <img
                                src={ticket.image}
                                alt="Ticket"
                                className="img-thumbnail"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleShowImageModal(ticket.image)}
                              />
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 ms-2"
                                onClick={() => handleShowImageModal(ticket.image)}
                                title="View Full Image"
                              >
                                <FaEye />
                              </Button>
                            </>
                          ) : (
                            <span className="text-muted small">No image</span>
                          )}
                        </td>
                        <td>
                          {ticket.replies.length > 0 ? (
                            <Badge bg="success">Solved</Badge>
                          ) : (
                            <Badge bg="warning" text="dark">
                              Pending
                            </Badge>
                          )}
                        </td>
                        <td>
                          <Form.Control
                            as="textarea"
                            rows={1}
                            placeholder="Reply..."
                            value={replyData[ticket._id] || ""}
                            onChange={(e) =>
                              handleReplyChange(ticket._id, e.target.value)
                            }
                            className="mb-1"
                          />
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleReplySubmit(ticket._id)}
                            disabled={loading || !replyData[ticket._id]}
                          >
                            {loading ? <Spinner size="sm" /> : "Send"}
                          </Button>
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => deleteTicket(ticket._id)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* ALL USERS SECTION */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">All Users</h5>
                  <span className="badge bg-dark fs-6 px-3 py-2">
                    Total Users: {allUsers.length}
                  </span>
                </div>
                {usersLoading ? (
                  <Spinner animation="border" />
                ) : (
                  <>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Avatar</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Gender</th>
                          <th>Mobile</th>
                          <th>Last Login</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pagedUsers.map((user) => (
                          <tr key={user._id}>
                            <td>
                              <img
                                src={user.profilePic || DEFAULT_AVATAR}
                                alt="avatar"
                                className="rounded-circle"
                                style={{ width: 38, height: 38, objectFit: "cover" }}
                              />
                            </td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.gender}</td>
                            <td>{user.mobileNumber}</td>
                            <td>
                              {user.lastLogin
                                ? new Date(user.lastLogin).toLocaleString()
                                : user.createdAt
                                ? new Date(user.createdAt).toLocaleString()
                                : "-"}
                            </td>
                            <td>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleAdminDelete(user._id)}
                                title="Delete User"
                              >
                                <FaUserTimes />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {hasMoreUsers && (
                      <div className="text-center">
                        <Button
                          variant="outline-dark"
                          onClick={() => setUsersPage((p) => p + 1)}
                        >
                          See More
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Image Modal */}
      <Modal show={showImageModal} onHide={handleCloseImageModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Ticket Image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {modalImageSrc && (
            <img
              src={modalImageSrc}
              alt="Ticket Full"
              className="img-fluid img-thumbnail"
              style={{ maxHeight: "70vh" }}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
