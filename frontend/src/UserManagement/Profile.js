import React, { useState } from "react";
import { Card, Container, Row, Col, Button, Modal, Form, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User&background=eee&color=222";

const Profile = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    gender: user?.gender || "",
    dateOfBirth: user?.dateOfBirth || "",
    mobileNumber: user?.mobileNumber || "",
    address: user?.address || "",
    profilePic: null,
  });
  const [preview, setPreview] = useState(user?.profilePic || "");
  const [message, setMessage] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  if (!user) return <h2 className="text-center mt-5 text-dark">Please login first.</h2>;

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic") {
      const file = files[0];
      setEditForm((prev) => ({ ...prev, profilePic: file }));
      setPreview(file ? URL.createObjectURL(file) : user.profilePic);
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("gender", editForm.gender);
      formData.append("dateOfBirth", editForm.dateOfBirth);
      formData.append("mobileNumber", editForm.mobileNumber);
      formData.append("address", editForm.address);
      if (editForm.profilePic) formData.append("profilePic", editForm.profilePic);

      const res = await axios.put(
        `http://localhost:4058/api/user/update/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.success) {
        setMessage("Profile updated successfully!");
        window.location.reload();
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage("Failed to update profile.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4058/api/user/delete/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
      navigate("/");
    } catch {
      setMessage("Failed to delete account.");
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={7} lg={6}>
            <Card className="shadow border-0" style={{ borderRadius: "22px", padding: "32px 0", background: "#fff" }}>
              <Card.Body>
                <div className="d-flex flex-column align-items-center mb-4">
                  <div
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "4px solid #222",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
                      marginBottom: 18,
                      background: "#f5f5f7",
                      position: "relative",
                    }}
                  >
                    <img
                      src={preview || DEFAULT_AVATAR}
                      alt="Profile"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    {editMode && (
                      <label
                        htmlFor="profilePic"
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          background: "#fff",
                          borderRadius: "50%",
                          padding: 6,
                          cursor: "pointer",
                          border: "1px solid #ccc",
                        }}
                        title="Change photo"
                      >
                        <input
                          type="file"
                          id="profilePic"
                          name="profilePic"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleEditChange}
                        />
                        <span style={{ fontSize: 18, color: "#222" }}>✎</span>
                      </label>
                    )}
                  </div>
                  <Card.Title className="mb-0 fs-2 fw-bold text-black">
                    {editMode ? (
                      <Form.Control
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="text-center fw-bold"
                        style={{ fontSize: "1.7rem" }}
                        required
                      />
                    ) : (
                      user.name
                    )}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-secondary fs-5">
                    {user.email}
                  </Card.Subtitle>
                  <Button
                    variant="dark"
                    className="mt-3 fw-bold px-5 py-2"
                    style={{
                      borderRadius: "30px",
                      fontSize: "1.1rem",
                      letterSpacing: "1px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                      transition: "background 0.2s",
                    }}
                    onClick={() => navigate("/my-tickets")}
                  >
                    My Tickets
                  </Button>
                </div>
                <hr style={{ borderColor: "#ddd" }} />
                {message && <Alert variant="info">{message}</Alert>}
                <Form onSubmit={handleEditSubmit}>
                  <Row className="mb-3">
                    <Col md={6} className="mb-2">
                      <div>
                        <span className="fw-bold text-black">Gender:</span>{" "}
                        {editMode ? (
                          <Form.Select
                            name="gender"
                            value={editForm.gender}
                            onChange={handleEditChange}
                            required
                          >
                            <option value="">Select gender</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                          </Form.Select>
                        ) : (
                          <span className="text-black">{user.gender}</span>
                        )}
                      </div>
                      <div className="mt-2">
                        <span className="fw-bold text-black">Date of Birth:</span>{" "}
                        {editMode ? (
                          <Form.Control
                            type="date"
                            name="dateOfBirth"
                            value={editForm.dateOfBirth?.slice(0, 10)}
                            onChange={handleEditChange}
                            required
                          />
                        ) : (
                          <span className="text-black">
                            {new Date(user.dateOfBirth).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </Col>
                    <Col md={6} className="mb-2">
                      <div>
                        <span className="fw-bold text-black">Mobile Number:</span>{" "}
                        {editMode ? (
                          <Form.Control
                            type="text"
                            name="mobileNumber"
                            value={editForm.mobileNumber}
                            onChange={handleEditChange}
                            required
                          />
                        ) : (
                          <span className="text-black">{user.mobileNumber}</span>
                        )}
                      </div>
                      <div className="mt-2">
                        <span className="fw-bold text-black">Address:</span>{" "}
                        {editMode ? (
                          <Form.Control
                            as="textarea"
                            name="address"
                            value={editForm.address}
                            onChange={handleEditChange}
                            required
                          />
                        ) : (
                          <span className="text-black">{user.address}</span>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <div className="text-end mt-4">
                    <span className="text-muted small">
                      Account created: {new Date(user.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="d-flex justify-content-end align-items-center mt-4 gap-2">
                    {!editMode && (
                      <>
                        <Button variant="outline-dark" onClick={() => setEditMode(true)}>
                          Edit Profile
                        </Button>
                        <Button variant="outline-danger" onClick={() => setShowDelete(true)}>
                          Delete Account
                        </Button>
                      </>
                    )}
                    {editMode && (
                      <>
                        <Button variant="secondary" onClick={() => setEditMode(false)}>
                          Cancel
                        </Button>
                        <Button variant="dark" type="submit">
                          Save Changes
                        </Button>
                      </>
                    )}
                  </div>
                </Form>
                {/* Delete Modal */}
                <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Delete Account</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDelete(false)}>
                      Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                      Delete
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
